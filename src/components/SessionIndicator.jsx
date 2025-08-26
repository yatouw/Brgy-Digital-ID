import React, { useState, useEffect } from 'react'
import { FaClock, FaSignOutAlt, FaRedo } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'

const SessionIndicator = () => {
  const { isAuthenticated, extendSession, getSessionTimeRemaining, logout } = useAuth()
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) return

    const updateTimer = () => {
      const remaining = getSessionTimeRemaining()
      setTimeRemaining(remaining)
      
      // Show warning when less than 5 minutes remain
      setShowWarning(remaining <= 5 * 60 * 1000 && remaining > 0)
    }

    // Update immediately
    updateTimer()

    // Update every 30 seconds
    const interval = setInterval(updateTimer, 30000)

    return () => clearInterval(interval)
  }, [isAuthenticated, getSessionTimeRemaining])

  if (!isAuthenticated || timeRemaining <= 0) {
    return null
  }

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / (60 * 1000))
    const seconds = Math.floor((ms % (60 * 1000)) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleExtendSession = () => {
    extendSession()
    setShowWarning(false)
  }

  if (showWarning) {
    return (
      <div className="fixed top-4 right-4 z-50 bg-red-50 border border-red-200 rounded-xl p-4 shadow-lg max-w-sm animate-bounce">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <FaClock className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-red-800 font-semibold text-sm">Session Expiring Soon!</h3>
            <p className="text-red-700 text-xs mt-1">
              Your session will expire in {formatTime(timeRemaining)} for security.
            </p>
            <div className="flex space-x-2 mt-3">
              <button
                onClick={handleExtendSession}
                className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                <FaRedo className="w-3 h-3 mr-1" />
                Extend Session
              </button>
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-1.5 bg-gray-600 text-white text-xs font-medium rounded-lg hover:bg-gray-700 transition-colors"
              >
                <FaSignOutAlt className="w-3 h-3 mr-1" />
                Logout Now
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Normal session indicator (less prominent)
  return (
    <div className="fixed bottom-4 right-4 z-40 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm text-xs text-gray-600 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-2">
        <FaClock className="w-3 h-3 text-green-500" />
        <span>Session: {formatTime(timeRemaining)}</span>
      </div>
    </div>
  )
}

export default SessionIndicator
