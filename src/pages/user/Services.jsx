import React, { useState } from 'react'
import { 
  FaFileAlt, FaCertificate, FaUserTie, FaHome, FaShieldAlt, FaHeartbeat,
  FaGraduationCap, FaBriefcase, FaHandsHelping, FaCamera, FaSearch,
  FaClock, FaCheckCircle, FaSpinner, FaEye, FaDownload, FaCalendarAlt,
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaFilter, FaSort, FaStar,
  FaArrowRight, FaInfoCircle, FaExclamationTriangle, FaTimes
} from 'react-icons/fa'

const Services = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [selectedService, setSelectedService] = useState(null)
  const [showRequestModal, setShowRequestModal] = useState(false)

  // Color utility function for dynamic classes
  const getColorClasses = (color) => {
    const colorMap = {
      emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' },
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
      red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200' },
      gray: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
      green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' }
    }
    return colorMap[color] || colorMap.gray
  }

  const categories = [
    { id: 'all', name: 'All Services', icon: FaFileAlt },
    { id: 'certificates', name: 'Certificates', icon: FaCertificate },
    { id: 'permits', name: 'Permits', icon: FaShieldAlt },
    { id: 'clearances', name: 'Clearances', icon: FaUserTie },
    { id: 'health', name: 'Health Services', icon: FaHeartbeat },
    { id: 'social', name: 'Social Services', icon: FaHandsHelping }
  ]

  const services = [
    {
      id: 1,
      name: 'Barangay Clearance',
      category: 'clearances',
      description: 'Official clearance certificate for various purposes including employment and business applications.',
      requirements: ['Valid ID', 'Barangay ID', 'Recent Photo', 'Residency Proof'],
      processingTime: '1-2 business days',
      fee: '₱50.00',
      status: 'available',
      rating: 4.8,
      icon: FaCertificate,
      color: 'emerald',
      featured: true
    },
    {
      id: 2,
      name: 'Certificate of Residency',
      category: 'certificates',
      description: 'Proof of residence certificate required for school enrollment, job applications, and government transactions.',
      requirements: ['Valid ID', 'Utility Bill', 'Barangay ID', 'Application Form'],
      processingTime: '1 business day',
      fee: '₱30.00',
      status: 'available',
      rating: 4.9,
      icon: FaHome,
      color: 'blue'
    },
    {
      id: 3,
      name: 'Business Permit',
      category: 'permits',
      description: 'Required permit for starting and operating small businesses within the barangay jurisdiction.',
      requirements: ['Business Plan', 'Valid ID', 'Lease Contract', 'Fire Safety Certificate'],
      processingTime: '3-5 business days',
      fee: '₱200.00',
      status: 'available',
      rating: 4.6,
      icon: FaBriefcase,
      color: 'purple'
    },
    {
      id: 4,
      name: 'Health Certificate',
      category: 'health',
      description: 'Medical certificate issued after health examination for employment or travel purposes.',
      requirements: ['Valid ID', 'Medical Examination', 'Recent Photo', 'Health Declaration'],
      processingTime: '2-3 business days',
      fee: '₱100.00',
      status: 'available',
      rating: 4.7,
      icon: FaHeartbeat,
      color: 'red'
    },
    {
      id: 5,
      name: 'Indigency Certificate',
      category: 'certificates',
      description: 'Certificate of indigency for educational scholarships, medical assistance, and social services.',
      requirements: ['Valid ID', 'Income Statement', 'Family Composition', 'Barangay ID'],
      processingTime: '1-2 business days',
      fee: 'Free',
      status: 'available',
      rating: 4.9,
      icon: FaHandsHelping,
      color: 'yellow'
    },
    {
      id: 6,
      name: 'Senior Citizen ID',
      category: 'social',
      description: 'Special identification for senior citizens to access discounts and benefits.',
      requirements: ['Birth Certificate', 'Valid ID', 'Recent Photo', 'Medical Certificate'],
      processingTime: '2-3 business days',
      fee: 'Free',
      status: 'available',
      rating: 4.8,
      icon: FaUserTie,
      color: 'gray'
    },
    {
      id: 7,
      name: 'Construction Permit',
      category: 'permits',
      description: 'Building permit for residential construction and home improvements.',
      requirements: ['Building Plans', 'Lot Title', 'Engineer Certification', 'Environmental Compliance'],
      processingTime: '7-10 business days',
      fee: '₱500.00',
      status: 'limited',
      rating: 4.5,
      icon: FaHome,
      color: 'orange'
    },
    {
      id: 8,
      name: 'Good Moral Certificate',
      category: 'certificates',
      description: 'Character certificate for students, job applicants, and other legal purposes.',
      requirements: ['Valid ID', 'School/Work Records', 'Character References', 'Application Form'],
      processingTime: '2-3 business days',
      fee: '₱40.00',
      status: 'available',
      rating: 4.8,
      icon: FaGraduationCap,
      color: 'green'
    }
  ]

  const myRequests = [
    { id: 'REQ-001', service: 'Barangay Clearance', status: 'processing', date: '2024-03-15', estimatedCompletion: '2024-03-17' },
    { id: 'REQ-002', service: 'Certificate of Residency', status: 'ready', date: '2024-03-14', estimatedCompletion: '2024-03-15' },
    { id: 'REQ-003', service: 'Health Certificate', status: 'completed', date: '2024-03-10', estimatedCompletion: '2024-03-13' }
  ]

  const filteredServices = services.filter(service => {
    const matchesCategory = activeCategory === 'all' || service.category === activeCategory
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const sortedServices = [...filteredServices].sort((a, b) => {
    switch(sortBy) {
      case 'name': return a.name.localeCompare(b.name)
      case 'rating': return b.rating - a.rating
      case 'fee': return a.fee === 'Free' ? -1 : b.fee === 'Free' ? 1 : 
                        parseFloat(a.fee.replace('₱', '')) - parseFloat(b.fee.replace('₱', ''))
      default: return 0
    }
  })

  const getStatusColor = (status) => {
    switch(status) {
      case 'available': return 'text-green-600 bg-green-100'
      case 'limited': return 'text-yellow-600 bg-yellow-100'
      case 'unavailable': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getRequestStatusColor = (status) => {
    switch(status) {
      case 'processing': return 'text-blue-600 bg-blue-100'
      case 'ready': return 'text-green-600 bg-green-100'
      case 'completed': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }
  const ServiceRequestModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${getColorClasses(selectedService?.color).bg} rounded-lg flex items-center justify-center`}>
              {selectedService && <selectedService.icon className={`w-5 h-5 ${getColorClasses(selectedService.color).text}`} />}
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Request Service</h3>
          </div>
          <button 
            onClick={() => setShowRequestModal(false)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white transition-all duration-300"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          {selectedService && (
            <div className="space-y-6">
              <div className="flex items-start space-x-4">              <div className={`w-12 h-12 ${getColorClasses(selectedService.color).bg} rounded-xl flex items-center justify-center`}>
                  <selectedService.icon className={`w-6 h-6 ${getColorClasses(selectedService.color).text}`} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{selectedService.name}</h4>
                  <p className="text-gray-600">{selectedService.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Requirements</h5>
                  <ul className="space-y-2">
                    {selectedService.requirements.map((req, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <FaCheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Processing Time</label>
                    <p className="text-gray-900">{selectedService.processingTime}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fee</label>
                    <p className="text-gray-900 font-semibold">{selectedService.fee}</p>
                  </div>
                </div>
              </div>              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Purpose of Request</label>
                  <textarea 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 resize-none"
                    rows="4"
                    placeholder="Please specify the purpose of this request (e.g., employment, school enrollment, business application)..."
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Schedule</label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                    <input 
                      type="tel" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                      placeholder="09XX XXX XXXX"
                    />
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <FaExclamationTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="font-medium text-yellow-800 mb-1">Important Notice</h5>
                      <p className="text-yellow-700 text-sm">
                        Please ensure all required documents are ready before submitting your request. 
                        Processing will begin only when all requirements are complete.
                      </p>
                    </div>
                  </div>
                </div>
              </div>              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  <FaInfoCircle className="w-4 h-4 inline mr-1" />
                  Processing time: <span className="font-medium">{selectedService?.processingTime}</span>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setShowRequestModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2">
                    <span>Submit Request</span>
                    <FaArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6 animate-fade-in">      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Barangay Services</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Request certificates, permits, and other barangay services online with our streamlined digital platform. 
          Fast, secure, and convenient service delivery at your fingertips.
        </p>
        <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center">
            <FaCheckCircle className="w-4 h-4 text-green-500 mr-2" />
            <span>100% Digital Processing</span>
          </div>
          <div className="flex items-center">
            <FaClock className="w-4 h-4 text-blue-500 mr-2" />
            <span>Quick Turnaround</span>
          </div>
          <div className="flex items-center">
            <FaShieldAlt className="w-4 h-4 text-purple-500 mr-2" />
            <span>Secure & Reliable</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <FaFileAlt className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{services.length}</h3>
              <p className="text-gray-600 text-sm">Available Services</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FaSpinner className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">2</h3>
              <p className="text-gray-600 text-sm">Pending Requests</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FaCheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">5</h3>
              <p className="text-gray-600 text-sm">Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <FaClock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">1-3</h3>
              <p className="text-gray-600 text-sm">Days Average</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Search */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Search Services</h3>
            <div className="relative mb-4">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <FaSort className="w-4 h-4 text-gray-400" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
              >
                <option value="name">Sort by Name</option>
                <option value="rating">Sort by Rating</option>
                <option value="fee">Sort by Fee</option>
              </select>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => {
                const IconComponent = category.icon
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                      activeCategory === category.id
                        ? 'bg-emerald-100 text-emerald-700 shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm font-medium">{category.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* My Requests */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">My Recent Requests</h3>
            <div className="space-y-3">
              {myRequests.map((request) => (
                <div key={request.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{request.id}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRequestStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{request.service}</p>
                  <p className="text-xs text-gray-500">Submitted: {request.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          
          {/* Featured Services */}
          {activeCategory === 'all' && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Featured Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.filter(service => service.featured).map((service) => (                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border-2 border-emerald-100 hover:border-emerald-200 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 ${getColorClasses(service.color).bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <service.icon className={`w-6 h-6 ${getColorClasses(service.color).text}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{service.name}</h3>
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center">
                            <FaStar className="w-3 h-3 mr-1" />
                            {service.rating}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-emerald-700 text-lg">{service.fee}</span>
                          <button 
                            onClick={() => {
                              setSelectedService(service)
                              setShowRequestModal(true)
                            }}
                            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                          >
                            <span>Request Now</span>
                            <FaArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Services */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {activeCategory === 'all' ? 'All Services' : categories.find(c => c.id === activeCategory)?.name}
              </h2>
              <span className="text-gray-500 text-sm">{sortedServices.length} services found</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedServices.map((service, index) => (                <div 
                  key={service.id} 
                  className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-slide-up group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className={`w-12 h-12 ${getColorClasses(service.color).bg} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <service.icon className={`w-6 h-6 ${getColorClasses(service.color).text}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors duration-300">{service.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                            {service.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <FaStar 
                                key={i} 
                                className={`w-3 h-3 transition-colors duration-300 ${i < Math.floor(service.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">({service.rating})</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 group-hover:text-gray-700 transition-colors duration-300">{service.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 flex items-center">
                          <FaClock className="w-3 h-3 mr-1" />
                          Processing Time:
                        </span>
                        <span className="text-gray-900 font-medium">{service.processingTime}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Fee:</span>
                        <span className={`font-semibold ${service.fee === 'Free' ? 'text-green-600' : 'text-gray-900'}`}>
                          {service.fee}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedService(service)
                          setShowRequestModal(true)
                        }}
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 text-sm font-medium shadow-lg hover:shadow-xl"
                      >
                        Request Service
                      </button>
                      <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 text-gray-600 hover:text-gray-800">
                        <FaInfoCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <FaInfoCircle className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Need Help?</h4>
            <p className="text-blue-700 text-sm mb-4">
              For assistance with service requests or general inquiries, please contact the barangay office during office hours.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center text-blue-700">
                <FaPhone className="w-4 h-4 mr-2" />
                <span>(02) 8123-4567</span>
              </div>
              <div className="flex items-center text-blue-700">
                <FaEnvelope className="w-4 h-4 mr-2" />
                <span>services@ebrgy.gov.ph</span>
              </div>
              <div className="flex items-center text-blue-700">
                <FaClock className="w-4 h-4 mr-2" />
                <span>Mon-Fri 8:00 AM - 5:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Request Modal */}
      {showRequestModal && <ServiceRequestModal />}
    </div>
  )
}

export default Services
