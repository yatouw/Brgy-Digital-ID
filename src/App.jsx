import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Auth Components
import { ProtectedRoute, PublicRoute, AdminRoute } from './components/ProtectedRoute'
import SessionIndicator from './components/SessionIndicator'

// Layouts
import UserLayout from './layouts/user/UserLayout'
import AdminLayout from './layouts/admin/AdminLayout'

// Shared Pages
import LandingPage from './pages/shared/LandingPage'

// Auth Pages
import UserLogin from './pages/auth/UserLogin'
import UserRegister from './pages/auth/UserRegister'
import AdminLogin from './pages/auth/AdminLogin'

// User Pages
import UserDashboard from './pages/user/UserDashboard'
import UserProfile from './pages/user/UserProfile'
import DigitalID from './pages/user/DigitalID'
import Services from './pages/user/Services'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import ResidentManagement from './pages/admin/ResidentManagement'
import IDManagement from './pages/admin/IDManagement'
import ServicesManagement from './pages/admin/ServicesManagement'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* ============================================ */}
          {/* PUBLIC ROUTES - Always accessible */}
          {/* ============================================ */}
          
          {/* Landing Page - Always accessible */}
          <Route path="/" element={<LandingPage />} />
          
          {/* ============================================ */}
          {/* AUTH ROUTES - Only accessible when NOT logged in */}
          {/* ============================================ */}
          
          <Route path="/auth/login" element={
            <PublicRoute>
              <UserLogin />
            </PublicRoute>
          } />
          
          <Route path="/auth/register" element={
            <PublicRoute>
              <UserRegister />
            </PublicRoute>
          } />
          
          <Route path="/auth/admin-login" element={
            <PublicRoute>
              <AdminLogin />
            </PublicRoute>
          } />
          
          {/* ============================================ */}
          {/* USER ROUTES - Protected, requires login */}
          {/* ============================================ */}
          
          <Route path="/user/*" element={
            <ProtectedRoute>
              <UserLayout>
                <Routes>
                  <Route path="dashboard" element={<UserDashboard />} />
                  <Route path="profile" element={<UserProfile />} />
                  <Route path="digital-id" element={<DigitalID />} />
                  <Route path="services" element={<Services />} />
                  <Route path="" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </UserLayout>
            </ProtectedRoute>
          } />
          
          {/* ============================================ */}
          {/* ADMIN ROUTES - Protected, requires admin login */}
          {/* ============================================ */}
          
          <Route path="/admin/*" element={
            <AdminRoute>
              <AdminLayout>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="residents" element={<ResidentManagement />} />
                  <Route path="digital-ids" element={<IDManagement />} />
                  <Route path="services" element={<ServicesManagement />} />
                  <Route path="" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </AdminLayout>
            </AdminRoute>
          } />
          
          {/* ============================================ */}
          {/* FALLBACK ROUTES */}
          {/* ============================================ */}
          
          {/* Catch all undefined routes and redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        {/* Session Indicator - Shows for authenticated users */}
        <SessionIndicator />
      </div>
    </Router>
  )
}

export default App
