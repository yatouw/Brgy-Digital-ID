import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const UserLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const navigation = [
    { name: 'Dashboard', href: '/user/dashboard', icon: '🏠' },
    { name: 'Digital ID', href: '/user/digital-id', icon: '🆔' },
    { name: 'Services', href: '/user/services', icon: '📋' },
    { name: 'Profile', href: '/user/profile', icon: '👤' },
  ]

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate('/')
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'block' : 'hidden'} fixed inset-0 z-40 lg:static lg:block lg:inset-auto lg:z-auto`}>
        <div className="flex h-full">
          <div className="flex flex-col w-64 bg-white shadow-lg">
            {/* Logo */}
            <div className="flex items-center justify-center h-16 bg-blue-600">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">B</span>
                </div>
                <span className="text-white font-semibold">Barangay Digital ID</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === item.href
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* User Info & Logout */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">JD</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Juan Dela Cruz</p>
                  <p className="text-xs text-gray-500">Resident</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <span className="mr-2">🚪</span>
                Logout
              </button>
            </div>
          </div>
          
          {/* Overlay for mobile */}
          <div 
            className="flex-1 lg:hidden bg-black bg-opacity-25"
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="text-xl">☰</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-2 text-gray-400 hover:text-gray-500">
                  <span className="text-xl">🔔</span>
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default UserLayout
