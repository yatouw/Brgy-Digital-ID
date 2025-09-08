import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { authService } from '../../api/appwrite/appwrite'
import { useAuth } from '../../contexts/AuthContext'

const EmailVerification = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user, login } = useAuth()
  const [status, setStatus] = useState('verifying') // 'verifying', 'success', 'error', 'pending'
  const [message, setMessage] = useState('')
  const [isResending, setIsResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  const userId = searchParams.get('userId')
  const secret = searchParams.get('secret')

  useEffect(() => {
    // If we have userId and secret in URL, verify automatically
    if (userId && secret) {
      handleVerification(userId, secret)
    } else if (!user) {
      // If no user and no verification params, redirect to login
      navigate('/auth/login')
    } else {
      // User is logged in but email not verified yet
      setStatus('pending')
      setMessage('Please check your email and click the verification link we sent to you.')
    }
  }, [userId, secret, user, navigate])

  const handleVerification = async (userIdParam, secretParam) => {
    try {
      setStatus('verifying')
      setMessage('Verifying your email address...')
      
      await authService.verifyEmail(userIdParam, secretParam)
      
      setStatus('success')
      setMessage('Email verified successfully! You can now access your account.')
      
      // If user is already logged in, refresh their data to update verification status
      if (user) {
        const updatedUser = await authService.getCurrentUser()
        if (updatedUser) {
          await login({ ...user, emailVerification: true }, 'user')
        }
      }
      
      // Redirect to dashboard after success
      setTimeout(() => {
        if (user) {
          navigate('/user/dashboard')
        } else {
          navigate('/auth/login')
        }
      }, 3000)
      
    } catch (error) {
      console.error('Email verification error:', error)
      setStatus('error')
      
      if (error.code === 401 || error.message?.includes('Invalid credentials')) {
        setMessage('Verification link is invalid or has expired. Please request a new verification email.')
      } else {
        setMessage('Verification failed. Please try again or contact support.')
      }
    }
  }

  const handleResendVerification = async () => {
    if (!user || isResending || resendCooldown > 0) return
    
    try {
      setIsResending(true)
      
      // Create verification URL
      const verificationUrl = `${window.location.origin}/auth/verify-email`
      await authService.sendEmailVerification(verificationUrl)
      
      setMessage('Verification email sent! Please check your inbox and spam folder.')
      
      // Start cooldown timer
      setResendCooldown(60)
      const timer = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
    } catch (error) {
      console.error('Resend verification error:', error)
      setMessage('Failed to resend verification email. Please try again later.')
    } finally {
      setIsResending(false)
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        )
      case 'success':
        return (
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        )
      case 'error':
        return (
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        )
      default:
        return (
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100">
            <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        )
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'text-green-600'
      case 'error': return 'text-red-600'
      case 'verifying': return 'text-blue-600'
      default: return 'text-yellow-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img 
            src="/ebrgy-logo.jpeg" 
            alt="eBrgy Digital ID" 
            className="h-20 w-auto"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Email Verification
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            {getStatusIcon()}
            
            <h3 className={`mt-4 text-lg font-medium ${getStatusColor()}`}>
              {status === 'verifying' && 'Verifying Email...'}
              {status === 'success' && 'Email Verified!'}
              {status === 'error' && 'Verification Failed'}
              {status === 'pending' && 'Email Verification Required'}
            </h3>
            
            <p className="mt-2 text-sm text-gray-600">
              {message}
            </p>

            {/* Show resend button for pending status or error */}
            {(status === 'pending' || status === 'error') && user && (
              <div className="mt-6">
                <button
                  onClick={handleResendVerification}
                  disabled={isResending || resendCooldown > 0}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResending ? 'Sending...' : 
                   resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 
                   'Resend Verification Email'}
                </button>
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-6 space-y-3">
              {status === 'success' && (
                <Link
                  to="/user/dashboard"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Go to Dashboard
                </Link>
              )}
              
              {!user && (
                <Link
                  to="/auth/login"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Back to Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailVerification
