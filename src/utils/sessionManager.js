// Session Management Utility
// Handles automatic session cleanup and security

import SESSION_CONFIG from '../config/sessionConfig'

class SessionManager {
  constructor() {
    this.sessionTimeout = SESSION_CONFIG.SESSION_TIMEOUT
    this.warningTimeout = SESSION_CONFIG.WARNING_TIMEOUT
    this.activityTimer = null
    this.warningTimer = null
    this.onSessionExpired = null
    this.onSessionWarning = null
    
    // Add validation caching to prevent excessive API calls
    this.lastValidationTime = 0
    this.validationCooldown = SESSION_CONFIG.VALIDATION_COOLDOWN
    this.isValidating = false
    
    this.initializeSessionManagement()
  }

  // Initialize all session management features
  initializeSessionManagement() {
    this.setupBeforeUnloadHandler()
    this.setupVisibilityChangeHandler()
    this.setupActivityTracking()
    this.setupStorageEventListener()
  }

  // Use sessionStorage for automatic cleanup
  setSessionData(key, data) {
    try {
      const sessionData = {
        data: data,
        timestamp: Date.now(),
        expiresAt: Date.now() + this.sessionTimeout
      }
      sessionStorage.setItem(key, JSON.stringify(sessionData))
      this.resetActivityTimer()
    } catch (error) {
      console.error('Error setting session data:', error)
    }
  }

  // Get session data with expiration check
  getSessionData(key) {
    try {
      const sessionData = sessionStorage.getItem(key)
      if (!sessionData) {
        return null
      }

      const parsed = JSON.parse(sessionData)
      
      // Check if session has expired
      if (Date.now() > parsed.expiresAt) {
        this.clearSessionData(key)
        return null
      }

      // Update expiration time on access
      parsed.expiresAt = Date.now() + this.sessionTimeout
      sessionStorage.setItem(key, JSON.stringify(parsed))
      
      return parsed.data
    } catch (error) {
      console.error('Error getting session data:', error)
      return null
    }
  }

  // Clear specific session data
  clearSessionData(key) {
    try {
      sessionStorage.removeItem(key)
    } catch (error) {
      console.error('Error clearing session data:', error)
    }
  }

  // Clear all session data
  clearAllSessionData() {
    try {
      // Clear auth-related data
      const authKeys = ['user', 'userType', 'adminData']
      authKeys.forEach(key => {
        sessionStorage.removeItem(key)
      })
      
      // Clear any temporary session data
      for (let i = sessionStorage.length - 1; i >= 0; i--) {
        const key = sessionStorage.key(i)
        if (key && (key.startsWith('auth_') || key.startsWith('session_'))) {
          sessionStorage.removeItem(key)
        }
      }
    } catch (error) {
      console.error('Error clearing all session data:', error)
    }
  }

  // Setup beforeunload handler to clear session on browser close
  setupBeforeUnloadHandler() {
    window.addEventListener('beforeunload', (event) => {
      // Clear session storage (automatic for tab close)
      // Keep localStorage for legitimate page refreshes
      
      // If user is navigating away (not just refreshing), clear everything
      if (event.type === 'beforeunload') {
        // Set a flag to check if this was a refresh or actual close
        sessionStorage.setItem('session_closing', 'true')
        
        // Clear session after a short delay to allow for page refresh
        setTimeout(() => {
          const isClosing = sessionStorage.getItem('session_closing')
          if (isClosing) {
            this.handleSessionEnd()
          }
        }, 100)
      }
    })

    // Clear the closing flag if page loads successfully (was a refresh)
    window.addEventListener('load', () => {
      sessionStorage.removeItem('session_closing')
    })
  }

  // Setup visibility change handler for tab switching
  setupVisibilityChangeHandler() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Tab became hidden - start session timeout
        this.startInactivityTimer()
      } else {
        // Tab became visible - only validate if we have a session AND enough time has passed
        const sessionData = sessionStorage.getItem('user')
        if (sessionData) {
          this.throttledValidateSession()
        }
        this.resetActivityTimer()
      }
    })
  }

  // Setup activity tracking for auto-logout
  setupActivityTracking() {
    // Reduce activity events to avoid excessive timer resets
    const activities = ['mousedown', 'keypress', 'click', 'scroll']
    let lastActivityTime = 0
    const activityThrottle = SESSION_CONFIG.ACTIVITY_THROTTLE
    
    const throttledActivityHandler = () => {
      const now = Date.now()
      if (now - lastActivityTime >= activityThrottle) {
        lastActivityTime = now
        this.resetActivityTimer()
      }
    }
    
    activities.forEach(activity => {
      document.addEventListener(activity, throttledActivityHandler, true)
    })

    this.resetActivityTimer()
  }

  // Setup storage event listener for cross-tab session management
  setupStorageEventListener() {
    window.addEventListener('storage', (event) => {
      if (event.key === 'user' && !event.newValue) {
        // User was logged out in another tab
        this.handleSessionEnd()
      }
    })
  }

  // Reset activity timer
  resetActivityTimer() {
    if (this.activityTimer) {
      clearTimeout(this.activityTimer)
    }
    if (this.warningTimer) {
      clearTimeout(this.warningTimer)
    }

    // Set warning timer (5 minutes before logout)
    this.warningTimer = setTimeout(() => {
      this.showSessionWarning()
    }, this.sessionTimeout - this.warningTimeout)

    // Set logout timer (30 minutes)
    this.activityTimer = setTimeout(() => {
      this.handleSessionExpired()
    }, this.sessionTimeout)
  }

  // Start inactivity timer when tab is hidden
  startInactivityTimer() {
    if (this.activityTimer) {
      clearTimeout(this.activityTimer)
    }

    // Shorter timeout when tab is hidden
    this.activityTimer = setTimeout(() => {
      this.handleSessionExpired()
    }, SESSION_CONFIG.HIDDEN_TAB_TIMEOUT)
  }

  // Throttled session validation to prevent excessive API calls
  throttledValidateSession() {
    // Skip validation if throttling is disabled
    if (!SESSION_CONFIG.ENABLE_THROTTLING) {
      this.validateCurrentSession()
      return
    }

    // Check local session data first - if no session, don't validate
    const sessionData = sessionStorage.getItem('user')
    if (!sessionData) {
      return
    }

    const now = Date.now()
    
    // Check if we're already validating or in cooldown period
    if (this.isValidating || (now - this.lastValidationTime) < this.validationCooldown) {
      return
    }

    // Validate session data locally first
    if (SESSION_CONFIG.ENABLE_LOCAL_VALIDATION) {
      try {
        const parsed = JSON.parse(sessionData)
        // If session is expired locally, don't bother with API call
        if (Date.now() > parsed.expiresAt) {
          this.handleSessionEnd()
          return
        }
      } catch (error) {
        console.error('Error parsing session data:', error)
        // Clear corrupted session data
        sessionStorage.removeItem('user')
        return
      }
    }

    // Only proceed with API validation if we have valid local session
    this.validateCurrentSession()
  }

  // Validate current session
  async validateCurrentSession() {
    if (this.isValidating) return
    
    try {
      this.isValidating = true
      this.lastValidationTime = Date.now()
      
      // Import authService dynamically to avoid circular dependency
      const { authService } = await import('../api/appwrite/appwrite')
      const currentUser = await authService.getCurrentUser()
      
      if (!currentUser) {
        this.handleSessionEnd()
      }
    } catch (error) {
      console.error('Session validation failed:', error)
      this.handleSessionEnd()
    } finally {
      this.isValidating = false
    }
  }

  // Show session warning
  showSessionWarning() {
    if (this.onSessionWarning) {
      this.onSessionWarning()
    } else {
      // Default warning implementation
      const extend = confirm('Your session will expire in 5 minutes. Would you like to extend your session?')
      if (extend) {
        this.resetActivityTimer()
      }
    }
  }

  // Handle session expiration
  handleSessionExpired() {
    if (this.onSessionExpired) {
      this.onSessionExpired()
    } else {
      // Default expiration handling
      alert('Your session has expired for security reasons. Please log in again.')
      this.handleSessionEnd()
    }
  }

  // Handle session end (logout and cleanup)
  async handleSessionEnd() {
    try {
      // Clear timers
      if (this.activityTimer) clearTimeout(this.activityTimer)
      if (this.warningTimer) clearTimeout(this.warningTimer)

      // Clear all session data
      this.clearAllSessionData()

      // Import authService dynamically to avoid circular dependency
      const { authService } = await import('../api/appwrite/appwrite')
      
      // Logout from Appwrite
      await authService.logout()

      // Redirect to home page
      if (window.location.pathname !== '/') {
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Error during session end:', error)
      // Force redirect even if logout fails
      window.location.href = '/'
    }
  }

  // Set callbacks for session events
  setSessionCallbacks(onExpired, onWarning) {
    this.onSessionExpired = onExpired
    this.onSessionWarning = onWarning
  }

  // Extend session manually
  extendSession() {
    this.resetActivityTimer()
    
    // Update session data expiration
    const userData = this.getSessionData('user')
    if (userData) {
      this.setSessionData('user', userData)
    }
  }

  // Check if session is active
  isSessionActive() {
    const userData = this.getSessionData('user')
    return userData !== null
  }

  // Get remaining session time
  getSessionTimeRemaining() {
    try {
      const sessionData = sessionStorage.getItem('user')
      if (!sessionData) return 0

      const parsed = JSON.parse(sessionData)
      const remaining = parsed.expiresAt - Date.now()
      return Math.max(0, remaining)
    } catch (error) {
      return 0
    }
  }
}

// Create singleton instance
const sessionManager = new SessionManager()

export default sessionManager
