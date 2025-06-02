import React from 'react'
import { Link } from 'react-router-dom'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] px-4 py-16">
        <div className="text-center max-w-5xl mx-auto">
          {/* Large logo in hero section with elegant styling */}
          <div className="mb-12">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 mb-8 border border-emerald-100 shadow-lg">
              <img 
                src="/src/assets/ebrgy-logo2.png" 
                alt="eBrgy Logo" 
                className="h-36 w-auto mx-auto"
              />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Barangay Aningway Digital ID System
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
            Modernizing resident identification and streamlining barangay transactions 
            through a secure digital ID platform for enhanced efficiency and convenience.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link 
              to="/user/register"
              className="bg-emerald-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-emerald-500/25"
            >
              Get Your Digital ID
            </Link>
            <Link 
              to="/user/login"
              className="bg-white border-2 border-emerald-600 text-emerald-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-emerald-600 hover:text-white transition-all duration-300 shadow-lg"
            >
              Resident Login
            </Link>
          </div>
        </div>

        {/* Features Section with enhanced design */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-2xl border border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-4 0v2m0 0h4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Secure Digital ID</h3>
            <p className="text-gray-600 text-center text-lg leading-relaxed">
              Unique, secure digital identification for all barangay residents with advanced encryption
            </p>
          </div>

          <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-8 rounded-2xl border border-teal-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Streamlined Services</h3>
            <p className="text-gray-600 text-center text-lg leading-relaxed">
              Easy access to clearances, health records, and financial aid with just a few clicks
            </p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-2xl border border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Fast & Efficient</h3>
            <p className="text-gray-600 text-center text-lg leading-relaxed">
              Reduced paperwork and improved accessibility for all residents with 24/7 availability
            </p>
          </div>
        </div>

        {/* Additional CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-2xl p-8 border border-emerald-200 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
            <p className="text-gray-600 mb-6">Join thousands of residents already using eBrgy Digital ID System</p>
            <Link 
              to="/user/register"
              className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Register Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage