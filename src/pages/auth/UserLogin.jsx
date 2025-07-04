import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const UserLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [focusedInput, setFocusedInput] = useState(null)
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="blob-1 absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full animate-blob"></div>
        <div className="blob-2 absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-teal-200/30 to-emerald-200/30 rounded-full animate-blob animation-delay-2000"></div>
        <div className="blob-3 absolute top-40 left-1/2 transform -translate-x-1/2 w-60 h-60 bg-gradient-to-br from-emerald-100/40 to-teal-100/40 rounded-full animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full space-y-8 animate-fade-in-up">          {/* Header */}
          <div className="text-center animate-slide-in-left">
            <Link to="/" className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 mb-8 font-medium transition-all hover:scale-105 hover:shadow-lg backdrop-blur-sm bg-white/30 rounded-full px-4 py-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Home</span>
            </Link>
            
            <div className="flex items-center justify-center mx-auto mb-6">
              <div className="relative">
                <img 
                  src="/src/assets/ebrgy-logo2.png" 
                  alt="eBrgy Logo" 
                  className="h-24 object-contain animate-shimmer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
              Welcome Back
            </h1>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Access your digital ID and barangay services with ease
            </p>
          </div>          {/* Login Form */}
          <div className="backdrop-blur-sm bg-white/80 border border-white/20 rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-500 animate-slide-in-right">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
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
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
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
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-emerald-500 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M21.731 21.731L2.269 2.269" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded transition-all hover:scale-110"
                  />
                  <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-700 font-medium">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-all hover:underline decoration-2 underline-offset-2">
                    Forgot password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full group relative flex justify-center py-4 px-4 border border-transparent rounded-xl text-white font-semibold text-lg bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-700 hover:via-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-emerald-300 group-hover:text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </span>
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Signing you in...
                  </div>
                ) : (
                  'Sign In to eBrgy'
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500 font-medium">New to eBrgy?</span>
                </div>
              </div>

              <Link 
                to="/auth/register" 
                className="w-full flex justify-center py-3 px-4 border-2 border-emerald-200 rounded-xl text-emerald-700 font-semibold bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
              >
                Create Your Account
              </Link>
            </form>
          </div>          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-4 animate-fade-in-up animation-delay-1000">
            <div className="backdrop-blur-sm bg-white/60 border border-white/20 rounded-xl p-6 text-center hover:bg-white/80 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Fast & Secure</h3>
              <p className="text-sm text-gray-600">Advanced encryption protects your data</p>
            </div>
            
            <div className="backdrop-blur-sm bg-white/60 border border-white/20 rounded-xl p-6 text-center hover:bg-white/80 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Digital ID</h3>
              <p className="text-sm text-gray-600">Access your digital identification instantly</p>
            </div>
            
            <div className="backdrop-blur-sm bg-white/60 border border-white/20 rounded-xl p-6 text-center hover:bg-white/80 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">24/7 Services</h3>
              <p className="text-sm text-gray-600">Apply for documents anytime, anywhere</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserLogin
