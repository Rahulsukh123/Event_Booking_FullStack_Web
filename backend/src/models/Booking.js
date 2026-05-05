const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  numberOfTickets: {
    type: Number,
    required: [true, 'Number of tickets is required'],
    min: [1, 'Must book at least 1 ticket'],
    max: [10, 'Cannot book more than 10 tickets at once']
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'INR']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'refunded'],
    default: 'confirmed'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'paid' // Simplified for demo
  },
  bookingReference: {
    type: String,
    required: true,
    unique: true
  },
  contactInfo: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    }
  },
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Generate unique booking reference before saving
bookingSchema.pre('save', async function(next) {
  if (!this.bookingReference) {
    const prefix = 'EVT';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.bookingReference = `${prefix}-${timestamp}-${random}`;
  }
  next();
});

// Prevent duplicate bookings for the same event and user
bookingSchema.index({ user: 1, event: 1 }, { unique: true });

// Indexes for better query performance
bookingSchema.index({ user: 1 });
bookingSchema.index({ event: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ bookingReference: 1 });
bookingSchema.index({ createdAt: -1 });

// Virtual for event details (populated when needed)
bookingSchema.virtual('eventDetails', {
  ref: 'Event',
  localField: 'event',
  foreignField: '_id',
  justOne: true
});

// Virtual for user details (populated when needed)
bookingSchema.virtual('userDetails', {
  ref: 'User',
  localField: 'user',
  foreignField: '_id',
  justOne: true
});

// Ensure we get virtuals in JSON
bookingSchema.set('toJSON', { virtuals: true });
bookingSchema.set('toObject', { virtuals: true });

// Static method to get booking statistics
bookingSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalRevenue: { $sum: '$totalAmount' }
      }
    }
  ]);
  
  return stats.reduce((acc, stat) => {
    acc[stat._id] = {
      count: stat.count,
      totalRevenue: stat.totalRevenue
    };
    return acc;
  }, {});
};

module.exports = mongoose.model('Booking', bookingSchema);
