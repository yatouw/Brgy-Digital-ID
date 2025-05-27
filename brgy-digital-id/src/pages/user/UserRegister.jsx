import React, { useState } from 'react'
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
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
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
      navigate('/user/login')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 text-white hover:text-green-200 mb-6">
            <span className="text-lg">←</span>
            <span>Back to Home</span>
          </Link>
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 font-bold text-2xl">B</span>
          </div>
          <h2 className="text-3xl font-bold text-white">
            Resident Registration
          </h2>
          <p className="mt-2 text-green-100">
            Create your account to get your digital ID
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/20 rounded-full h-2 mb-6">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 2) * 100}%` }}
          ></div>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                  <p className="text-sm text-gray-600">Step 1 of 2</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Juan"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Dela Cruz"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Middle Name
                  </label>
                  <input
                    name="middleName"
                    type="text"
                    value={formData.middleName}
                    onChange={handleChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Santos"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Birth Date *
                  </label>
                  <input
                    name="birthDate"
                    type="date"
                    required
                    value={formData.birthDate}
                    onChange={handleChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Complete Address *
                  </label>
                  <textarea
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="House No., Street, Barangay Aningway, City, Province"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                >
                  Next Step
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Account Details</h3>
                  <p className="text-sm text-gray-600">Step 2 of 2</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="juan.delacruz@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="09123456789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter a strong password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Confirm your password"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the Terms and Conditions and Privacy Policy
                  </label>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex-1 py-3 px-4 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-lg transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              </>
            )}

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/user/login" className="text-green-600 hover:text-green-500 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UserRegister
