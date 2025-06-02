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
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 mb-6 font-medium">
            <span className="text-lg">←</span>
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center justify-center mx-auto mb-4 ">
            <img 
              src="/src/assets/ebrgy-logo2.png" 
              alt="eBrgy Logo" 
              className="h-20 object-contain"
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Resident Login
          </h2>
          <p className="mt-2 text-gray-600">
            Access your digital ID and eBrgy services
          </p>
        </div>        {/* Login Form */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-8">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                <Link to="/user/register" className="text-emerald-600 hover:text-emerald-700 font-medium">
                  Register here
                </Link>
              </p>
            </div>
          </form>
        </div>        {/* Quick Access */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6">
          <h3 className="text-emerald-800 font-semibold mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quick Access
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left text-emerald-700 hover:text-emerald-800 text-sm flex items-center p-2 rounded-lg hover:bg-emerald-100 transition-colors">
              <span className="mr-3">📋</span>
              Apply for Barangay Clearance
            </button>
            <button className="w-full text-left text-emerald-700 hover:text-emerald-800 text-sm flex items-center p-2 rounded-lg hover:bg-emerald-100 transition-colors">
              <span className="mr-3">🏥</span>
              Health Records Access
            </button>
            <button className="w-full text-left text-emerald-700 hover:text-emerald-800 text-sm flex items-center p-2 rounded-lg hover:bg-emerald-100 transition-colors">
              <span className="mr-3">💰</span>
              Financial Aid Application
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserLogin
