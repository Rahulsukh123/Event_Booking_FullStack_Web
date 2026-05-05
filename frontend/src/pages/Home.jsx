import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Calendar, MapPin, Users, Clock, ArrowRight, Star } from 'lucide-react'
import { getFeaturedEvents } from '../services/eventService'
import LoadingSpinner from '../components/LoadingSpinner'

const Home = () => {
  const { data: featuredEvents, isLoading, error } = useQuery(
    'featuredEvents',
    () => getFeaturedEvents(6),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )

  const features = [
    {
      icon: Calendar,
      title: 'Wide Selection',
      description: 'Discover events from conferences to concerts in your area.'
    },
    {
      icon: MapPin,
      title: 'Local & Global',
      description: 'Find events happening in your city or around the world.'
    },
    {
      icon: Users,
      title: 'Easy Booking',
      description: 'Book tickets in seconds with our streamlined process.'
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Get instant notifications about your bookings and events.'
    }
  ]

  if (isLoading) {
    return <LoadingSpinner text="Loading featured events..." />
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load events. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background with gradient and animated elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-secondary-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-accent-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="block text-white">Discover</span>
              <span className="block bg-gradient-to-r from-accent-400 to-warning-400 bg-clip-text text-transparent">Amazing Events</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-primary-100 max-w-4xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              From conferences to concerts, find and book tickets to the best events in your area.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <Link 
                to="/events" 
                className="group btn bg-white text-primary-600 hover:bg-accent-50 hover:text-accent-600 px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-accent-500/25 transform hover:scale-105 transition-all duration-300"
              >
                Browse Events
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link 
                to="/register" 
                className="group btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-white/25 transform hover:scale-105 transition-all duration-300 backdrop-blur-sm bg-white/10"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Featured Events</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Check out these upcoming events that are trending in your area.
          </p>
        </div>

        {featuredEvents?.data?.events?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.data.events.map((event, index) => (
              <div key={event._id} className="card hover-lift animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="relative overflow-hidden rounded-t-2xl">
                  <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-neutral-200 to-neutral-300">
                    {event.image ? (
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-full h-64 object-cover transform hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gradient-to-br from-primary-400 via-primary-500 to-secondary-600 flex items-center justify-center">
                        <Calendar className="w-16 h-16 text-white animate-float" />
                      </div>
                    )}
                  </div>
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="badge-primary text-sm font-semibold">
                      {event.category}
                    </span>
                    <div className="flex items-center text-sm text-neutral-500">
                      <Users className="w-4 h-4 mr-1" />
                      <span className="font-medium">{event.availableSeats} seats left</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3 line-clamp-2 leading-tight">
                    {event.title}
                  </h3>
                  <div className="space-y-3 text-sm text-neutral-600 mb-6">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-primary-500" />
                      <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-primary-500" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-primary-500" />
                      <span>{event.location.city}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      {event.pricing.type === 'free' ? (
                        <span className="text-2xl font-bold bg-gradient-to-r from-success-600 to-success-700 bg-clip-text text-transparent">Free</span>
                      ) : (
                        <span className="text-2xl font-bold text-neutral-900">
                          ${event.pricing.amount}
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/events/${event._id}`}
                      className="btn-primary text-sm px-6 py-3 shadow-lg hover:shadow-xl"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No featured events available at the moment.</p>
            <Link to="/events" className="btn-primary">
              Browse All Events
            </Link>
          </div>
        )}

        {featuredEvents?.data?.events?.length > 0 && (
          <div className="text-center mt-12">
            <Link 
              to="/events" 
              className="btn-outline btn-primary px-6 py-3"
            >
              View All Events
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 to-white"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary-50/50 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Why Choose EventBook?</span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              We make event discovery and booking simple, secure, and enjoyable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group animate-fade-in-up hover-lift" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-primary-500/25">
                  <feature.icon className="w-10 h-10 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        {/* Animated elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-accent-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-warning-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '3s' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-12 text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Join thousands of users who are discovering and booking amazing events every day.
            </p>
            <Link 
              to="/register" 
              className="group inline-flex items-center bg-white text-primary-600 hover:bg-accent-50 hover:text-accent-600 px-10 py-4 text-lg font-bold shadow-2xl hover:shadow-accent-500/25 transform hover:scale-105 transition-all duration-300"
            >
              Sign Up Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
