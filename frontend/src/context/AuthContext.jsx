import React, { createContext, useContext, useReducer, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

// Create context
const AuthContext = createContext()

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: true,
  isAuthenticated: false
}

// Action types
const AUTH_START = 'AUTH_START'
const AUTH_SUCCESS = 'AUTH_SUCCESS'
const AUTH_FAILURE = 'AUTH_FAILURE'
const LOGOUT = 'LOGOUT'
const LOAD_USER = 'LOAD_USER'

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_START:
      return {
        ...state,
        isLoading: true
      }
    case AUTH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token
      }
    case AUTH_FAILURE:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null
      }
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null
      }
    case LOAD_USER:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload
      }
    default:
      return state
  }
}

// Set up axios defaults
const setupAxios = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete axios.defaults.headers.common['Authorization']
  }
}

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Register user
  const register = async (formData) => {
    try {
      dispatch({ type: AUTH_START })
      
      const response = await axios.post('/api/auth/register', formData)
      const { user, token } = response.data.data
      
      // Store token in localStorage
      localStorage.setItem('token', token)
      
      // Set up axios headers
      setupAxios(token)
      
      dispatch({
        type: AUTH_SUCCESS,
        payload: { user, token }
      })
      
      toast.success('Registration successful!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      dispatch({ type: AUTH_FAILURE })
      return { success: false, error: message }
    }
  }

  // Login user
  const login = async (formData) => {
    try {
      dispatch({ type: AUTH_START })
      
      const response = await axios.post('/api/auth/login', formData)
      const { user, token } = response.data.data
      
      // Store token in localStorage
      localStorage.setItem('token', token)
      
      // Set up axios headers
      setupAxios(token)
      
      dispatch({
        type: AUTH_SUCCESS,
        payload: { user, token }
      })
      
      toast.success('Login successful!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      dispatch({ type: AUTH_FAILURE })
      return { success: false, error: message }
    }
  }

  // Logout user
  const logout = async () => {
    try {
      await axios.post('/api/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Remove token from localStorage
      localStorage.removeItem('token')
      
      // Remove axios headers
      setupAxios(null)
      
      dispatch({ type: LOGOUT })
      toast.success('Logged out successfully')
    }
  }

  // Load user from token
  const loadUser = async () => {
    const token = localStorage.getItem('token')
    
    if (!token) {
      dispatch({ type: AUTH_FAILURE })
      return
    }

    try {
      setupAxios(token)
      const response = await axios.get('/api/auth/user')
      const user = response.data.data.user
      
      dispatch({
        type: LOAD_USER,
        payload: user
      })
    } catch (error) {
      console.error('Load user error:', error)
      localStorage.removeItem('token')
      setupAxios(null)
      dispatch({ type: AUTH_FAILURE })
    }
  }

  // Update user profile
  const updateProfile = async (formData) => {
    try {
      const response = await axios.put('/api/auth/update-profile', formData)
      const user = response.data.data.user
      
      dispatch({
        type: LOAD_USER,
        payload: user
      })
      
      toast.success('Profile updated successfully!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  // Change password
  const changePassword = async (formData) => {
    try {
      await axios.post('/api/auth/change-password', formData)
      toast.success('Password changed successfully!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  // Check if user is admin
  const isAdmin = () => {
    return state.user?.role === 'admin'
  }

  // Load user on mount
  useEffect(() => {
    loadUser()
  }, [])

  const value = {
    ...state,
    register,
    login,
    logout,
    loadUser,
    updateProfile,
    changePassword,
    isAdmin
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
