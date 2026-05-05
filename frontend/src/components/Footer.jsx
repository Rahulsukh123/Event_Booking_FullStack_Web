import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 left-20 w-40 h-40 bg-secondary-500/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-accent-500/5 rounded-full blur-3xl animate-pulse"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2 animate-fade-in-up">
            <div className="flex items-center space-x-3 mb-6 group">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">EventBook</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed animate-fade-in-up-delayed">
              Your premier platform for discovering and booking amazing events. 
              From conferences to concerts, we've got you covered.
            </p>
            <div className="space-y-3 animate-fade-in-up-delayed-2">
              <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-300 group">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-primary-500/20 transition-colors duration-300">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="font-medium">support@eventbook.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-300 group">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-primary-500/20 transition-colors duration-300">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="font-medium">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-300 group">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-primary-500/20 transition-colors duration-300">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="font-medium">123 Event Street, City, ST 12345</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="animate-fade-in-up-delayed">
            <h3 className="text-xl font-bold mb-6 gradient-text">Quick Links</h3>
            <ul className="space-y-3">
              <li className="transform transition-transform duration-300 hover:translate-x-2">
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <span className="w-2 h-2 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span>Home</span>
                </Link>
              </li>
              <li className="transform transition-transform duration-300 hover:translate-x-2">
                <Link 
                  to="/events" 
                  className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <span className="w-2 h-2 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span>Browse Events</span>
                </Link>
              </li>
              <li className="transform transition-transform duration-300 hover:translate-x-2">
                <Link 
                  to="/about" 
                  className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <span className="w-2 h-2 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span>About Us</span>
                </Link>
              </li>
              <li className="transform transition-transform duration-300 hover:translate-x-2">
                <Link 
                  to="/contact" 
                  className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <span className="w-2 h-2 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span>Contact</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="animate-fade-in-up-delayed-2">
            <h3 className="text-xl font-bold mb-6 gradient-text">Support</h3>
            <ul className="space-y-3">
              <li className="transform transition-transform duration-300 hover:translate-x-2">
                <Link 
                  to="/help" 
                  className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <span className="w-2 h-2 bg-secondary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span>Help Center</span>
                </Link>
              </li>
              <li className="transform transition-transform duration-300 hover:translate-x-2">
                <Link 
                  to="/faq" 
                  className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <span className="w-2 h-2 bg-secondary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span>FAQ</span>
                </Link>
              </li>
              <li className="transform transition-transform duration-300 hover:translate-x-2">
                <Link 
                  to="/terms" 
                  className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <span className="w-2 h-2 bg-secondary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span>Terms of Service</span>
                </Link>
              </li>
              <li className="transform transition-transform duration-300 hover:translate-x-2">
                <Link 
                  to="/privacy" 
                  className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <span className="w-2 h-2 bg-secondary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span>Privacy Policy</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700/50 mt-12 pt-8 animate-fade-in-up-delayed-3">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm mb-2">
                © {currentYear} EventBook. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs">
                Made with ❤️ for event enthusiasts worldwide
              </p>
            </div>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-primary-500/25"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 hover:bg-blue-500 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-blue-600/25"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-purple-500/25"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
