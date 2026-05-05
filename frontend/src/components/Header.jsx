import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  Menu, 
  X, 
  Calendar, 
  User, 
  LogOut, 
  Settings, 
  Shield,
  ChevronDown 
} from 'lucide-react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { isAuthenticated, user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsProfileOpen(false)
  }

  const isActivePath = (path) => {
    return location.pathname === path
  }

  const navLinks = [
    { path: '/', label: 'Home', icon: null },
    { path: '/events', label: 'Events', icon: Calendar },
  ]

  return (
    <header className="glass sticky top-0 z-50 animate-fade-in-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group animate-scale-in"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-primary-500/25 transition-all duration-300 transform group-hover:scale-105">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">EventBook</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-2 text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isActivePath(link.path)
                    ? 'text-primary-600 bg-gradient-to-r from-primary-50 to-primary-100 px-4 py-2 rounded-xl shadow-md'
                    : 'text-neutral-600 hover:text-primary-600 hover:bg-neutral-50 px-4 py-2 rounded-xl'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                <span>{link.label}</span>
              </Link>
            ))}

            {/* Admin Link */}
            {isAuthenticated && isAdmin() && (
              <Link
                to="/admin/dashboard"
                className={`flex items-center space-x-2 text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isActivePath('/admin/dashboard')
                    ? 'text-secondary-600 bg-gradient-to-r from-secondary-50 to-secondary-100 px-4 py-2 rounded-xl shadow-md'
                    : 'text-neutral-600 hover:text-secondary-600 hover:bg-neutral-50 px-4 py-2 rounded-xl'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 text-sm font-medium text-neutral-700 hover:text-primary-600 transition-all duration-300 transform hover:scale-105 px-4 py-2 rounded-xl hover:bg-neutral-50"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center ring-2 ring-primary-200">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="hidden xl:block font-semibold">{user?.name}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-neutral-200 py-2 animate-scale-in">
                    <div className="px-4 py-3 border-b border-neutral-100">
                      <p className="text-sm font-semibold text-neutral-900">{user?.name}</p>
                      <p className="text-xs text-neutral-500">{user?.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-neutral-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 transition-all duration-300"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User className="w-4 h-4 text-primary-600" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/my-bookings"
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-neutral-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 transition-all duration-300"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Calendar className="w-4 h-4 text-primary-600" />
                      <span>My Bookings</span>
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-neutral-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 transition-all duration-300"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings className="w-4 h-4 text-primary-600" />
                      <span>Profile</span>
                    </Link>
                    <hr className="my-2 border-neutral-100" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-danger-600 hover:bg-gradient-to-r hover:from-danger-50 hover:to-danger-100 transition-all duration-300"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-neutral-600 hover:text-primary-600 transition-all duration-300 transform hover:scale-105 px-4 py-2 rounded-xl hover:bg-neutral-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm px-6 py-3 animate-bounce-in"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-3 rounded-xl text-neutral-400 hover:text-primary-600 hover:bg-neutral-50 transition-all duration-300 transform hover:scale-105"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-neutral-200 bg-white/80 backdrop-blur-lg animate-slide-down">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navLinks.map((link, index) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 transform hover:scale-105 ${
                    isActivePath(link.path)
                      ? 'text-primary-600 bg-gradient-to-r from-primary-50 to-primary-100 shadow-md'
                      : 'text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {link.icon && <link.icon className="w-5 h-5" />}
                  <span>{link.label}</span>
                </Link>
              ))}

              {/* Admin Link Mobile */}
              {isAuthenticated && isAdmin() && (
                <Link
                  to="/admin/dashboard"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 transform hover:scale-105 ${
                    isActivePath('/admin/dashboard')
                      ? 'text-secondary-600 bg-gradient-to-r from-secondary-50 to-secondary-100 shadow-md'
                      : 'text-neutral-600 hover:text-secondary-600 hover:bg-neutral-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Shield className="w-5 h-5" />
                  <span>Admin</span>
                </Link>
              )}

              {/* Mobile User Menu */}
              {isAuthenticated ? (
                <>
                  <div className="border-t border-neutral-200 pt-4 mt-2">
                    <div className="px-4 py-3 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl mb-2">
                      <p className="text-sm font-semibold text-neutral-900">{user?.name}</p>
                      <p className="text-xs text-neutral-600">{user?.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-semibold text-neutral-600 hover:text-primary-600 hover:bg-neutral-50 transition-all duration-300 transform hover:scale-105"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/my-bookings"
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-semibold text-neutral-600 hover:text-primary-600 hover:bg-neutral-50 transition-all duration-300 transform hover:scale-105"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Calendar className="w-5 h-5" />
                      <span>My Bookings</span>
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-semibold text-neutral-600 hover:text-primary-600 hover:bg-neutral-50 transition-all duration-300 transform hover:scale-105"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="w-5 h-5" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-base font-semibold text-danger-600 hover:bg-gradient-to-r hover:from-danger-50 hover:to-danger-100 transition-all duration-300 transform hover:scale-105"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-3 rounded-xl text-base font-semibold text-neutral-600 hover:text-primary-600 hover:bg-neutral-50 transition-all duration-300 transform hover:scale-105"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block btn-primary text-base px-6 py-3 text-center animate-bounce-in"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
