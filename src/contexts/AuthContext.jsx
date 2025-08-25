import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService, residentService, adminService } from '../api/appwrite/appwrite'

// Create AuthContext
const AuthContext = createContext({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isAdmin: false,
  login: () => {},
  logout: () => {},
  checkAuthStatus: () => {}
})

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true)
      
      // Check if user data exists in localStorage
      const storedUser = localStorage.getItem('user')
      
      if (storedUser) {
        // Verify the session is still valid with Appwrite
        const currentUser = await authService.getCurrentUser()
        
        if (currentUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
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
          // Session expired, clear localStorage
          localStorage.removeItem('user')
          setUser(null)
          setIsAuthenticated(false)
          setIsAdmin(false)
        }
      } else {
        // Try to get current user from Appwrite
        const currentUser = await authService.getCurrentUser()
        
        if (currentUser) {
          // User is logged in but not in localStorage, fetch resident data
          const resident = await residentService.getResidentByUserId(currentUser.$id)
          
          if (resident) {
            const userData = {
              id: currentUser.$id,
              name: currentUser.name,
              email: currentUser.email,
              resident: resident
            }
            
            localStorage.setItem('user', JSON.stringify(userData))
            setUser(userData)
            setIsAuthenticated(true)
            
            // Check if user is admin
            const adminStatus = await adminService.isAdmin(currentUser.$id)
            setIsAdmin(adminStatus)
          }
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
      setIsAuthenticated(false)
      setIsAdmin(false)
      localStorage.removeItem('user')
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (userData, userType = 'user') => {
    setUser(userData)
    setIsAuthenticated(true)
    setIsAdmin(userType === 'admin')
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('userType', userType)
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
      localStorage.removeItem('user')
      localStorage.removeItem('userType')
    }
  }

  const value = {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    checkAuthStatus
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