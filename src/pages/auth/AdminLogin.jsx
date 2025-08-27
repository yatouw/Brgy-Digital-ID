import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaLock, FaUser, FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa'
import { authService, adminService } from '../../api/appwrite/appwrite'
import { useAuth } from '../../contexts/AuthContext'

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [focusedInput, setFocusedInput] = useState(null)
  const navigate = useNavigate()
  const { login, user, isAuthenticated, isAdmin, checkAndUpgradeToAdmin, logout } = useAuth()

  // Check if already logged in as admin
  useEffect(() => {
    const checkExistingSession = async () => {
      if (isAuthenticated && isAdmin) {
        // Already logged in as admin, redirect to dashboard
        navigate('/admin/dashboard')
        return
      }
    }

    checkExistingSession()
  }, [isAuthenticated, isAdmin, navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      // Clear any existing sessions first to prevent conflicts
      await logout()
      
      // Wait for logout to complete
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Authenticate with Appwrite Auth
      const session = await authService.login(formData.email.trim().toLowerCase(), formData.password)
      
      // Get the current user
      const currentUser = await authService.getCurrentUser()
      
      if (!currentUser) {
        throw new Error('Failed to get user information after login')
      }
      
      // Check if the user is an admin
      const isAdminUser = await adminService.isAdmin(currentUser.$id)
      
      if (!isAdminUser) {
        // User exists but is not an admin - logout and show error
        await authService.logout()
        setError('Access denied. This account does not have administrator privileges.')
        return
      }
      
      // Get admin details
      const adminData = await adminService.getAdminByUserId(currentUser.$id)
      
      // Create user data for admin
      const adminUserData = {
        id: currentUser.$id,
        name: currentUser.name,
        email: currentUser.email,
        isAdmin: true,
        adminData: adminData || {}
      }
      
      // Log in as admin
      await login(adminUserData, 'admin')
      
      // Navigate to admin dashboard
      navigate('/admin/dashboard')
      
    } catch (error) {
      console.error('Admin login error:', error)
      
      // Ensure any partial session is cleaned up
      try {
        await authService.logout()
      } catch (cleanupError) {
        // Cleanup error is expected during failed login
      }
      
      // Handle specific error messages
      if (error.code === 401 || error.type === 'user_invalid_credentials') {
        setError('Invalid email or password. Please check your credentials and try again.')
      } else if (error.type === 'user_not_found') {
        setError('No account found with this email address.')
      } else if (error.code === 429 || error.type === 'rate_limit_exceeded') {
        setError('Too many login attempts. Please try again in a few minutes.')
      } else if (error.message.includes('administrator privileges')) {
        setError(error.message)
      } else if (error.code >= 500) {
        setError('Server error. Please try again later.')
      } else {
        setError('Login failed. Please check your credentials and try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="blob-1 absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full animate-blob"></div>
        <div className="blob-2 absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-teal-200/30 to-emerald-200/30 rounded-full animate-blob animation-delay-2000"></div>
        <div className="blob-3 absolute top-40 left-1/2 transform -translate-x-1/2 w-60 h-60 bg-gradient-to-br from-emerald-100/40 to-teal-100/40 rounded-full animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full space-y-8 animate-fade-in-up">
          {/* Header */}
          <div className="text-center animate-slide-in-left">
            <Link to="/" className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 mb-8 font-medium transition-all hover:scale-105 hover:shadow-lg backdrop-blur-sm bg-white/30 rounded-full px-4 py-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Home</span>
            </Link>
            
            <div className="flex items-center justify-center mx-auto mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center border border-emerald-200 shadow-lg transform transition-all duration-300 hover:scale-105 hover:rotate-3">
                  <FaShieldAlt className="w-10 h-10 text-emerald-600" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
              Administrator Access
            </h1>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Secure portal for system administration and management
            </p>
          </div>

          {/* Login Form */}
          <div className="backdrop-blur-sm bg-white/80 border border-white/20 rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-500 animate-slide-in-right">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 animate-shake">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Admin Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                    className={`w-full pl-10 pr-4 py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 backdrop-blur-sm bg-white/50 ${
                      focusedInput === 'email' 
                        ? 'border-emerald-500 bg-white/80 shadow-lg transform scale-[1.02]' 
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                    placeholder="Enter your admin email"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                    className={`w-full pl-10 pr-12 py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 backdrop-blur-sm bg-white/50 ${
                      focusedInput === 'password' 
                        ? 'border-emerald-500 bg-white/80 shadow-lg transform scale-[1.02]' 
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-admin"
                    name="remember-admin"
                    type="checkbox"
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded transition-all duration-300 hover:scale-110"
                  />
                  <label htmlFor="remember-admin" className="ml-2 block text-sm text-gray-700 font-medium">
                    Keep me signed in
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors hover:underline">
                    Forgot password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                <span className="relative z-10">
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Authenticating...
                    </div>
                  ) : (
                    'Access Admin Panel'
                  )}
                </span>
              </button>
            </form>
          </div>

          {/* Security Notice */}
          <div className="backdrop-blur-sm bg-red-50/80 border border-red-200/50 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaShieldAlt className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-red-800 font-bold text-sm mb-2">Security Notice</h3>
                <p className="text-red-700 text-sm leading-relaxed">
                  This is a secure area for authorized personnel only. All access attempts are logged and monitored. 
                  Unauthorized access is strictly prohibited and may result in legal action.
                </p>
              </div>
            </div>
          </div>

          {/* System Stats */}
          <div className="backdrop-blur-sm bg-white/60 border border-white/20 rounded-2xl p-6 shadow-lg">
            <h3 className="text-gray-900 font-bold mb-4 text-center">Live System Overview</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center group">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <FaUser className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-blue-600 font-bold text-lg">1,247</div>
                <div className="text-gray-600 text-xs">Residents</div>
              </div>
              <div className="text-center group">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div className="text-green-600 font-bold text-lg">99.9%</div>
                <div className="text-gray-600 text-xs">Uptime</div>
              </div>
              <div className="text-center group">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <FaShieldAlt className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-purple-600 font-bold text-lg">Secure</div>
                <div className="text-gray-600 text-xs">Status</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
