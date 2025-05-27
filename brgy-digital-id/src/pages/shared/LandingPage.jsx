import React from 'react'
import { Link } from 'react-router-dom'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">B</span>
              </div>
              <span className="text-white font-semibold text-lg">Barangay Aningway</span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                to="/user/login" 
                className="text-white hover:text-blue-200 transition-colors"
              >
                Resident Login
              </Link>
              <Link 
                to="/admin/login" 
                className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Barangay Aningway
            <span className="block text-blue-200">Digital ID System</span>
          </h1>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Modernizing resident identification and streamlining barangay transactions 
            through a secure digital ID platform for enhanced efficiency and convenience.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/user/register"
              className="bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Get Your Digital ID
            </Link>
            <Link 
              to="/user/login"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-700 transition-all duration-200"
            >
              Resident Login
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-4 0v2m0 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 text-center">Secure Digital ID</h3>
            <p className="text-blue-100 text-center">
              Unique, secure digital identification for all barangay residents
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 text-center">Streamlined Services</h3>
            <p className="text-blue-100 text-center">
              Easy access to clearances, health records, and financial aid
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 text-center">Fast & Efficient</h3>
            <p className="text-blue-100 text-center">
              Reduced paperwork and improved accessibility for all residents
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
