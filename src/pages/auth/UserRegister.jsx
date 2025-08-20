import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const UserRegister = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    phone: '',
    address: '',
    birthDate: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [focusedInput, setFocusedInput] = useState(null)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

    // Calculate password strength
    if (e.target.name === 'password') {
      const password = e.target.value
      let strength = 0
      if (password.length >= 8) strength++
      if (/[A-Z]/.test(password)) strength++
      if (/[a-z]/.test(password)) strength++
      if (/[0-9]/.test(password)) strength++
      if (/[^A-Za-z0-9]/.test(password)) strength++
      setPasswordStrength(strength)
    }
  }

  const handleNextStep = () => {
    setStep(step + 1)
  }

  const handlePrevStep = () => {
    setStep(step - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // TODO: Implement actual registration logic
    setTimeout(() => {
      setIsLoading(false)
      navigate('/auth/login')
    }, 1500)
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500'
    if (passwordStrength <= 2) return 'bg-yellow-500'
    if (passwordStrength <= 3) return 'bg-blue-500'
    if (passwordStrength <= 4) return 'bg-green-500'
    return 'bg-emerald-500'
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak'
    if (passwordStrength <= 2) return 'Fair'
    if (passwordStrength <= 3) return 'Good'
    if (passwordStrength <= 4) return 'Strong'
    return 'Very Strong'
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
        <div className="max-w-2xl w-full space-y-8 animate-fade-in-up">          {/* Header */}
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
                  className="h-24 object-contain"
                />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
              Join eBrgy Today
            </h1>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Create your account and get your digital ID instantly
            </p>
          </div>          {/* Progress Bar */}
          <div className="relative animate-slide-in-right">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-emerald-600">
                Step {step} of 2
              </span>
              <span className="text-sm text-gray-500">
                {step === 1 ? 'Personal Information' : 'Account Setup'}
              </span>
            </div>
            <div className="bg-gray-200 rounded-full h-3 mb-6 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-700 shadow-md"
                style={{ width: `${(step / 2) * 100}%` }}
              >
                <div className="h-full bg-gradient-to-r from-white/20 to-transparent animate-shimmer"></div>
              </div>
            </div>
          </div>          {/* Registration Form */}
          <div className="backdrop-blur-sm bg-white/80 border border-white/20 rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-500">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="animate-fade-in-up">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h3>
                    <p className="text-gray-600">Tell us about yourself to create your digital ID</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name *
                      </label>
                      <div className="relative">
                        <input
                          name="firstName"
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                          onFocus={() => setFocusedInput('firstName')}
                          onBlur={() => setFocusedInput(null)}
                          className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 backdrop-blur-sm bg-white/50 ${
                            focusedInput === 'firstName' 
                              ? 'border-emerald-500 bg-white/80 shadow-lg transform scale-[1.02]' 
                              : 'border-gray-200 hover:border-emerald-300'
                          }`}
                          placeholder="Juan"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <div className="relative">
                        <input
                          name="lastName"
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={handleChange}
                          onFocus={() => setFocusedInput('lastName')}
                          onBlur={() => setFocusedInput(null)}
                          className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 backdrop-blur-sm bg-white/50 ${
                            focusedInput === 'lastName' 
                              ? 'border-emerald-500 bg-white/80 shadow-lg transform scale-[1.02]' 
                              : 'border-gray-200 hover:border-emerald-300'
                          }`}
                          placeholder="Dela Cruz"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Middle Name
                    </label>
                    <div className="relative">
                      <input
                        name="middleName"
                        type="text"
                        value={formData.middleName}
                        onChange={handleChange}
                        onFocus={() => setFocusedInput('middleName')}
                        onBlur={() => setFocusedInput(null)}
                        className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 backdrop-blur-sm bg-white/50 ${
                          focusedInput === 'middleName' 
                            ? 'border-emerald-500 bg-white/80 shadow-lg transform scale-[1.02]' 
                            : 'border-gray-200 hover:border-emerald-300'
                        }`}
                        placeholder="Santos (Optional)"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Birth Date *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        name="birthDate"
                        type="date"
                        required
                        value={formData.birthDate}
                        onChange={handleChange}
                        onFocus={() => setFocusedInput('birthDate')}
                        onBlur={() => setFocusedInput(null)}
                        className={`w-full pl-10 pr-4 py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 backdrop-blur-sm bg-white/50 ${
                          focusedInput === 'birthDate' 
                            ? 'border-emerald-500 bg-white/80 shadow-lg transform scale-[1.02]' 
                            : 'border-gray-200 hover:border-emerald-300'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Complete Address *
                    </label>
                    <div className="relative">
                      <div className="absolute top-4 left-3 pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <textarea
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleChange}
                        onFocus={() => setFocusedInput('address')}
                        onBlur={() => setFocusedInput(null)}
                        rows={3}
                        className={`w-full pl-10 pr-4 py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 backdrop-blur-sm bg-white/50 resize-none ${
                          focusedInput === 'address' 
                            ? 'border-emerald-500 bg-white/80 shadow-lg transform scale-[1.02]' 
                            : 'border-gray-200 hover:border-emerald-300'
                        }`}
                        placeholder="House No., Street, Barangay, City, Province"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full group relative flex justify-center py-4 px-4 border border-transparent rounded-xl text-white font-semibold text-lg bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-700 hover:via-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
                  >
                    <span className="absolute right-0 inset-y-0 flex items-center pr-3">
                      <svg className="h-5 w-5 text-emerald-300 group-hover:text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                    Continue to Account Setup
                  </button>
                </div>
              )}              {step === 2 && (
                <div className="animate-fade-in-up">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.25-1.955a3 3 0 00-4.5-2.591L6 6.09a3 3 0 00-4.5 2.59l2.25 7.5a3 3 0 002.59 4.5l7.5-2.25a3 3 0 004.5-2.59l-2.25-7.5z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Account Security</h3>
                    <p className="text-gray-600">Set up your login credentials to secure your account</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                          </svg>
                        </div>
                        <input
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
                          placeholder="juan.delacruz@email.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <input
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          onFocus={() => setFocusedInput('phone')}
                          onBlur={() => setFocusedInput(null)}
                          className={`w-full pl-10 pr-4 py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 backdrop-blur-sm bg-white/50 ${
                            focusedInput === 'phone' 
                              ? 'border-emerald-500 bg-white/80 shadow-lg transform scale-[1.02]' 
                              : 'border-gray-200 hover:border-emerald-300'
                          }`}
                          placeholder="09123456789"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Password *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <input
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
                          placeholder="Enter a strong password"
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
                      {formData.password && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600">Password Strength</span>
                            <span className={`text-xs font-medium ${passwordStrength <= 2 ? 'text-red-500' : passwordStrength <= 3 ? 'text-yellow-500' : 'text-green-500'}`}>
                              {getPasswordStrengthText()}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                              style={{ width: `${(passwordStrength / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <input
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          onFocus={() => setFocusedInput('confirmPassword')}
                          onBlur={() => setFocusedInput(null)}
                          className={`w-full pl-10 pr-12 py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 backdrop-blur-sm bg-white/50 ${
                            focusedInput === 'confirmPassword' 
                              ? 'border-emerald-500 bg-white/80 shadow-lg transform scale-[1.02]' 
                              : 'border-gray-200 hover:border-emerald-300'
                          } ${
                            formData.confirmPassword && formData.password !== formData.confirmPassword 
                              ? 'border-red-300' 
                              : ''
                          }`}
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-emerald-500 transition-colors"
                        >
                          {showConfirmPassword ? (
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
                      {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="text-sm text-red-500 mt-1">Passwords do not match</p>
                      )}
                    </div>

                    <div className="flex items-start space-x-3">
                      <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        required
                        className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded transition-all hover:scale-110 mt-0.5"
                      />
                      <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
                        I agree to the{' '}
                        <a href="#" className="text-emerald-600 hover:text-emerald-700 font-semibold underline decoration-2 underline-offset-2">
                          Terms and Conditions
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-emerald-600 hover:text-emerald-700 font-semibold underline decoration-2 underline-offset-2">
                          Privacy Policy
                        </a>
                      </label>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="flex-1 group relative flex justify-center py-4 px-4 border-2 border-gray-200 rounded-xl text-gray-700 font-semibold bg-white hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                          <svg className="h-5 w-5 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </span>
                        Previous
                      </button>
                      
                      <button
                        type="submit"
                        disabled={isLoading || formData.password !== formData.confirmPassword}
                        className="flex-1 group relative flex justify-center py-4 px-4 border border-transparent rounded-xl text-white font-semibold text-lg bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-700 hover:via-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
                      >
                        <span className="absolute right-0 inset-y-0 flex items-center pr-3">
                          {isLoading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          ) : (
                            <svg className="h-5 w-5 text-emerald-300 group-hover:text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </span>
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">Already have an account?</span>
                </div>
              </div>

              <Link 
                to="/auth/login" 
                className="w-full flex justify-center py-3 px-4 border-2 border-emerald-200 rounded-xl text-emerald-700 font-semibold bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
              >
                Sign In Instead
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserRegister
