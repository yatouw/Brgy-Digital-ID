import { useAuth } from '../contexts/AuthContext'
import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, isAdmin, isLoading } = useAuth()
  const location = useLocation()
  const [authCheckComplete, setAuthCheckComplete] = useState(false)

  useEffect(() => {
    // Wait for initial auth check to complete
    if (!isLoading) {
      setAuthCheckComplete(true)
    }
  }, [isLoading])

  // Show loading while auth is being determined
  if (!authCheckComplete || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Checking authentication...</span>
      </div>
    )
  }

  // If not authenticated, redirect to admin login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  // If authenticated but not admin, redirect to unauthorized or home
  if (!isAdmin) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />
  }

  // User is authenticated and is admin
  return children
}

export default AdminRoute
