import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Filter,
  Search,
  ChevronDown,
  ArrowRight
} from 'lucide-react'
import { getEvents, getEventCategories, getEventCities } from '../services/eventService'
import LoadingSpinner from '../components/LoadingSpinner'

const Events = () => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    city: '',
    dateFrom: '',
    dateTo: '',
    page: 1,
    limit: 12
  })

  const [showFilters, setShowFilters] = useState(false)

  const { data: eventsData, isLoading, error } = useQuery(
    ['events', filters],
    () => getEvents(filters),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )

  const { data: categoriesData } = useQuery(
    'eventCategories',
    getEventCategories,
    {
      staleTime: 30 * 60 * 1000, // 30 minutes
    }
  )

  const { data: citiesData } = useQuery(
    'eventCities',
    getEventCities,
    {
      staleTime: 30 * 60 * 1000, // 30 minutes
    }
  )

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? value : 1 // Reset page when changing other filters
    }))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    handleFilterChange('search', e.target.search.value)
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      city: '',
      dateFrom: '',
      dateTo: '',
      page: 1,
      limit: 12
    })
  }

  if (isLoading && !eventsData) {
    return <LoadingSpinner text="Loading events..." />
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load events. Please try again.</p>
      </div>
    )
  }

  const events = eventsData?.data?.events || []
  const pagination = eventsData?.data?.pagination || {}
  const categories = categoriesData?.data?.categories || []
  const cities = citiesData?.data?.cities || []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Discover Events</h1>
        <p className="text-gray-600 mt-2">
          Find and book tickets to amazing events in your area.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="search"
              placeholder="Search events by title or description..."
              className="input pl-10"
              defaultValue={filters.search}
            />
          </div>
          <button
            type="submit"
            className="btn-primary px-6"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline flex items-center"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            <ChevronDown className={`w-4 h-4 ml-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </form>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="input"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)} ({cat.count})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <select
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="input"
                >
                  <option value="">All Cities</option>
                  {cities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name} ({city.count})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="input"
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={clearFilters}
                className="btn-outline"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          {pagination.total} events found
        </p>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={filters.sortBy || 'date'}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="input text-sm"
          >
            <option value="date">Date</option>
            <option value="title">Title</option>
            <option value="createdAt">Recently Added</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      {events.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {events.map((event) => (
              <div key={event._id} className="card hover:shadow-lg transition-shadow">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-t-lg overflow-hidden">
                  {event.image ? (
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                      <Calendar className="w-12 h-12 text-white" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="badge-primary text-xs">
                      {event.category}
                    </span>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-1" />
                      {event.availableSeats} seats left
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {event.title}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      {event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      {event.location.city}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      {event.pricing.type === 'free' ? (
                        <span className="text-lg font-bold text-green-600">Free</span>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">
                          ${event.pricing.amount}
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/events/${event._id}`}
                      className="btn-primary text-sm px-4 py-2"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center">
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
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your filters or search terms to find what you're looking for.
          </p>
          <button onClick={clearFilters} className="btn-primary">
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}

export default Events
