import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useForm } from 'react-hook-form'
import { getEventById } from '../services/eventService'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'
import axios from 'axios'
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Ticket,
  ArrowLeft,
  User,
  Mail,
  Phone,
  CreditCard
} from 'lucide-react'

const EventDetail = () => {
  const { id } = useParams()
  const { isAuthenticated, user } = useAuth()
  const [showBookingForm, setShowBookingForm] = useState(false)
  const queryClient = useQueryClient()

  const { data: eventData, isLoading, error } = useQuery(
    ['event', id],
    () => getEventById(id),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      numberOfTickets: 1,
      contactInfo: {
        name: user?.name || '',
        email: user?.email || '',
        phone: ''
      }
    }
  })

  const bookingMutation = useMutation(
    (bookingData) => axios.post('/api/bookings', bookingData),
    {
      onSuccess: () => {
        toast.success('Booking successful!')
        setShowBookingForm(false)
        reset()
        queryClient.invalidateQueries(['event', id])
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Booking failed')
      }
    }
  )

  const onBookingSubmit = (data) => {
    bookingMutation.mutate({
      eventId: id,
      numberOfTickets: data.numberOfTickets,
      contactInfo: data.contactInfo,
      specialRequests: data.specialRequests
    })
  }

  if (isLoading) {
    return <LoadingSpinner text="Loading event details..." />
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load event details. Please try again.</p>
        <Link to="/events" className="btn-primary mt-4 inline-block">
          Back to Events
        </Link>
      </div>
    )
  }

  const event = eventData?.data?.event

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Event not found.</p>
        <Link to="/events" className="btn-primary mt-4 inline-block">
          Back to Events
        </Link>
      </div>
    )
  }

  const isFullyBooked = event.availableSeats <= 0
  const isPastEvent = new Date(event.date) <= new Date()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link 
        to="/events" 
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Events
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Header */}
          <div>
            <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden mb-6">
              {event.image ? (
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-64 lg:h-96 object-cover"
                />
              ) : (
                <div className="w-full h-64 lg:h-96 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                  <Calendar className="w-24 h-24 text-white" />
                </div>
              )}
            </div>

            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="badge-primary">{event.category}</span>
                  {event.isFullyBooked ? (
                    <span className="badge-danger">Fully Booked</span>
                  ) : (
                    <span className="badge-success">
                      {event.availableSeats} seats left
                    </span>
                  )}
                </div>
              </div>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed">{event.description}</p>
          </div>

          {/* Event Details */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Event Details</h3>
            </div>
            <div className="card-content space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Date</p>
                    <p className="text-gray-600">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Time</p>
                    <p className="text-gray-600">{event.time}</p>
                    <p className="text-sm text-gray-500">Duration: {event.duration} hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    <p className="text-gray-600">{event.location.venue}</p>
                    <p className="text-gray-600">{event.location.address}</p>
                    <p className="text-gray-600">{event.location.city}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Capacity</p>
                    <p className="text-gray-600">{event.location.capacity} seats</p>
                    <p className="text-sm text-gray-500">
                      {event.bookedSeats} booked, {event.availableSeats} available
                    </p>
                  </div>
                </div>
              </div>

              {event.tags && event.tags.length > 0 && (
                <div>
                  <p className="font-medium text-gray-900 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <span key={index} className="badge-secondary text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Organizer */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Organizer</h3>
            </div>
            <div className="card-content">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{event.organizer.name}</p>
                  <p className="text-gray-600">{event.organizer.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing & Booking */}
          <div className="card sticky top-6">
            <div className="card-content">
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-gray-900">
                  {event.pricing.type === 'free' ? 'Free' : `$${event.pricing.amount}`}
                </p>
                {event.pricing.type === 'paid' && (
                  <p className="text-gray-600">per ticket</p>
                )}
              </div>

              {!isAuthenticated ? (
                <div className="space-y-4">
                  <p className="text-center text-gray-600">
                    Please login to book this event
                  </p>
                  <Link to="/login" className="btn-primary w-full text-center">
                    Login to Book
                  </Link>
                </div>
              ) : isPastEvent ? (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">This event has already passed</p>
                  <Link to="/events" className="btn-outline">
                    Browse Other Events
                  </Link>
                </div>
              ) : isFullyBooked ? (
                <div className="text-center">
                  <p className="text-red-600 mb-4">This event is fully booked</p>
                  <Link to="/events" className="btn-outline">
                    Browse Other Events
                  </Link>
                </div>
              ) : !showBookingForm ? (
                <button
                  onClick={() => setShowBookingForm(true)}
                  className="btn-primary w-full"
                >
                  Book Now
                </button>
              ) : (
                <form onSubmit={handleSubmit(onBookingSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Tickets
                    </label>
                    <select
                      className="input"
                      {...register('numberOfTickets', {
                        required: 'Number of tickets is required',
                        min: {
                          value: 1,
                          message: 'Minimum 1 ticket'
                        },
                        max: {
                          value: Math.min(10, event.availableSeats),
                          message: `Maximum ${Math.min(10, event.availableSeats)} tickets`
                        }
                      })}
                    >
                      {Array.from({ length: Math.min(10, event.availableSeats) }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>{num} ticket{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                    {errors.numberOfTickets && (
                      <p className="mt-1 text-sm text-red-600">{errors.numberOfTickets.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Information
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Full Name"
                          className="input flex-1"
                          {...register('contactInfo.name', {
                            required: 'Name is required'
                          })}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          placeholder="Email"
                          className="input flex-1"
                          {...register('contactInfo.email', {
                            required: 'Email is required',
                            pattern: {
                              value: /^\S+@\S+$/i,
                              message: 'Please enter a valid email'
                            }
                          })}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          placeholder="Phone (optional)"
                          className="input flex-1"
                          {...register('contactInfo.phone')}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requests (optional)
                    </label>
                    <textarea
                      rows="3"
                      placeholder="Any special requirements or requests..."
                      className="input"
                      {...register('specialRequests')}
                    />
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="text-2xl font-bold text-gray-900">
                        {event.pricing.type === 'free' ? 'Free' : `$${event.pricing.amount * (bookingMutation.variables?.numberOfTickets || 1)}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={bookingMutation.isLoading}
                      className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {bookingMutation.isLoading ? (
                        <LoadingSpinner size="small" text="" />
                      ) : (
                        'Confirm Booking'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowBookingForm(false)}
                      className="btn-outline"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetail
