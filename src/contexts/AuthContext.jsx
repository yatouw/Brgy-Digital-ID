import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService, residentService, adminService } from '../api/appwrite/appwrite'
import sessionManager from '../utils/sessionManager'

// Create AuthContext
const AuthContext = createContext({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isAdmin: false,
  login: () => {},
  logout: () => {},
  checkAuthStatus: () => {},
  extendSession: () => {},
  getSessionTimeRemaining: () => 0
})

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [sessionWarningShown, setSessionWarningShown] = useState(false)

  useEffect(() => {
    checkAuthStatus()
    setupSessionCallbacks()
  }, [])

  // Setup session manager callbacks
  const setupSessionCallbacks = () => {
    sessionManager.setSessionCallbacks(
      // On session expired
      () => {
        handleSessionExpired()
      },
      // On session warning
      () => {
        showSessionWarning()
      }
    )
  }

  // Handle session expiration
  const handleSessionExpired = async () => {
    setUser(null)
    setIsAuthenticated(false)
    setIsAdmin(false)
    // Session manager will handle the logout and redirect
  }

  // Show session warning dialog
  const showSessionWarning = () => {
    if (sessionWarningShown) return
    setSessionWarningShown(true)

    const extendSession = window.confirm(
      'Your session will expire in 5 minutes due to inactivity. Would you like to extend your session?'
    )
    
    if (extendSession) {
      sessionManager.extendSession()
      setSessionWarningShown(false)
    } else {
      // User chose not to extend, logout immediately
      logout()
    }
    
    // Reset warning flag after a delay
    setTimeout(() => setSessionWarningShown(false), 60000) // Reset after 1 minute
  }

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true)
      
      // Check session manager first
      const storedUser = sessionManager.getSessionData('user')
      
      if (storedUser) {
        // Only verify with Appwrite if we have local session data
        const currentUser = await authService.getCurrentUser()
        
        if (currentUser) {
          setUser(storedUser)
          setIsAuthenticated(true)
          
          // Check if user is admin (with error handling)
          try {
            const adminStatus = await adminService.isAdmin(currentUser.$id)
            setIsAdmin(adminStatus)
          } catch (error) {
            console.warn('Admin check failed, defaulting to false:', error)
            setIsAdmin(false)
          }
        } else {
          // Session expired, clear everything
          sessionManager.clearAllSessionData()
          setUser(null)
          setIsAuthenticated(false)
          setIsAdmin(false)
        }
      } else {
        // No local session, check if there's an active Appwrite session
        // Only call getCurrentUser once if no local session exists
        try {
          const currentUser = await authService.getCurrentUser()
          
          if (currentUser) {
            // User is logged in but not in session storage, fetch resident data
            const resident = await residentService.getResidentByUserId(currentUser.$id)
            
            if (resident) {
              const userData = {
                id: currentUser.$id,
                name: currentUser.name,
                email: currentUser.email,
                resident: resident
              }
              
              sessionManager.setSessionData('user', userData)
              setUser(userData)
              setIsAuthenticated(true)
              
              // Check if user is admin
              const adminStatus = await adminService.isAdmin(currentUser.$id)
              setIsAdmin(adminStatus)
            }
          } else {
            // No session at all, set to logged out state
            setUser(null)
            setIsAuthenticated(false)
            setIsAdmin(false)
          }
        } catch (error) {
          // If getCurrentUser fails (401), user is not logged in
          if (error.code === 401 || error.type === 'general_unauthorized_scope') {
            setUser(null)
            setIsAuthenticated(false)
            setIsAdmin(false)
          } else {
            console.error('Auth check failed:', error)
            setUser(null)
            setIsAuthenticated(false)
            setIsAdmin(false)
            sessionManager.clearAllSessionData()
          }
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
      setIsAuthenticated(false)
      setIsAdmin(false)
      sessionManager.clearAllSessionData()
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (userData, userType = 'user') => {
    setUser(userData)
    setIsAuthenticated(true)
    setIsAdmin(userType === 'admin')
    sessionManager.setSessionData('user', userData)
    sessionManager.setSessionData('userType', userType)
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setIsAuthenticated(false)
      setIsAdmin(false)
      sessionManager.clearAllSessionData()
    }
  }

  // Extend session function
  const extendSession = () => {
    sessionManager.extendSession()
    setSessionWarningShown(false)
  }

  // Get remaining session time
  const getSessionTimeRemaining = () => {
    return sessionManager.getSessionTimeRemaining()
  }

  const value = {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    checkAuthStatus,
    extendSession,
    getSessionTimeRemaining
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}