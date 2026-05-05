const express = require('express');
const Event = require('../models/Event');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { validateEvent, validateEventUpdate, validatePagination } = require('../utils/validation');
const { AppError } = require('../middleware/errorHandler');

const router = express.Router();

// Helper function for pagination
const getPaginationOptions = (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return { skip, limit: Math.min(limit, 100) }; // Max limit of 100
};

// @route   GET /api/events
// @desc    Get all events with pagination and filtering
// @access  Public
router.get('/', optionalAuth, validatePagination, async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      city,
      dateFrom,
      dateTo,
      search,
      sortBy = 'date',
      sortOrder = 'asc',
      status = 'published'
    } = req.query;

    // Build filter
    const filter = { status };
    
    if (category) filter.category = category;
    if (city) filter['location.city'] = new RegExp(city, 'i');
    
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }

    // Search functionality
    if (search) {
      filter.$text = { $search: search };
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const { skip, limit: limitValue } = getPaginationOptions(parseInt(page), parseInt(limit));

    // Execute query
    const [events, total] = await Promise.all([
      Event.find(filter)
        .populate('organizer', 'name email')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitValue)
        .lean(),
      Event.countDocuments(filter)
    ]);

    // Pagination info
    const pagination = {
      page: parseInt(page),
      limit: limitValue,
      total,
      pages: Math.ceil(total / limitValue),
      hasNext: page * limitValue < total,
      hasPrev: page > 1
    };

    res.status(200).json({
      success: true,
      data: {
        events,
        pagination
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/events/:id
// @desc    Get single event by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email avatar');

    if (!event) {
      return next(new AppError('Event not found', 404));
    }

    // Check if event is published or user is the organizer
    if (event.status !== 'published' && (!req.user || req.user._id.toString() !== event.organizer._id.toString())) {
      return next(new AppError('Event not found', 404));
    }

    res.status(200).json({
      success: true,
      data: {
        event
      }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new AppError('Invalid event ID', 400));
    }
    next(error);
  }
});

// @route   POST /api/events
// @desc    Create new event
// @access  Private (Any authenticated user)
router.post('/', protect, validateEvent, async (req, res, next) => {
  try {
    const eventData = {
      ...req.body,
      organizer: req.user._id
    };

    const event = await Event.create(eventData);
    await event.populate('organizer', 'name email');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: {
        event
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/events/:id
// @desc    Update event
// @access  Private (Admin only)
router.put('/:id', protect, authorize('admin'), validateEventUpdate, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return next(new AppError('Event not found', 404));
    }

    // Don't allow updating certain fields if event has bookings
    if (event.bookedSeats > 0) {
      const restrictedFields = ['location.capacity', 'date', 'time'];
      const updateFields = Object.keys(req.body);
      
      for (const field of restrictedFields) {
        if (updateFields.includes(field)) {
          return next(new AppError(`Cannot update ${field} when event has bookings`, 400));
        }
      }
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('organizer', 'name email');

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: {
        event: updatedEvent
      }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new AppError('Invalid event ID', 400));
    }
    next(error);
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return next(new AppError('Event not found', 404));
    }

    // Check if event has bookings
    if (event.bookedSeats > 0) {
      return next(new AppError('Cannot delete event with existing bookings', 400));
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new AppError('Invalid event ID', 400));
    }
    next(error);
  }
});

// @route   GET /api/events/categories
// @desc    Get all event categories
// @access  Public
router.get('/meta/categories', async (req, res, next) => {
  try {
    const categories = ['conference', 'workshop', 'concert', 'sports', 'meetup', 'other'];
    
    const categoryStats = await Event.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const result = categories.map(category => ({
      name: category,
      count: categoryStats.find(stat => stat._id === category)?.count || 0
    }));

    res.status(200).json({
      success: true,
      data: {
        categories: result
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/events/cities
// @desc    Get all cities with events
// @access  Public
router.get('/meta/cities', async (req, res, next) => {
  try {
    const cities = await Event.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$location.city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        cities: cities.map(city => ({
          name: city._id,
          count: city.count
        }))
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/events/featured
// @desc    Get featured events
// @access  Public
router.get('/featured/list', async (req, res, next) => {
  try {
    const { limit = 6 } = req.query;
    
    const events = await Event.find({ 
      status: 'published',
      date: { $gte: new Date() }
    })
    .populate('organizer', 'name email')
    .sort({ date: 1, createdAt: -1 })
    .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        events
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/events/meta/categories
// @desc    Get all event categories
// @access  Public
router.get('/meta/categories', async (req, res, next) => {
  try {
    const categories = await Event.distinct('category');
    res.status(200).json({
      success: true,
      data: {
        categories
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/events/meta/cities
// @desc    Get all cities with events
// @access  Public
router.get('/meta/cities', async (req, res, next) => {
  try {
    const cities = await Event.distinct('location.city', { status: 'published' });
    res.status(200).json({
      success: true,
      data: {
        cities
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
