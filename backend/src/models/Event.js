const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['conference', 'workshop', 'concert', 'sports', 'meetup', 'other'],
    default: 'other'
  },
  date: {
    type: Date,
    required: [true, 'Event date is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Event date must be in the future'
    }
  },
  time: {
    type: String,
    required: [true, 'Event time is required'],
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time in HH:MM format']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required in hours'],
    min: [0.5, 'Duration must be at least 0.5 hours'],
    max: [24, 'Duration cannot exceed 24 hours']
  },
  location: {
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1']
    }
  },
  pricing: {
    type: {
      type: String,
      enum: ['free', 'paid'],
      required: true
    },
    amount: {
      type: Number,
      min: 0,
      validate: {
        validator: function(value) {
          return this.pricing.type === 'free' || value > 0;
        },
        message: 'Amount must be greater than 0 for paid events'
      }
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'INR']
    }
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled'],
    default: 'published'
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }],
  bookedSeats: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Virtual for available seats
eventSchema.virtual('availableSeats').get(function() {
  return this.location.capacity - this.bookedSeats;
});

// Virtual for is fully booked
eventSchema.virtual('isFullyBooked').get(function() {
  return this.bookedSeats >= this.location.capacity;
});

// Ensure bookedSeats doesn't exceed capacity
eventSchema.pre('save', function(next) {
  if (this.bookedSeats > this.location.capacity) {
    this.bookedSeats = this.location.capacity;
  }
  next();
});

// Indexes for better query performance
eventSchema.index({ date: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ 'location.city': 1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ title: 'text', description: 'text' }); // For search

// Ensure we get virtuals in JSON
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
