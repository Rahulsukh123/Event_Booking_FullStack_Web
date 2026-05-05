import axios from 'axios'

// Get all events with pagination and filtering
export const getEvents = async (params = {}) => {
  const response = await axios.get('/api/events', { params })
  return response.data
}

// Get featured events
export const getFeaturedEvents = async (limit = 6) => {
  const response = await axios.get('/api/events/featured/list', {
    params: { limit }
  })
  return response.data
}

// Get single event by ID
export const getEventById = async (id) => {
  const response = await axios.get(`/api/events/${id}`)
  return response.data
}

// Create new event (admin only)
export const createEvent = async (eventData) => {
  const response = await axios.post('/api/events', eventData)
  return response.data
}

// Update event (admin only)
export const updateEvent = async (id, eventData) => {
  const response = await axios.put(`/api/events/${id}`, eventData)
  return response.data
}

// Delete event (admin only)
export const deleteEvent = async (id) => {
  const response = await axios.delete(`/api/events/${id}`)
  return response.data
}

// Get event categories
export const getEventCategories = async () => {
  const response = await axios.get('/api/events/meta/categories')
  return response.data
}

// Get cities with events
export const getEventCities = async () => {
  const response = await axios.get('/api/events/meta/cities')
  return response.data
}
