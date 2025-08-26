// Session Cleanup Hook
// Handles cleanup when the browser tab/window is closed

import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import sessionManager from './sessionManager'

export const useSessionCleanup = () => {
  const { isAuthenticated, logout } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) return

    let isPageUnloading = false

    // Handle page unload (close tab/browser)
    const handleBeforeUnload = (event) => {
      isPageUnloading = true
      
      // Clear session storage immediately for security
      sessionManager.clearAllSessionData()
      
      // For legitimate closes, also logout from Appwrite
      if (isAuthenticated) {
        // Use sendBeacon for reliable logout on page unload
        try {
          logout()
        } catch (error) {
          console.error('Error during logout on page unload:', error)
        }
      }
    }

    // Handle page show (when user comes back to tab)
    const handlePageShow = (event) => {
      if (event.persisted) {
        // Page was loaded from cache, use throttled validation
        sessionManager.throttledValidateSession()
      }
    }

    // Handle page hide (when user leaves tab)
    const handlePageHide = () => {
      if (!isPageUnloading && isAuthenticated) {
        // User switched tabs, start shorter session timer
        sessionManager.startInactivityTimer()
      }
    }

    // Handle focus events - use throttled validation
    const handleFocus = () => {
      if (isAuthenticated) {
        sessionManager.throttledValidateSession()
        sessionManager.resetActivityTimer()
      }
    }

    const handleBlur = () => {
      if (isAuthenticated) {
        sessionManager.startInactivityTimer()
      }
    }

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('pageshow', handlePageShow)
    window.addEventListener('pagehide', handlePageHide)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    // Cleanup function
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('pageshow', handlePageShow)
      window.removeEventListener('pagehide', handlePageHide)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
    }
  }, [isAuthenticated, logout])
}

export default useSessionCleanup
