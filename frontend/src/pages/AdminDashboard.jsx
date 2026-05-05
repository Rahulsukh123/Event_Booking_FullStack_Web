import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import axios from 'axios'
import LoadingSpinner from '../components/LoadingSpinner'
import { 
  Users, 
  Calendar, 
  Ticket, 
  TrendingUp, 
  DollarSign,
  ArrowRight,
  Plus,
  Eye,
  Edit,
  Trash2,
  Clock,
  X
} from 'lucide-react'

const AdminDashboard = () => {
  const { data: statsData, isLoading: statsLoading } = useQuery(
    'adminStats',
    () => axios.get('/api/bookings/admin/stats'),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery(
    'recentBookings',
    () => axios.get('/api/bookings/admin/all', { 
      params: { page: 1, limit: 5 } 
    }),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  )

  if (statsLoading || bookingsLoading) {
    return <LoadingSpinner text="Loading dashboard..." />
  }

  const stats = statsData?.data?.data || {}
  const recentBookings = bookingsData?.data?.data?.bookings || []

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.stats?.confirmed?.count || 0,
      change: '+12% from last month',
      icon: Ticket,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Revenue',
      value: `$${(stats.stats?.confirmed?.totalRevenue || 0).toFixed(2)}`,
      change: '+8% from last month',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Active Events',
      value: '24',
      change: '+3 new this week',
      icon: Calendar,
      color: 'bg-purple-500'
    },
    {
      title: 'Total Users',
      value: '1,234',
      change: '+23% from last month',
      icon: Users,
      color: 'bg-orange-500'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Manage events, bookings, and monitor your platform performance.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Link 
          to="/admin/create-event" 
          className="btn-primary inline-flex items-center justify-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Link>
        <Link 
          to="/events" 
          className="btn-outline btn-primary inline-flex items-center justify-center"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Manage Events
        </Link>
        <Link 
          to="/admin/bookings" 
          className="btn-outline btn-primary inline-flex items-center justify-center"
        >
          <Ticket className="w-4 h-4 mr-2" />
          View Bookings
        </Link>
        <Link 
          to="/admin/users" 
          className="btn-outline btn-primary inline-flex items-center justify-center"
        >
          <Users className="w-4 h-4 mr-2" />
          Manage Users
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
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
            <p className="card-description">Latest booking activity</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{booking.event.title}</h4>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span>{booking.user.name}</span>
                      <span>•</span>
                      <span>{booking.numberOfTickets} tickets</span>
                      <span>•</span>
                      <span>${booking.totalAmount}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="badge-success text-xs">Confirmed</span>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link 
                to="/admin/bookings" 
                className="btn-outline btn-primary w-full"
              >
                View All Bookings
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>

        {/* Monthly Revenue Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Monthly Revenue</h3>
            <p className="card-description">Revenue trends over the last 6 months</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {stats.monthlyRevenue?.slice(0, 6).map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(month._id.year, month._id.month - 1).toLocaleDateString('en-US', { 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      ${month.revenue.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {month.bookings} bookings
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Bookings</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {stats.stats?.pending?.count || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cancelled Bookings</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {stats.stats?.cancelled?.count || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <X className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Refunded Amount</p>
                <p className="text-2xl font-bold text-gray-600 mt-1">
                  ${(stats.stats?.refunded?.totalRevenue || 0).toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
