import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaHome, FaIdCard, FaClipboardList, FaUser, FaBell, FaSignOutAlt } from 'react-icons/fa'

const UserLayout = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const navigation = [
    { name: 'Dashboard', href: '/user/dashboard', icon: FaHome },
    { name: 'Digital ID', href: '/user/digital-id', icon: FaIdCard },
    { name: 'Services', href: '/user/services', icon: FaClipboardList },
    { name: 'Profile', href: '/user/profile', icon: FaUser },
  ]
  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate('/')
  }
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden lg:flex">
        <div className="flex flex-col w-64 bg-gradient-to-b from-slate-50 to-white shadow-2xl border-r border-gray-100">
              {/* Logo */}
            <div className="flex items-center justify-center h-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="flex items-center space-x-3 relative z-10 animate-fade-in">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 transform transition-all duration-300 hover:scale-105">
                  <img 
                    src="/src/assets/ebrgy-logo.jpeg" 
                    alt="eBrgy Logo" 
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-lg tracking-wide">eBrgy</span>
                  <span className="text-emerald-100 text-xs font-medium">Digital ID System</span>
                </div>
              </div>
            </div>            {/* Navigation */}
            <nav className="flex-1 px-6 py-8 space-y-3">
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-3 animate-fade-in">Navigation</h3>
              </div>
              {navigation.map((item, index) => {
                const IconComponent = item.icon
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-300 ease-out relative transform hover:scale-[1.02] active:scale-[0.98] animate-slide-in ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 shadow-lg border border-emerald-100 scale-[1.02]'
                        : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 hover:text-gray-900 hover:shadow-md'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-r-full animate-expand-width"></div>
                    )}
                    <div className={`flex items-center justify-center w-9 h-9 rounded-lg mr-3 transition-all duration-300 transform ${
                      isActive 
                        ? 'bg-emerald-100 text-emerald-600 rotate-[5deg] scale-110' 
                        : 'text-gray-500 group-hover:bg-gray-100 group-hover:text-gray-700 group-hover:rotate-[5deg] group-hover:scale-105'
                    }`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="font-medium transition-all duration-300">{item.name}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full animate-pulse-scale"></div>
                    )}
                    
                    {/* Ripple effect on click */}
                    <div className="absolute inset-0 rounded-xl bg-emerald-200/20 scale-0 group-active:scale-100 transition-transform duration-200 ease-out"></div>
                  </Link>
                )
              })}
            </nav>            {/* User Info & Logout */}
            <div className="p-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-slate-50">
              <div className="flex items-center mb-4 p-3 bg-white rounded-xl shadow-sm border border-gray-100 transform transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center border border-emerald-200 transition-all duration-300 hover:rotate-[5deg] hover:scale-110">
                  <span className="text-emerald-700 font-bold text-lg">JD</span>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-semibold text-gray-900">Juan Dela Cruz</p>
                  <p className="text-xs text-gray-500 flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                    Verified Resident
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 border border-transparent hover:border-red-100 hover:shadow-md group transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg mr-3 group-hover:bg-red-100 transition-all duration-300 group-hover:rotate-[10deg]">
                  <FaSignOutAlt className="w-4 h-4" />
                </div>
                <span>Logout</span>
                
                {/* Logout button ripple effect */}
                <div className="absolute inset-0 rounded-xl bg-red-200/20 scale-0 group-active:scale-100 transition-transform duration-200 ease-out"></div>
              </button>
            </div>        </div>
      </div>      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden pb-20 lg:pb-0">        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100/50 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <div className="animate-fade-in">
                <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, Juan!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <button className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-300 relative transform hover:scale-110 active:scale-95">
                  <FaBell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                </button>
              </div>
              
              <div className="hidden sm:flex items-center space-x-3 pl-3 border-l border-gray-200 animate-fade-in">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Juan Dela Cruz</p>
                  <p className="text-xs text-gray-500">Resident ID: 2024-001</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center border border-emerald-200 transition-all duration-300 hover:scale-110 hover:rotate-[5deg]">
                  <span className="text-emerald-700 font-semibold text-sm">JD</span>
                </div>
              </div>
            </div>
          </div>
        </header>        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation - Only visible on mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 animate-slide-up">
        <div className="bg-white/95 backdrop-blur-lg border-t border-gray-100/50 shadow-2xl">
          <div className="flex justify-around items-center py-2 px-4">
            {navigation.map((item, index) => {
              const IconComponent = item.icon
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-300 ease-out transform relative group ${
                    isActive 
                      ? 'text-emerald-600 scale-105' 
                      : 'text-gray-500 hover:text-emerald-600 active:scale-95'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Background indicator for active state */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 shadow-lg animate-fade-in"></div>
                  )}
                  
                  {/* Icon container */}
                  <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 transform ${
                    isActive 
                      ? 'bg-emerald-100 text-emerald-600 animate-bounce-gentle' 
                      : 'group-hover:bg-gray-100 group-hover:scale-110 group-active:scale-95'
                  }`}>
                    <IconComponent className={`transition-all duration-300 ${
                      isActive ? 'w-5 h-5' : 'w-4 h-4 group-hover:w-5 group-hover:h-5'
                    }`} />
                    
                    {/* Active indicator dot */}
                    {isActive && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-notification-pulse"></div>
                    )}
                  </div>
                  
                  {/* Label */}
                  <span className={`relative z-10 text-xs font-medium mt-1 transition-all duration-300 ${
                    isActive 
                      ? 'text-emerald-700 font-semibold' 
                      : 'text-gray-600 group-hover:text-emerald-600'
                  }`}>
                    {item.name}
                  </span>
                  
                  {/* Ripple effect */}
                  <div className="absolute inset-0 rounded-xl bg-emerald-200/30 scale-0 group-active:scale-100 transition-transform duration-200 ease-out"></div>
                </Link>
              )
            })}
            
            {/* Notification/Profile button */}
            <button className="flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-300 ease-out transform text-gray-500 hover:text-emerald-600 active:scale-95 group relative">
              <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 transform group-hover:bg-gray-100 group-hover:scale-110 group-active:scale-95">
                <FaBell className="w-4 h-4 group-hover:w-5 group-hover:h-5 transition-all duration-300" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
              </div>
              <span className="relative z-10 text-xs font-medium mt-1 transition-all duration-300 text-gray-600 group-hover:text-emerald-600">
                Alerts
              </span>
              <div className="absolute inset-0 rounded-xl bg-emerald-200/30 scale-0 group-active:scale-100 transition-transform duration-200 ease-out"></div>
            </button>
          </div>
          
          {/* Bottom safe area for devices with home indicator */}
          <div className="h-safe-area-inset-bottom bg-white/95"></div>
        </div>
      </div>
    </div>
  )
}

export default UserLayout
