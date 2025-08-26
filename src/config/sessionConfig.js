// Session Configuration
// Centralized configuration for session management timeouts and throttling

export const SESSION_CONFIG = {
  // Session timeouts (in milliseconds)
  SESSION_TIMEOUT: 30 * 60 * 1000,        // 30 minutes active session
  WARNING_TIMEOUT: 5 * 60 * 1000,         // 5 minutes warning before expiration
  HIDDEN_TAB_TIMEOUT: 10 * 60 * 1000,     // 10 minutes when tab is hidden
  
  // API call throttling (to prevent excessive requests)
  VALIDATION_COOLDOWN: 2 * 60 * 1000,     // 2 minutes between session validations (increased)
  ACTIVITY_THROTTLE: 60 * 1000,           // 1 minute between activity timer resets (increased)
  
  // UI update intervals
  SESSION_INDICATOR_UPDATE: 30 * 1000,    // 30 seconds for session timer display
  
  // Session validation settings
  ENABLE_THROTTLING: true,                 // Enable/disable API call throttling
  ENABLE_LOCAL_VALIDATION: true,          // Check local session before API calls
  PREVENT_NO_SESSION_CALLS: true,         // Never call API if no local session exists
  
  // Debug settings
  DEBUG_MODE: false,                       // Enable debug logging
  LOG_API_CALLS: false                     // Log all API validation calls
}

// Helper functions for time formatting
export const formatSessionTime = (ms) => {
  const minutes = Math.floor(ms / (60 * 1000))
  const seconds = Math.floor((ms % (60 * 1000)) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export const getTimeUntilWarning = (sessionTime) => {
  return Math.max(0, sessionTime - SESSION_CONFIG.WARNING_TIMEOUT)
}

export default SESSION_CONFIG
