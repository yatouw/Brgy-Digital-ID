import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // TODO: Implement actual admin login logic
    setTimeout(() => {
      setIsLoading(false)
      navigate('/admin/dashboard')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 text-gray-300 hover:text-white mb-6">
            <span className="text-lg">←</span>
            <span>Back to Home</span>
          </Link>
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <h2 className="text-3xl font-bold text-white">
            Administrator Login
          </h2>
          <p className="mt-2 text-gray-300">
            Secure access to the admin panel
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter admin username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter admin password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-admin"
                  name="remember-admin"
                  type="checkbox"
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-admin" className="ml-2 block text-sm text-gray-700">
                  Keep me signed in
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="text-orange-600 hover:text-orange-500">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Authenticating...
                </div>
              ) : (
                'Access Admin Panel'
              )}
            </button>
          </form>
        </div>

        {/* Security Notice */}
        <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-4 border border-gray-700">
          <div className="flex items-start space-x-3">
            <div className="text-orange-400 text-lg">🔒</div>
            <div>
              <h3 className="text-white font-medium text-sm">Security Notice</h3>
              <p className="text-gray-300 text-xs mt-1">
                This is a secure area for authorized personnel only. All access attempts are logged and monitored.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gray-800/30 backdrop-blur-md rounded-lg p-4">
          <h3 className="text-white font-medium mb-3">System Overview</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-orange-400 font-bold text-lg">1,247</div>
              <div className="text-gray-400 text-xs">Registered Residents</div>
            </div>
            <div>
              <div className="text-green-400 font-bold text-lg">98.5%</div>
              <div className="text-gray-400 text-xs">System Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
