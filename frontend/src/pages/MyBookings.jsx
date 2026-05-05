import React, { useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Ticket,
  Search,
  Filter,
  X,
  Download
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

const MyBookings = () => {
  const [filters, setFilters] = useState({
    status: '',
    page: 1,
    limit: 10
  })

  const { data: bookingsData, isLoading, error } = useQuery(
    ['myBookings', filters],
    () => axios.get('/api/bookings', { params: filters }),
    {
      keepPreviousData: true,
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  )

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? value : 1
    }))
  }

  const cancelBooking = async (bookingId) => {
    try {
      await axios.put(`/api/bookings/${bookingId}/cancel`)
      toast.success('Booking cancelled successfully')
      // Refetch bookings
      queryClient.invalidateQueries('myBookings')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking')
    }
  }

  if (isLoading && !bookingsData) {
    return <LoadingSpinner text="Loading your bookings..." />
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load bookings. Please try again.</p>
      </div>
    )
  }

  const bookings = bookingsData?.data?.bookings || []
  const pagination = bookingsData?.data?.pagination || {}

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'badge-success'
      case 'pending':
        return 'badge-warning'
      case 'cancelled':
        return 'badge-danger'
      case 'refunded':
        return 'badge-secondary'
      default:
        return 'badge-secondary'
    }
  }

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-600 mt-2">
          Manage your event bookings and view ticket information.
        </p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="input"
              >
                <option value="">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ status: '', page: 1, limit: 10 })}
                className="btn-outline"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {bookings.length > 0 ? (
        <>
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="card">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {booking.event.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className={getStatusColor(booking.status)}>
                              {getStatusText(booking.status)}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span>Booking ID: {booking.bookingReference}</span>
                          </div>
                        </div>
                        <div className="text-right lg:text-left">
                          <p className="text-2xl font-bold text-gray-900">
                            ${booking.totalAmount}
                          </p>
                          <p className="text-sm text-gray-500">
                            {booking.numberOfTickets} ticket{booking.numberOfTickets > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {new Date(booking.event.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          {booking.event.time}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          {booking.event.location.city}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-2 text-gray-400" />
                          {booking.numberOfTickets} ticket{booking.numberOfTickets > 1 ? 's' : ''}
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            <p>Booked on {new Date(booking.createdAt).toLocaleDateString()}</p>
                            <p>Contact: {booking.contactInfo.email}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/events/${booking.event._id}`}
                              className="btn-outline text-sm px-4 py-2"
                            >
                              View Event
                            </Link>
                            {booking.status === 'confirmed' && (
                              <>
                                <button className="btn-outline text-sm px-4 py-2">
                                  <Download className="w-4 h-4 mr-1" />
                                  Ticket
                                </button>
                                <button
                                  onClick={() => cancelBooking(booking._id)}
                                  className="btn-outline text-red-600 hover:bg-red-50 text-sm px-4 py-2"
                                >
                                  <X className="w-4 h-4 mr-1" />
                                  Cancel
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleFilterChange('page', pagination.page - 1)}
                  disabled={!pagination.hasPrev}
                  className="btn-outline px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <span className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.pages}
                </span>
                
                <button
                  onClick={() => handleFilterChange('page', pagination.page + 1)}
                  disabled={!pagination.hasNext}
                  className="btn-outline px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600 mb-4">
            You haven't made any bookings yet. Start exploring events!
          </p>
          <Link to="/events" className="btn-primary">
            Browse Events
          </Link>
        </div>
      )}
    </div>
  )
}

export default MyBookings
