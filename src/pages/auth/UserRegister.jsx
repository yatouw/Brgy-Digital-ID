import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService, residentService } from '../../api/appwrite/appwrite'
import { useAuth } from '../../contexts/AuthContext'

const UserRegister = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    phone: '',
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
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [emailChecking, setEmailChecking] = useState(false)
  const [emailExists, setEmailExists] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  // Validation functions for name fields
  const validateNameField = (value) => {
    // Remove any non-alphabetic characters except spaces, hyphens, and apostrophes
    // Allow common name characters: letters, spaces, hyphens (for compound names), apostrophes (for names like O'Connor)
    return value.replace(/[^a-zA-Z\s'-]/g, '')
  }

  const validateBirthDate = (date) => {
    if (!date) return true // Allow empty date for validation
    
    const selectedDate = new Date(date)
    const today = new Date()
    const minDate = new Date('1900-01-01') // Reasonable minimum birth year
    
    // Check if date is in the future
    if (selectedDate > today) {
      return false
    }
    
    // Check if date is too far in the past
    if (selectedDate < minDate) {
      return false
    }
    
    return true
  }

  const handleChange = (e) => {
    let value = e.target.value
    const name = e.target.name

    // Apply name validation for firstName, lastName, and middleName
    if (name === 'firstName' || name === 'lastName' || name === 'middleName') {
      value = validateNameField(value)
    }

    setFormData({
      ...formData,
      [name]: value
    })

    // Clear error when user starts typing
    if (error) setError('')

    // Calculate password strength
    if (name === 'password') {
      const password = value
      let strength = 0
      if (password.length >= 8) strength++
      if (/[A-Z]/.test(password)) strength++
      if (/[a-z]/.test(password)) strength++
      if (/[0-9]/.test(password)) strength++
      if (/[^A-Za-z0-9]/.test(password)) strength++
      setPasswordStrength(strength)
    }

    // Check email availability with debounce
    if (name === 'email') {
      setEmailExists(false)
      const email = value.trim()
      
      if (email && email.includes('@gmail.com')) {
        // Clear previous timeout
        if (window.emailCheckTimeout) {
          clearTimeout(window.emailCheckTimeout)
        }
        
        // Set new timeout for email check
        window.emailCheckTimeout = setTimeout(async () => {
          await checkEmailAvailability(email)
        }, 500) // Check after 500ms of no typing
      }
    }
  }

  const checkEmailAvailability = async (email) => {
    if (!email || !email.includes('@gmail.com')) return
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/
    if (!emailRegex.test(email)) return
    
    setEmailChecking(true)
    try {
      const exists = await residentService.checkEmailExists(email)
      setEmailExists(exists)
    } catch (error) {
      console.error('Error checking email:', error)
    } finally {
      setEmailChecking(false)
    }
  }

  const validateStep1 = () => {
    if (!formData.firstName.trim()) {
      setError('First name is required')
      return false
    }
    
    // Check if first name contains only valid characters
    if (!/^[a-zA-Z\s'-]+$/.test(formData.firstName.trim())) {
      setError('First name can only contain letters, spaces, hyphens, and apostrophes')
      return false
    }
    
    if (!formData.lastName.trim()) {
      setError('Last name is required')
      return false
    }
    
    // Check if last name contains only valid characters
    if (!/^[a-zA-Z\s'-]+$/.test(formData.lastName.trim())) {
      setError('Last name can only contain letters, spaces, hyphens, and apostrophes')
      return false
    }
    
    // Validate middle name if provided
    if (formData.middleName.trim() && !/^[a-zA-Z\s'-]+$/.test(formData.middleName.trim())) {
      setError('Middle name can only contain letters, spaces, hyphens, and apostrophes')
      return false
    }
    
    if (!formData.birthDate) {
      setError('Birth date is required')
      return false
    }
    
    // Validate birth date
    if (!validateBirthDate(formData.birthDate)) {
      const selectedDate = new Date(formData.birthDate)
      const today = new Date()
      const minDate = new Date('1900-01-01')
      
      if (selectedDate > today) {
        setError('Birth date cannot be in the future')
      } else if (selectedDate < minDate) {
        setError('Please enter a valid birth date (year 1900 or later)')
      } else {
        setError('Please enter a valid birth date')
      }
      return false
    }
    
    // Check if person is at least 18 years old (optional requirement)
    const selectedDate = new Date(formData.birthDate)
    const today = new Date()
    const age = today.getFullYear() - selectedDate.getFullYear()
    const monthDiff = today.getMonth() - selectedDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
      // Haven't had birthday this year yet
      const actualAge = age - 1
      if (actualAge < 18) {
        setError('You must be at least 18 years old to register')
        return false
      }
    } else if (age < 18) {
      setError('You must be at least 18 years old to register')
      return false
    }
    
    return true
  }

  const validateStep2 = () => {
    if (!formData.email.trim()) {
      setError('Email is required')
      return false
    }
    
    // Gmail-only email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid Gmail address')
      return false
    }
    
    // Check if email already exists
    if (emailExists) {
      setError('This email address is already registered. Please use a different email or try logging in.')
      return false
    }
    
    if (!formData.phone.trim()) {
      setError('Phone number is required')
      return false
    }
    
    // Basic phone validation (Philippine format)
    const phoneRegex = /^(09|\+639)\d{9}$/
    if (!phoneRegex.test(formData.phone.trim().replace(/\s+/g, ''))) {
      setError('Please enter a valid Philippine phone number (e.g., 09123456789)')
      return false
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return false
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    
    return true
  }

  const handleNextStep = () => {
    setError('')
    if (validateStep1()) {
      setStep(step + 1)
    }
  }

  const handlePrevStep = () => {
    setError('')
    setStep(step - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    if (!validateStep2()) {
      setIsLoading(false)
      return
    }

    try {
      // Create user account with Appwrite
      const newUser = await authService.createAccount(
        formData.email.trim().toLowerCase(),
        formData.password,
        `${formData.firstName.trim()} ${formData.lastName.trim()}`
      )

      if (newUser) {
        // Login the newly created user
        await authService.login(formData.email.trim().toLowerCase(), formData.password)

        // Send email verification
        const verificationUrl = `${window.location.origin}/auth/verify-email`
        await authService.sendEmailVerification(verificationUrl)

        // Create resident profile
        const residentData = {
          userId: newUser.$id,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          middleName: formData.middleName.trim() || '',
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          birthDate: formData.birthDate,
          status: 'pending',
          isVerified: false,
          registrationDate: new Date().toISOString()
        }

        const resident = await residentService.createResident(residentData)

        // Prepare user data for AuthContext
        const userData = {
          id: newUser.$id,
          name: newUser.name,
          email: newUser.email,
          resident: resident
        }

        // Update auth context to keep user logged in
        await login(userData, 'user')

        setSuccess('Account created successfully! Please check your email to verify your account before proceeding.')
        
        // Redirect to email verification page
        setTimeout(() => {
          navigate('/auth/verify-email')
        }, 3000)
      }
    } catch (error) {
      console.error('Registration error:', error)
      
      // Handle different error types based on Appwrite error codes
      if (error.code === 409 || error.type === 'user_already_exists') {
        setError('An account with this email address already exists. Please use a different email or try logging in instead.')
      } else if (error.code === 400 || error.type === 'user_invalid_format') {
        setError('Invalid email format. Please enter a valid email address.')
      } else if (error.type === 'user_password_too_short' || error.message.includes('password')) {
        setError('Password must be at least 8 characters long and contain a mix of letters and numbers.')
      } else if (error.message.includes('email') || error.message.includes('Email')) {
        setError('This email address is already registered. Please use a different email or try logging in.')
      } else if (error.message.includes('unique') || error.message.includes('duplicate')) {
        setError('An account with this email already exists. Please use a different email address.')
      } else if (error.code === 429) {
        setError('Too many registration attempts. Please try again in a few minutes.')
      } else if (error.code >= 500) {
        setError('Server error. Please try again later or contact support if the problem persists.')
      } else {
        setError('Registration failed. Please check your information and try again.')
      }
    } finally {
      setIsLoading(false)
    }
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

  // Terms and Conditions Modal Component
  const TermsModal = () => (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowTermsModal(false)}></div>
        
        <div className="relative inline-block w-full max-w-4xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white shadow-xl rounded-2xl sm:my-8 sm:align-middle sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={() => setShowTermsModal(false)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition ease-in-out duration-150"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="sm:flex sm:items-start">
            <div className="w-full mt-3 text-center sm:mt-0 sm:text-left">
              <h3 className="text-2xl font-bold leading-6 text-gray-900 mb-4">
                Terms and Conditions
              </h3>
              <div className="mt-2 max-h-96 overflow-y-auto pr-4">
                <div className="text-sm text-gray-700 space-y-4">
                  <h4 className="font-semibold text-lg text-emerald-600">1. Acceptance of Terms</h4>
                  <p>By registering for the Barangay Delpilar Digital ID System, you agree to comply with and be bound by these terms and conditions.</p>
                  
                  <h4 className="font-semibold text-lg text-emerald-600">2. Use of Service</h4>
                  <p>The Digital ID System is provided for legitimate identification and barangay service purposes only. You agree not to misuse the system or provide false information.</p>
                  
                  <h4 className="font-semibold text-lg text-emerald-600">3. Account Responsibility</h4>
                  <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
                  
                  <h4 className="font-semibold text-lg text-emerald-600">4. Data Accuracy</h4>
                  <p>You must provide accurate, current, and complete information during registration and keep your information updated.</p>
                  
                  <h4 className="font-semibold text-lg text-emerald-600">5. System Availability</h4>
                  <p>While we strive for continuous service availability, we do not guarantee uninterrupted access to the system.</p>
                  
                  <h4 className="font-semibold text-lg text-emerald-600">6. Prohibited Activities</h4>
                  <p>You may not use the system to engage in any illegal activities, impersonate others, or attempt to gain unauthorized access to other accounts.</p>
                  
                  <h4 className="font-semibold text-lg text-emerald-600">7. Termination</h4>
                  <p>We reserve the right to suspend or terminate accounts that violate these terms or pose a security risk.</p>
                  
                  <h4 className="font-semibold text-lg text-emerald-600">8. Changes to Terms</h4>
                  <p>These terms may be updated from time to time. Continued use of the service constitutes acceptance of any changes.</p>
                  
                  <h4 className="font-semibold text-lg text-emerald-600">9. Contact Information</h4>
                  <p>For questions about these terms, please contact the Barangay Delpilar office or email support@ebrgy.gov.ph</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              onClick={() => setShowTermsModal(false)}
              className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Privacy Policy Modal Component
  const PrivacyModal = () => (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowPrivacyModal(false)}></div>
        
        <div className="relative inline-block w-full max-w-4xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white shadow-xl rounded-2xl sm:my-8 sm:align-middle sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition ease-in-out duration-150"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="sm:flex sm:items-start">
            <div className="w-full mt-3 text-center sm:mt-0 sm:text-left">
              <h3 className="text-2xl font-bold leading-6 text-gray-900 mb-4">
                Privacy Policy
              </h3>
              <div className="mt-2 max-h-96 overflow-y-auto pr-4">
                <div className="text-sm text-gray-700 space-y-4">
                  <h4 className="font-semibold text-lg text-emerald-600">1. Information We Collect</h4>
                  <p>We collect personal information including your name, contact details, birth date, and other identification information necessary for the digital ID system.</p>
                  
                  <h4 className="font-semibold text-lg text-emerald-600">2. How We Use Your Information</h4>
                  <p>Your information is used to:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Create and maintain your digital ID</li>
                    <li>Process barangay service requests</li>
                    <li>Verify your identity for official transactions</li>
                    <li>Communicate important updates about your account</li>
                  </ul>
                  
                  <h4 className="font-semibold text-lg text-emerald-600">3. Information Sharing</h4>
                  <p>We do not sell, trade, or rent your personal information to third parties. Information may only be shared with authorized government agencies as required by law.</p>
                  
                  <h4 className="font-semibold text-lg text-emerald-600">4. Data Security</h4>
                  <p>We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.</p>
                  
                  <h4 className="font-semibold text-lg text-emerald-600">5. Data Retention</h4>
                  <p>Your information will be retained for as long as your account is active or as needed to provide services and comply with legal obligations.</p>
                  
                  <h4 className="font-semibold text-lg text-emerald-600">6. Your Rights</h4>
                  <p>You have the right to:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Access your personal information</li>
                    <li>Request corrections to inaccurate data</li>
                    <li>Request deletion of your account (subject to legal requirements)</li>
                    <li>Withdraw consent where applicable</li>
                  </ul>
                  
                  <h4 className="font-semibold text-lg text-emerald-600">7. Cookies and Tracking</h4>
                  <p>We use session cookies and local storage to maintain your login session and improve user experience. No tracking cookies are used for advertising purposes.</p>
                  
                  <h4 className="font-semibold text-lg text-emerald-600">8. Updates to This Policy</h4>
                  <p>This privacy policy may be updated periodically. We will notify users of significant changes through the system or email.</p>
                  
                  <h4 className="font-semibold text-lg text-emerald-600">9. Contact Us</h4>
                  <p>For privacy-related questions or requests, contact the Data Protection Officer at privacy@ebrgy.gov.ph or visit the Barangay Delpilar office.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="blob-1 absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full animate-blob"></div>
        <div className="blob-2 absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-teal-200/30 to-emerald-200/30 rounded-full animate-blob animation-delay-2000"></div>
        <div className="blob-3 absolute top-40 left-1/2 transform -translate-x-1/2 w-60 h-60 bg-gradient-to-br from-emerald-100/40 to-teal-100/40 rounded-full animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8 animate-fade-in-up">
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
          </div>

          {/* Progress Bar */}
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
          </div>

          {/* Registration Form */}
          <div className="backdrop-blur-sm bg-white/80 border border-white/20 rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-500">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Error/Success Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-shake">
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

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">{success}</p>
                    </div>
                  </div>
                </div>
              )}

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
                          pattern="[a-zA-Z\s'-]+"
                          title="Only letters, spaces, hyphens, and apostrophes are allowed"
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
                          pattern="[a-zA-Z\s'-]+"
                          title="Only letters, spaces, hyphens, and apostrophes are allowed"
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
                        pattern="[a-zA-Z\s'-]*"
                        title="Only letters, spaces, hyphens, and apostrophes are allowed"
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
                        min="1900-01-01"
                        max={new Date().toISOString().split('T')[0]}
                        className={`w-full pl-10 pr-4 py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 backdrop-blur-sm bg-white/50 ${
                          focusedInput === 'birthDate' 
                            ? 'border-emerald-500 bg-white/80 shadow-lg transform scale-[1.02]' 
                            : 'border-gray-200 hover:border-emerald-300'
                        }`}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">You must be at least 18 years old to register</p>
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
              )}

              {step === 2 && (
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
                        Gmail Address *
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
                          pattern="[a-zA-Z0-9._%+-]+@gmail\.com"
                          title="Please enter a valid Gmail address "
                          className={`w-full pl-10 pr-12 py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 backdrop-blur-sm bg-white/50 ${
                            focusedInput === 'email' 
                              ? 'border-emerald-500 bg-white/80 shadow-lg transform scale-[1.02]' 
                              : emailExists 
                                ? 'border-red-300 hover:border-red-400'
                                : formData.email && !emailExists && !emailChecking && /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email)
                                  ? 'border-green-300 hover:border-green-400'
                                  : 'border-gray-200 hover:border-emerald-300'
                          }`}
                          placeholder="juan.delacruz@gmail.com"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          {emailChecking ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600"></div>
                          ) : emailExists ? (
                            <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          ) : formData.email && !emailExists && !emailChecking && /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email) ? (
                            <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : null}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Only Gmail addresses are accepted</p>
                      {emailExists && (
                        <p className="text-sm text-red-500 mt-1 flex items-center">
                          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          This email is already registered. 
                          <Link to="/auth/login" className="ml-1 text-emerald-600 hover:text-emerald-700 font-medium underline">
                            Try logging in?
                          </Link>
                        </p>
                      )}
                      {formData.email && !emailExists && !emailChecking && /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email) && (
                        <p className="text-sm text-green-600 mt-1 flex items-center">
                          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Gmail address is available
                        </p>
                      )}
                      {formData.email && formData.email.length > 5 && !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email) && (
                        <p className="text-sm text-red-500 mt-1 flex items-center">
                          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Please enter a valid Gmail address ending with @gmail.com
                        </p>
                      )}
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
                        <button 
                          type="button"
                          onClick={() => setShowTermsModal(true)}
                          className="text-emerald-600 hover:text-emerald-700 font-semibold underline decoration-2 underline-offset-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded"
                        >
                          Terms and Conditions
                        </button>{' '}
                        and{' '}
                        <button 
                          type="button"
                          onClick={() => setShowPrivacyModal(true)}
                          className="text-emerald-600 hover:text-emerald-700 font-semibold underline decoration-2 underline-offset-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded"
                        >
                          Privacy Policy
                        </button>
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
                        disabled={isLoading || formData.password !== formData.confirmPassword || emailExists || emailChecking}
                        className="flex-1 group relative flex justify-center py-4 px-4 border border-transparent rounded-xl text-white font-semibold text-lg bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-700 hover:via-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] disabled:transform-none disabled:shadow-none"
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

      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Terms and Conditions</h2>
              <button
                onClick={() => setShowTermsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-3">1. Acceptance of Terms</h3>
                <p className="mb-4">By using the Barangay Delpilar Digital ID System, you agree to comply with and be bound by these Terms and Conditions.</p>
                
                <h3 className="text-lg font-semibold mb-3">2. Eligibility and Registration</h3>
                <p className="mb-4">You must be a verified resident of Barangay Delpilar to register for this service. All information provided during registration must be accurate and complete.</p>
                
                <h3 className="text-lg font-semibold mb-3">3. Permitted Use</h3>
                <p className="mb-4">The Digital ID is intended for official identification purposes within Barangay Delpilar and authorized partner establishments. Misuse or fraudulent use is strictly prohibited.</p>
                
                <h3 className="text-lg font-semibold mb-3">4. Account Security</h3>
                <p className="mb-4">You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
                
                <h3 className="text-lg font-semibold mb-3">5. Data Accuracy</h3>
                <p className="mb-4">You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate and complete.</p>
                
                <h3 className="text-lg font-semibold mb-3">6. Prohibited Activities</h3>
                <p className="mb-4">You may not use the service for any unlawful purpose, to impersonate others, or to interfere with the proper functioning of the system.</p>
                
                <h3 className="text-lg font-semibold mb-3">7. Service Availability</h3>
                <p className="mb-4">We strive to provide continuous service but do not guarantee uninterrupted access. The service may be temporarily unavailable for maintenance or technical issues.</p>
                
                <h3 className="text-lg font-semibold mb-3">8. Modifications</h3>
                <p className="mb-4">We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.</p>
                
                <h3 className="text-lg font-semibold mb-3">9. Contact Information</h3>
                <p className="mb-4">For questions about these terms, contact us at the Barangay Delpilar office or through our official channels.</p>
              </div>
            </div>
            <div className="flex justify-end p-6 border-t">
              <button
                onClick={() => setShowTermsModal(false)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Privacy Policy</h2>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-3">1. Information We Collect</h3>
                <p className="mb-4">We collect personal information including your name, address, contact details, and other identification information necessary for creating your Digital ID.</p>
                
                <h3 className="text-lg font-semibold mb-3">2. How We Use Your Information</h3>
                <p className="mb-4">Your information is used to create and maintain your Digital ID, verify your identity, and provide barangay services. We do not sell or share your personal information with third parties without your consent.</p>
                
                <h3 className="text-lg font-semibold mb-3">3. Data Security</h3>
                <p className="mb-4">We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
                
                <h3 className="text-lg font-semibold mb-3">4. Data Retention</h3>
                <p className="mb-4">We retain your personal information only as long as necessary to provide our services and comply with legal obligations.</p>
                
                <h3 className="text-lg font-semibold mb-3">5. Your Rights</h3>
                <p className="mb-4">You have the right to access, update, or delete your personal information. You may also withdraw consent for data processing where applicable.</p>
                
                <h3 className="text-lg font-semibold mb-3">6. Cookies and Tracking</h3>
                <p className="mb-4">We use cookies and similar technologies to enhance your experience and maintain your session. You can disable cookies in your browser settings.</p>
                
                <h3 className="text-lg font-semibold mb-3">7. Third-Party Services</h3>
                <p className="mb-4">Our service may integrate with third-party platforms for enhanced functionality. These services have their own privacy policies.</p>
                
                <h3 className="text-lg font-semibold mb-3">8. Updates to Privacy Policy</h3>
                <p className="mb-4">We may update this privacy policy from time to time. We will notify you of any material changes through the platform or other communication methods.</p>
                
                <h3 className="text-lg font-semibold mb-3">9. Contact Us</h3>
                <p className="mb-4">If you have questions about this privacy policy or how we handle your personal information, please contact us at the Barangay Delpilar office.</p>
              </div>
            </div>
            <div className="flex justify-end p-6 border-t">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserRegister
