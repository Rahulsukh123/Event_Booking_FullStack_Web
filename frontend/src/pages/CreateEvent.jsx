import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'react-query'
import { createEvent } from '../services/eventService'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  DollarSign,
  ArrowLeft,
  Save,
  X
} from 'lucide-react'

const CreateEvent = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm()

  const pricingType = watch('pricing.type')

  const createEventMutation = useMutation(createEvent, {
    onSuccess: () => {
      toast.success('Event created successfully!')
      navigate('/admin/dashboard')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create event')
    }
  })

  const onSubmit = (data) => {
    const eventData = {
      ...data,
      tags: tags.slice(0, 5) // Limit to 5 tags
    }
    createEventMutation.mutate(eventData)
  }

  const addTag = (e) => {
    e.preventDefault()
    if (tagInput.trim() && tags.length < 5 && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const categories = [
    { value: 'conference', label: 'Conference' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'concert', label: 'Concert' },
    { value: 'sports', label: 'Sports' },
    { value: 'meetup', label: 'Meetup' },
    { value: 'other', label: 'Other' }
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="btn-outline inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
        <p className="text-gray-600 mt-2">
          Fill in the details below to create a new event.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Basic Information</h3>
            <p className="card-description">Event title, description, and category</p>
          </div>
          <div className="card-content space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                className={`input ${errors.title ? 'border-red-500' : ''}`}
                placeholder="Enter event title"
                {...register('title', {
                  required: 'Event title is required',
                  minLength: {
                    value: 3,
                    message: 'Title must be at least 3 characters'
                  },
                  maxLength: {
                    value: 100,
                    message: 'Title cannot exceed 100 characters'
                  }
                })}
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
                placeholder="Describe your event in detail"
                {...register('description', {
                  required: 'Description is required',
                  minLength: {
                    value: 10,
                    message: 'Description must be at least 10 characters'
                  },
                  maxLength: {
                    value: 1000,
                    message: 'Description cannot exceed 1000 characters'
                  }
                })}
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
                {...register('category', {
                  required: 'Category is required'
                })}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (Max 5)
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="badge-primary flex items-center space-x-1"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-primary-600 hover:text-primary-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <form onSubmit={addTag} className="flex space-x-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag"
                  className="input flex-1"
                  maxLength={20}
                />
                <button
                  type="submit"
                  disabled={!tagInput.trim() || tags.length >= 5}
                  className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Date and Time */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Date and Time</h3>
            <p className="card-description">When will your event take place?</p>
          </div>
          <div className="card-content space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  className={`input ${errors.date ? 'border-red-500' : ''}`}
                  {...register('date', {
                    required: 'Date is required',
                    validate: (value) => {
                      const selectedDate = new Date(value)
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      return selectedDate > today || 'Event date must be in the future'
                    }
                  })}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time *
                </label>
                <input
                  type="time"
                  className={`input ${errors.time ? 'border-red-500' : ''}`}
                  {...register('time', {
                    required: 'Time is required'
                  })}
                />
                {errors.time && (
                  <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (hours) *
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="24"
                className={`input ${errors.duration ? 'border-red-500' : ''}`}
                placeholder="e.g., 2.5"
                {...register('duration', {
                  required: 'Duration is required',
                  min: {
                    value: 0.5,
                    message: 'Duration must be at least 0.5 hours'
                  },
                  max: {
                    value: 24,
                    message: 'Duration cannot exceed 24 hours'
                  }
                })}
              />
              {errors.duration && (
                <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Location</h3>
            <p className="card-description">Where will your event take place?</p>
          </div>
          <div className="card-content space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue Name *
                </label>
                <input
                  type="text"
                  className={`input ${errors['location.venue'] ? 'border-red-500' : ''}`}
                  placeholder="e.g., Convention Center"
                  {...register('location.venue', {
                    required: 'Venue name is required'
                  })}
                />
                {errors['location.venue'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['location.venue'].message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  className={`input ${errors['location.city'] ? 'border-red-500' : ''}`}
                  placeholder="e.g., San Francisco"
                  {...register('location.city', {
                    required: 'City is required'
                  })}
                />
                {errors['location.city'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['location.city'].message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <input
                type="text"
                className={`input ${errors['location.address'] ? 'border-red-500' : ''}`}
                placeholder="Full address"
                {...register('location.address', {
                  required: 'Address is required'
                })}
              />
              {errors['location.address'] && (
                <p className="mt-1 text-sm text-red-600">{errors['location.address'].message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacity *
              </label>
              <input
                type="number"
                min="1"
                className={`input ${errors['location.capacity'] ? 'border-red-500' : ''}`}
                placeholder="Maximum number of attendees"
                {...register('location.capacity', {
                  required: 'Capacity is required',
                  min: {
                    value: 1,
                    message: 'Capacity must be at least 1'
                  }
                })}
              />
              {errors['location.capacity'] && (
                <p className="mt-1 text-sm text-red-600">{errors['location.capacity'].message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Pricing</h3>
            <p className="card-description">Set ticket pricing for your event</p>
          </div>
          <div className="card-content space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pricing Type *
              </label>
              <select
                className={`input ${errors['pricing.type'] ? 'border-red-500' : ''}`}
                {...register('pricing.type', {
                  required: 'Pricing type is required'
                })}
              >
                <option value="">Select pricing type</option>
                <option value="free">Free Event</option>
                <option value="paid">Paid Event</option>
              </select>
              {errors['pricing.type'] && (
                <p className="mt-1 text-sm text-red-600">{errors['pricing.type'].message}</p>
              )}
            </div>

            {pricingType === 'paid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ticket Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    className={`input ${errors['pricing.amount'] ? 'border-red-500' : ''}`}
                    placeholder="0.00"
                    {...register('pricing.amount', {
                      required: 'Ticket price is required',
                      min: {
                        value: 0.01,
                        message: 'Price must be greater than 0'
                      }
                    })}
                  />
                  {errors['pricing.amount'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['pricing.amount'].message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    className="input"
                    {...register('pricing.currency')}
                    defaultValue="USD"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
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
            disabled={createEventMutation.isLoading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createEventMutation.isLoading ? (
              <div className="flex items-center">
                <LoadingSpinner size="small" text="" />
                <span className="ml-2">Creating Event...</span>
              </div>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Create Event
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateEvent
