import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const UserLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
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
    
    // TODO: Implement actual login logic
    setTimeout(() => {
      setIsLoading(false)
      navigate('/user/dashboard')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 text-white hover:text-blue-200 mb-6">
            <span className="text-lg">←</span>
            <span>Back to Home</span>
          </Link>
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-blue-600 font-bold text-2xl">B</span>
          </div>
          <h2 className="text-3xl font-bold text-white">
            Resident Login
          </h2>
          <p className="mt-2 text-blue-100">
            Access your digital ID and barangay services
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
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
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/user/register" className="text-blue-600 hover:text-blue-500 font-medium">
                  Register here
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Quick Access */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
          <h3 className="text-white font-medium mb-2">Quick Access</h3>
          <div className="space-y-2">
            <button className="w-full text-left text-blue-100 hover:text-white text-sm">
              📋 Apply for Barangay Clearance
            </button>
            <button className="w-full text-left text-blue-100 hover:text-white text-sm">
              🏥 Health Records Access
            </button>
            <button className="w-full text-left text-blue-100 hover:text-white text-sm">
              💰 Financial Aid Application
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserLogin
