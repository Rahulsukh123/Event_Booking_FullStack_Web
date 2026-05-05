import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from 'react-query'
import { useForm } from 'react-hook-form'
import { getEventById, updateEvent } from '../services/eventService'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const EditEvent = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: eventData, isLoading } = useQuery(
    ['event', id],
    () => getEventById(id),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    }
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  const updateEventMutation = useMutation(
    ({ id, data }) => updateEvent(id, data),
    {
      onSuccess: () => {
        toast.success('Event updated successfully!')
        navigate('/admin/dashboard')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update event')
      }
    }
  )

  React.useEffect(() => {
    if (eventData?.data?.event) {
      const event = eventData.data.event
      reset({
        title: event.title,
        description: event.description,
        category: event.category,
        date: new Date(event.date).toISOString().split('T')[0],
        time: event.time,
        duration: event.duration,
        'location.venue': event.location.venue,
        'location.address': event.location.address,
        'location.city': event.location.city,
        'location.capacity': event.location.capacity,
        'pricing.type': event.pricing.type,
        'pricing.amount': event.pricing.amount,
        'pricing.currency': event.pricing.currency
      })
    }
  }, [eventData, reset])

  const onSubmit = (data) => {
    updateEventMutation.mutate({ id, data })
  }

  if (isLoading) {
    return <LoadingSpinner text="Loading event details..." />
  }

  const event = eventData?.data?.event

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Event not found.</p>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="btn-primary mt-4"
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  // Don't allow editing if event has bookings
  if (event.bookedSeats > 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">
            Cannot Edit Event
          </h3>
          <p className="text-yellow-700 mb-4">
            This event already has bookings, so some fields cannot be modified to maintain consistency for existing attendees.
          </p>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
        <p className="text-gray-600 mt-2">
          Update the details for "{event.title}"
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Similar form structure as CreateEvent */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Basic Information</h3>
          </div>
          <div className="card-content space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                className={`input ${errors.title ? 'border-red-500' : ''}`}
                {...register('title', { required: 'Event title is required' })}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                rows={4}
                className={`input ${errors.description ? 'border-red-500' : ''}`}
                {...register('description', { required: 'Description is required' })}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                className={`input ${errors.category ? 'border-red-500' : ''}`}
                {...register('category', { required: 'Category is required' })}
              >
                <option value="conference">Conference</option>
                <option value="workshop">Workshop</option>
                <option value="concert">Concert</option>
                <option value="sports">Sports</option>
                <option value="meetup">Meetup</option>
                <option value="other">Other</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Other sections would follow the same pattern */}
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard')}
            className="btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateEventMutation.isLoading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateEventMutation.isLoading ? (
              <LoadingSpinner size="small" text="" />
            ) : (
              'Update Event'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditEvent
