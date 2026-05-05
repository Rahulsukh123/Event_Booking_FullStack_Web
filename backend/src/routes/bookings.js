const express = require('express');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const { protect, authorize } = require('../middleware/auth');
const { validateBooking, validatePagination } = require('../utils/validation');
const { AppError } = require('../middleware/errorHandler');

const router = express.Router();

// Helper function for pagination
const getPaginationOptions = (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return { skip, limit: Math.min(limit, 100) }; // Max limit of 100
};

// @route   GET /api/bookings
// @desc    Get current user's bookings
// @access  Private
router.get('/', protect, validatePagination, async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter = { user: req.user._id };
    if (status) filter.status = status;

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const { skip, limit: limitValue } = getPaginationOptions(parseInt(page), parseInt(limit));

    // Execute query
    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate({
          path: 'event',
          select: 'title date time location image category'
        })
        .sort(sortOptions)
        .skip(skip)
        .limit(limitValue)
        .lean(),
      Booking.countDocuments(filter)
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
        bookings,
        pagination
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking by ID
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('event')
      .populate('user', 'name email');

    if (!booking) {
      return next(new AppError('Booking not found', 404));
    }

    // Check if user owns the booking or is admin
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to view this booking', 403));
    }

    res.status(200).json({
      success: true,
      data: {
        booking
      }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new AppError('Invalid booking ID', 400));
    }
    next(error);
  }
});

// @route   POST /api/bookings
// @desc    Create new booking
// @access  Private
router.post('/', protect, validateBooking, async (req, res, next) => {
  try {
    const { eventId, numberOfTickets, contactInfo, specialRequests } = req.body;

    // Check if event exists and is available
    const event = await Event.findById(eventId);
    if (!event) {
      return next(new AppError('Event not found', 404));
    }

    if (event.status !== 'published') {
      return next(new AppError('Event is not available for booking', 400));
    }

    if (event.date <= new Date()) {
      return next(new AppError('Cannot book past events', 400));
    }

    // Check if event is fully booked
    if (event.isFullyBooked) {
      return next(new AppError('Event is fully booked', 400));
    }

    // Check if enough seats are available
    if (event.availableSeats < numberOfTickets) {
      return next(new AppError(`Only ${event.availableSeats} seats available`, 400));
    }

    // Check if user already booked this event
    const existingBooking = await Booking.findOne({
      user: req.user._id,
      event: eventId,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingBooking) {
      return next(new AppError('You have already booked this event', 400));
    }

    // Calculate total amount
    const totalAmount = event.pricing.type === 'free' ? 0 : event.pricing.amount * numberOfTickets;

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      event: eventId,
      numberOfTickets,
      totalAmount,
      currency: event.pricing.currency,
      contactInfo,
      specialRequests
    });

    // Update event booked seats
    await Event.findByIdAndUpdate(eventId, {
      $inc: { bookedSeats: numberOfTickets }
    });

    // Populate booking details
    await booking.populate('event', 'title date time location image category');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(new AppError('You have already booked this event', 400));
    }
    next(error);
  }
});

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel booking
// @access  Private
router.put('/:id/cancel', protect, async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('event');

    if (!booking) {
      return next(new AppError('Booking not found', 404));
    }

    // Check if user owns the booking or is admin
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to cancel this booking', 403));
    }

    if (booking.status === 'cancelled') {
      return next(new AppError('Booking is already cancelled', 400));
    }

    if (booking.status === 'refunded') {
      return next(new AppError('Booking has already been refunded', 400));
    }

    // Check if event is in the future (allow cancellation only before event)
    if (booking.event.date <= new Date()) {
      return next(new AppError('Cannot cancel bookings for past events', 400));
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    // Update event booked seats
    await Event.findByIdAndUpdate(booking.event._id, {
      $inc: { bookedSeats: -booking.numberOfTickets }
    });

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: {
        booking
      }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new AppError('Invalid booking ID', 400));
    }
    next(error);
  }
});

// @route   GET /api/bookings/admin/all
// @desc    Get all bookings (admin only)
// @access  Private (Admin only)
router.get('/admin/all', protect, authorize('admin'), validatePagination, async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      eventId,
      userId,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (eventId) filter.event = eventId;
    if (userId) filter.user = userId;

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const { skip, limit: limitValue } = getPaginationOptions(parseInt(page), parseInt(limit));

    // Execute query
    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate('event', 'title date time location category')
        .populate('user', 'name email')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitValue)
        .lean(),
      Booking.countDocuments(filter)
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
        bookings,
        pagination
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/bookings/admin/stats
// @desc    Get booking statistics (admin only)
// @access  Private (Admin only)
router.get('/admin/stats', protect, authorize('admin'), async (req, res, next) => {
  try {
    // Get overall booking statistics
    const stats = await Booking.getStats();

    // Get recent bookings
    const recentBookings = await Booking.find()
      .populate('event', 'title date')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get monthly revenue (last 6 months)
    const monthlyRevenue = await Booking.aggregate([
      {
        $match: {
          status: 'confirmed',
          createdAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats,
        recentBookings,
        monthlyRevenue
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
