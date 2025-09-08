import React, { useState } from 'react'
import { authService } from '../api/appwrite/appwrite'
import { useAuth } from '../contexts/AuthContext'

const EmailVerificationBanner = () => {
  const { user } = useAuth()
  const [isResending, setIsResending] = useState(false)
  const [message, setMessage] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)

  // Don't show banner if email is already verified
  if (!user || user.emailVerification) {
    return null
  }

  const handleResendVerification = async () => {
    if (isResending || resendCooldown > 0) return
    
    try {
      setIsResending(true)
      setMessage('')
      
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

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            Email Verification Required
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              Please verify your email address to access all features. 
              Check your inbox for a verification link.
            </p>
            {message && (
              <p className="mt-2 text-sm font-medium text-green-700">
                {message}
              </p>
            )}
          </div>
          <div className="mt-3">
            <button
              onClick={handleResendVerification}
              disabled={isResending || resendCooldown > 0}
              className="text-sm font-medium text-yellow-800 hover:text-yellow-900 disabled:opacity-50 disabled:cursor-not-allowed underline"
            >
              {isResending ? 'Sending...' : 
               resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 
               'Resend verification email'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailVerificationBanner
