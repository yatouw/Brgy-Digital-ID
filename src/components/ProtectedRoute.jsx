import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// Loading component
const AuthLoading = () => (
  <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
    <div className="text-center">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
          <img 
            src="/src/assets/ebrgy-logo2.png" 
            alt="eBrgy Logo" 
            className="h-8 w-8 object-contain"
          />
        </div>
      </div>
      <p className="text-gray-600 font-medium">Checking authentication...</p>
      <p className="text-gray-400 text-sm mt-2">Please wait a moment</p>
    </div>
  </div>
)

// ProtectedRoute component for user routes
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <AuthLoading />
  }

  if (!isAuthenticated) {
    // Redirect to login with the intended destination
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  return children
}

// PublicRoute component for auth pages (login/register)
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading, isAdmin } = useAuth()

  if (isLoading) {
    return <AuthLoading />
  }

  if (isAuthenticated) {
    // Redirect authenticated users to appropriate dashboard
    const redirectTo = isAdmin ? '/admin/dashboard' : '/user/dashboard'
    return <Navigate to={redirectTo} replace />
  }

  return children
}

// AdminRoute component for admin routes
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isLoading, isAdmin } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <AuthLoading />
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/admin-login" state={{ from: location }} replace />
  }

  if (!isAdmin) {
    // User is authenticated but not admin, redirect to user dashboard
    return <Navigate to="/user/dashboard" replace />
  }

  return children
}

// RedirectIfAuthenticated - for pages that should redirect if user is already logged in
export const RedirectIfAuthenticated = ({ children, redirectTo = '/user/dashboard' }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <AuthLoading />
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  return children
}