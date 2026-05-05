import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  Calendar, 
  Users, 
  Ticket, 
  TrendingUp, 
  Clock,
  MapPin,
  ArrowRight,
  Plus
} from 'lucide-react'

const Dashboard = () => {
  const { user, isAdmin } = useAuth()

  const stats = [
    {
      label: 'Total Bookings',
      value: '12',
      change: '+2 from last month',
      icon: Ticket,
      color: 'bg-blue-500'
    },
    {
      label: 'Upcoming Events',
      value: '3',
      change: 'Next event in 2 days',
      icon: Calendar,
      color: 'bg-green-500'
    },
    {
      label: 'Total Spent',
      value: '$245',
      change: '+$50 from last month',
      icon: TrendingUp,
      color: 'bg-purple-500'
    }
  ]

  const recentBookings = [
    {
      id: 1,
      eventTitle: 'Tech Conference 2024',
      date: '2024-03-15',
      time: '10:00 AM',
      location: 'San Francisco',
      status: 'confirmed',
      tickets: 2
    },
    {
      id: 2,
      eventTitle: 'Music Festival',
      date: '2024-03-20',
      time: '6:00 PM',
      location: 'Los Angeles',
      status: 'confirmed',
      tickets: 1
    },
    {
      id: 3,
      eventTitle: 'Business Workshop',
      date: '2024-03-25',
      time: '2:00 PM',
      location: 'New York',
      status: 'confirmed',
      tickets: 3
    }
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: 'AI & Machine Learning Summit',
      date: '2024-03-15',
      location: 'San Francisco',
      category: 'conference',
      image: null
    },
    {
      id: 2,
      title: 'Jazz Night',
      date: '2024-03-18',
      location: 'Chicago',
      category: 'concert',
      image: null
    },
    {
      id: 3,
      title: 'Startup Networking',
      date: '2024-03-22',
      location: 'Austin',
      category: 'meetup',
      image: null
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your events and bookings.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Bookings</h3>
            <p className="card-description">Your latest event bookings</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{booking.eventTitle}</h4>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {booking.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {booking.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {booking.location}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="badge-success text-xs">Confirmed</span>
                    <p className="text-sm text-gray-500 mt-1">{booking.tickets} tickets</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link 
                to="/my-bookings" 
                className="btn-outline btn-primary w-full"
              >
                View All Bookings
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Upcoming Events</h3>
            <p className="card-description">Events you might be interested in</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                      <MapPin className="w-4 h-4 ml-2" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <Link 
                    to={`/events/${event.id}`}
                    className="btn-primary text-sm px-3 py-1"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link 
                to="/events" 
                className="btn-outline btn-primary w-full"
              >
                Browse All Events
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Quick Actions */}
      {isAdmin() && (
        <div className="mt-8">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Admin Quick Actions</h3>
              <p className="card-description">Manage events and bookings</p>
            </div>
            <div className="card-content">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link 
                  to="/admin/create-event" 
                  className="btn-primary inline-flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Link>
                <Link 
                  to="/admin/dashboard" 
                  className="btn-outline btn-primary inline-flex items-center justify-center"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Manage Bookings
                </Link>
                <Link 
                  to="/events" 
                  className="btn-outline btn-primary inline-flex items-center justify-center"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  View All Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
