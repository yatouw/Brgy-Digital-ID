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
      const storedUserType = sessionManager.getSessionData('userType')
      
      if (storedUser) {
        // Only verify with Appwrite if we have local session data
        const currentUser = await authService.getCurrentUser()
        
        if (currentUser) {
          setUser(storedUser)
          setIsAuthenticated(true)
          
          // Check if user is admin based on stored type first
          if (storedUserType === 'admin') {
            // Verify admin status with database
            try {
              const adminStatus = await adminService.isAdmin(currentUser.$id)
              setIsAdmin(adminStatus)
              
              // If stored as admin but not actually admin, clear session
              if (!adminStatus) {
                console.warn('User stored as admin but not in admin database, clearing session')
                sessionManager.clearAllSessionData()
                setUser(null)
                setIsAuthenticated(false)
                setIsAdmin(false)
              }
            } catch (error) {
              setIsAdmin(false)
            }
          } else {
            // Regular user
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
        try {
          const currentUser = await authService.getCurrentUser()
          
          if (currentUser) {
            // First check if it's an admin
            const adminStatus = await adminService.isAdmin(currentUser.$id)
            
            if (adminStatus) {
              // This is an admin user
              const adminData = await adminService.getAdminByUserId(currentUser.$id)
              const adminUserData = {
                id: currentUser.$id,
                name: currentUser.name,
                email: currentUser.email,
                isAdmin: true,
                adminData: adminData || {}
              }
              
              sessionManager.setSessionData('user', adminUserData)
              sessionManager.setSessionData('userType', 'admin')
              setUser(adminUserData)
              setIsAuthenticated(true)
              setIsAdmin(true)
            } else {
              // Regular user - fetch resident data
              const resident = await residentService.getResidentByUserId(currentUser.$id)
              
              if (resident) {
                const userData = {
                  id: currentUser.$id,
                  name: currentUser.name,
                  email: currentUser.email,
                  resident: resident
                }
                
                sessionManager.setSessionData('user', userData)
                sessionManager.setSessionData('userType', 'user')
                setUser(userData)
                setIsAuthenticated(true)
                setIsAdmin(false)
              }
            }
          } else {
            // No session at all
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
      // Always try to logout from Appwrite first
      await authService.logout()
    } catch (error) {
      // If logout fails (e.g., no session), that's okay - continue with cleanup
    } finally {
      // Always clean up local state regardless of Appwrite logout result
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

  // Check if current user can be upgraded to admin
  const checkAndUpgradeToAdmin = async () => {
    // This function is deprecated - admin login should be handled through AdminLogin component
    // Return false to indicate no upgrade happened
    return false
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
    getSessionTimeRemaining,
    checkAndUpgradeToAdmin
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