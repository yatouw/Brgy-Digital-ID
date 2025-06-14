import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const LandingPage = () => {
  const [currentStat, setCurrentStat] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const stats = [
    { number: '5,000+', label: 'Registered Residents', color: 'emerald' },
    { number: '15,000+', label: 'Services Processed', color: 'teal' },
    { number: '99.8%', label: 'Satisfaction Rate', color: 'blue' },
    { number: '24/7', label: 'System Availability', color: 'purple' }
  ]

  const testimonials = [
    {
      name: 'Maria Santos',
      role: 'Local Business Owner',
      text: 'Getting my business permits has never been easier! The digital system saved me hours of paperwork.',
      rating: 5
    },
    {
      name: 'Juan Dela Cruz',
      role: 'Senior Citizen',
      text: 'As a senior, I appreciate how simple and accessible the system is. No more long queues!',
      rating: 5
    },
    {
      name: 'Ana Rodriguez',
      role: 'Working Mother',
      text: 'I can now request certificates for my children\'s school enrollment from home. Amazing!',
      rating: 5
    }
  ]

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(testimonialInterval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/50 overflow-hidden">
      {/* Floating Elements Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] px-4 py-16">
        <div className={`text-center max-w-5xl mx-auto transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          {/* Animated logo */}
          <div className="mb-12">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 mb-8 border border-emerald-100 shadow-2xl hover:shadow-emerald-500/25 transition-all duration-500 transform hover:scale-105 hover:rotate-1">
              <img 
                src="/src/assets/ebrgy-logo2.png" 
                alt="eBrgy Logo" 
                className="h-36 w-auto mx-auto animate-pulse-slow"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12 animate-shimmer"></div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent mb-6 leading-tight animate-fade-in-up">
            Barangay Aningway Digital ID System
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto animate-fade-in-up animation-delay-300">
            Modernizing resident identification and streamlining barangay transactions 
            through a <span className="text-emerald-600 font-semibold">secure digital ID platform</span> for enhanced efficiency and convenience.
          </p>
          
          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-fade-in-up animation-delay-600">
            <Link 
              to="/auth/register"
              className="group relative bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-emerald-500/50 overflow-hidden"
            >
              <span className="relative z-10">Get Your Digital ID</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </Link>
            <Link 
              to="/auth/login"
              className="group bg-white/80 backdrop-blur-sm border-2 border-emerald-600 text-emerald-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-emerald-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <span>Resident Login</span>
            </Link>
          </div>

          {/* Dynamic Statistics */}
         
        </div>        
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
          <div className="group bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-2xl border border-emerald-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-105 animate-slide-up">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-4 0v2m0 0h4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center group-hover:text-emerald-700 transition-colors duration-300">Secure Digital ID</h3>
            <p className="text-gray-600 text-center text-lg leading-relaxed">
              Unique, secure digital identification for all barangay residents with <span className="font-semibold text-emerald-600">advanced encryption</span>
            </p>
          </div>

          <div className="group bg-gradient-to-br from-teal-50 to-teal-100 p-8 rounded-2xl border border-teal-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-105 animate-slide-up animation-delay-200">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center group-hover:text-teal-700 transition-colors duration-300">Streamlined Services</h3>
            <p className="text-gray-600 text-center text-lg leading-relaxed">
              Easy access to clearances, health records, and financial aid with <span className="font-semibold text-teal-600">just a few clicks</span>
            </p>
          </div>

          <div className="group bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-105 animate-slide-up animation-delay-400">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center group-hover:text-blue-700 transition-colors duration-300">Fast & Efficient</h3>
            <p className="text-gray-600 text-center text-lg leading-relaxed">
              Reduced paperwork and improved accessibility for all residents with <span className="font-semibold text-blue-600">24/7 availability</span>
            </p>
          </div>
        </div>

        {/* Interactive Process Timeline */}
        <div className="mb-20 max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-emerald-400 to-teal-400 rounded-full"></div>
            
            <div className="space-y-12">
              {[
                {
                  step: 1,
                  title: 'Register Online',
                  description: 'Fill out your information and upload required documents',
                  icon: '📝',
                  color: 'emerald'
                },
                {
                  step: 2,
                  title: 'Verification Process',
                  description: 'Our team verifies your documents and identity',
                  icon: '✅',
                  color: 'teal'
                },
                {
                  step: 3,
                  title: 'Get Your Digital ID',
                  description: 'Access your secure digital ID and start using services',
                  icon: '🆔',
                  color: 'blue'
                }
              ].map((item, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'} animate-slide-in-${index % 2 === 0 ? 'left' : 'right'}`}>
                    <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                      <div className="text-4xl mb-4">{item.icon}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Step {item.step}: {item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  <div className={`absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-${item.color}-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold`}>
                    {item.step}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

           {/* Enhanced CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 rounded-3xl p-12 shadow-2xl max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Join the Digital Revolution?</h3>
              <p className="text-emerald-100 mb-8 text-lg max-w-2xl mx-auto">
                Join thousands of residents already experiencing the convenience and efficiency of our digital ID system. 
                Your journey to simplified barangay services starts here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/auth/register"
                  className="inline-block bg-white text-emerald-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Get Started Today
                </Link>
                <Link 
                  to="/auth/login"
                  className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-emerald-600 transition-all duration-300"
                >
                  Already Registered?
                </Link>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full animate-bounce"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Footer with additional info */}
      <div className="relative bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
           
            <div>
              <h4 className="font-bold text-lg mb-4 text-emerald-400">Services</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Digital ID Cards</li>
                <li>Barangay Clearance</li>
                <li>Health Certificates</li>
                <li>Business Permits</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-emerald-400">Contact Info</h4>
              <ul className="space-y-2 text-gray-300">
                <li>📍 Barangay Aningway</li>
                <li>📞 (02) 8123-4567</li>
                <li>✉️ info@ebrgy.gov.ph</li>
                <li>🕒 Mon-Fri 8AM-5PM</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-emerald-400">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-700 transition-colors">
                  <span className="text-sm">f</span>
                </a>
                <a href="#" className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-700 transition-colors">
                  <span className="text-sm">t</span>
                </a>
                <a href="#" className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-700 transition-colors">
                  <span className="text-sm">@</span>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Barangay Aningway Digital ID System. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage