import React, { useState, useEffect } from 'react'
import { 
  FaUser, FaEdit, FaSave, FaTimes, FaCamera, FaLock, FaBell, 
  FaShieldAlt, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendar,
  FaEye, FaEyeSlash, FaCheck, FaExclamationTriangle, FaHistory,
  FaDownload, FaCog, FaKey, FaUserCircle, FaHome, FaHeart
} from 'react-icons/fa'
import { useAuth } from '../../contexts/AuthContext'
import { residentService, userInfoService } from '../../api/appwrite/appwrite'

const UserProfile = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('personal')
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    // Basic info from residents collection (read-only from registration)
    firstName: '',
    middleName: '', 
    lastName: '',
    email: '',
    birthDate: '',
    // Additional info from user_info collection (editable)
    gender: '', // Moved to user_info collection
    suffix: '',
    phone: '',
    civilStatus: '',
    bloodType: '',
    occupation: '',
    streetAddress: '',
    barangay: 'Delpilar', // Fixed default value - not editable
    city: 'Castillejos, Zambales', // Default value
    zipCode: '2208', // Default value
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: ''
  })

  // Check if user just registered and needs to complete profile
  const isNewUser = user?.resident && !user.resident.streetAddress

  // Check if profile is complete and can generate ID
  const isProfileComplete = () => {
    const requiredFields = [
      'firstName', 'lastName', 'birthDate', 'gender', 'civilStatus', 
      'bloodType', 'phone', 'streetAddress',
      'emergencyContactName', 'emergencyContactPhone', 'emergencyContactRelation'
    ]
    
    return requiredFields.every(field => {
      const value = formData[field]
      return value && value.toString().trim() !== ''
    }) && formData.barangay === 'Delpilar' && formData.city === 'Castillejos, Zambales' && formData.zipCode === '2208' // Fixed location fields are always complete
  }

  // Helper function to check if a field is filled
  const isFieldComplete = (fieldName) => {
    const value = formData[fieldName]
    return value && value.toString().trim() !== ''
  }

  // Helper function to get indicator icon
  const getFieldIndicator = (fieldName, isRequired = true) => {
    if (!isRequired) return null
    
    const isComplete = isFieldComplete(fieldName)
    
    if (isComplete) {
      return <FaCheck className="w-4 h-4 text-green-500 ml-1" />
    } else {
      return <div className="w-2 h-2 bg-red-500 rounded-full ml-1 animate-pulse"></div>
    }
  }

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    const requiredFields = [
      'gender', 'civilStatus', 'bloodType', 'streetAddress',
      'emergencyContactName', 'emergencyContactPhone', 'emergencyContactRelation'
    ]
    
    const completedFields = requiredFields.filter(field => isFieldComplete(field)).length
    return Math.round((completedFields / requiredFields.length) * 100)
  }

  // Check if user has already completed profile (disable editing after completion)
  const [hasCompletedProfile, setHasCompletedProfile] = useState(false)

  // Initialize form data from user context and user_info collection
  useEffect(() => {
    const loadUserData = async () => {
      if (user && user.resident) {
        try {
          setLoading(true)
          
          const resident = user.resident
          
          // Load basic info from residents collection
          const basicData = {
            firstName: resident.firstName || '',
            middleName: resident.middleName || '',
            lastName: resident.lastName || '',
            email: resident.email || user.email || '',
            birthDate: resident.birthDate || '',
            gender: '' // Will be loaded from user_info collection instead
          }
          
          // Load additional info from user_info collection
          const userInfo = await userInfoService.getUserInfoByUserId(user.id)
          
          const additionalData = userInfo ? {
            suffix: userInfo.suffix || '',
            phone: resident.phone || '', // Get phone from residents collection only
            gender: userInfo.gender || '', // Get gender from user_info
            civilStatus: userInfo.civilStatus || '',
            bloodType: userInfo.bloodType || '',
            occupation: userInfo.occupation || '',
            streetAddress: userInfo.address || '', // Match your collection field name
            barangay: 'Delpilar', // Always set to Delpilar - not editable
            city: userInfo.city || 'Castillejos, Zambales', // Default value if not set
            zipCode: userInfo.zipCode || '2208', // Default value if not set
            emergencyContactName: userInfo.emergencyContactName || '',
            emergencyContactPhone: userInfo.emergencyContactPhone || '',
            emergencyContactRelation: userInfo.emergencyContactRelation || ''
          } : {
            suffix: '',
            phone: resident.phone || '', // Get phone from residents collection only
            gender: '', // Will be filled when user completes profile
            civilStatus: '',
            bloodType: '',
            occupation: '',
            streetAddress: '',
            barangay: 'Delpilar', // Always default to Delpilar for new users
            city: 'Castillejos, Zambales', // Default value for new users
            zipCode: '2208', // Default value for new users
            emergencyContactName: '',
            emergencyContactPhone: '',
            emergencyContactRelation: ''
          }
          
          setFormData({ ...basicData, ...additionalData })
          
          // If new user (no user_info record), automatically enable editing
          if (!userInfo) {
            setIsEditing(true)
            setHasCompletedProfile(false)
          } else {
            // Check if this is the first time completing profile
            const profileWasComplete = userInfo.address && userInfo.gender && userInfo.civilStatus && userInfo.bloodType
            setHasCompletedProfile(profileWasComplete)
          }
        } catch (error) {
          console.error('Error loading user data:', error)
          setError('Failed to load profile data.')
        } finally {
          setLoading(false)
        }
      }
    }
    
    if (user) {
      loadUserData()
    }
  }, [user])

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    serviceUpdates: true,
    systemAlerts: true
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: FaUser },
    { id: 'security', label: 'Security', icon: FaShieldAlt },
    { id: 'notifications', label: 'Notifications', icon: FaBell },
    { id: 'activity', label: 'Activity', icon: FaHistory }
  ]

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleNotificationChange = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] })
  }

  const handleSave = async () => {
    setLoading(true)
    setError('')
    setSaveSuccess(false)
    
    try {
      if (user && user.resident && user.resident.$id) {
        // Prepare data for user_info collection (additional profile data)
        const userInfoData = {
          suffix: formData.suffix,
          gender: formData.gender, // Add gender to user_info
          civilStatus: formData.civilStatus,
          bloodType: formData.bloodType,
          occupation: formData.occupation,
          address: formData.streetAddress, // Match your collection field name
          barangay: 'Delpilar', // Always save as Delpilar
          city: formData.city,
          zipCode: formData.zipCode,
          emergencyContactName: formData.emergencyContactName,
          emergencyContactPhone: formData.emergencyContactPhone,
          emergencyContactRelation: formData.emergencyContactRelation
        }
        
        // Update phone number in residents collection if changed
        if (formData.phone !== user.resident.phone) {
          await residentService.updateResident(user.resident.$id, {
            phone: formData.phone
          })
        }
        
        // Create or update user_info record
        await userInfoService.upsertUserInfo(user.id, userInfoData)
        
        // Mark profile as completed (disable further editing)
        if (isProfileComplete()) {
          setHasCompletedProfile(true)
        }
        
        setSaveSuccess(true)
        setIsEditing(false)
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false)
        }, 3000)
      } else {
        setError('Unable to save profile. Please try logging in again.')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      
      // More specific error messages
      if (error.message.includes('Unknown attribute')) {
        setError('Database schema mismatch. Please contact administrator.')
      } else if (error.message.includes('unauthorized')) {
        setError('You are not authorized to perform this action. Please log in again.')
      } else {
        setError('Failed to save profile. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const recentActivities = [
    { action: 'Digital ID accessed', date: '2024-03-15 10:30 AM', type: 'view' },
    { action: 'Profile updated', date: '2024-03-14 2:15 PM', type: 'edit' },
    { action: 'Service request submitted', date: '2024-03-13 9:45 AM', type: 'service' },
    { action: 'Account login', date: '2024-03-13 8:20 AM', type: 'login' },
    { action: 'Digital ID downloaded', date: '2024-03-12 4:30 PM', type: 'download' }
  ]

  // Show loading state if user data is not yet loaded
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-600">
          {isNewUser 
            ? "Welcome! Please complete your profile information to access all barangay services."
            : "Manage your personal information and account preferences"
          }
        </p>
      </div>

      {/* New User Welcome Alert */}
      {isNewUser && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <FaUserCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-blue-900 font-bold text-lg mb-2">Complete Your Profile</h3>
              <p className="text-blue-700 mb-4">
                To access all barangay services and get your digital ID, please provide your complete address information and other details below.
              </p>
              <div className="flex items-center text-blue-600 text-sm">
                <FaCheck className="w-4 h-4 mr-2" />
                <span>Profile editing is already enabled for you</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face" 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover border-4 border-emerald-100 shadow-lg"
                  />
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white hover:bg-emerald-700 transition-all duration-300 transform hover:scale-110">
                    <FaCamera className="w-3 h-3" />
                  </button>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {formData.firstName} {formData.lastName}
                </h3>
                <p className="text-gray-500 text-sm mb-2">
                  ID: {user?.resident?.idNumber || 'EBRGY-PENDING'}
                </p>
                
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${
                    user?.resident?.isVerified ? 'bg-green-400' : 'bg-yellow-400'
                  }`}></div>
                  <span className={`text-sm font-medium ${
                    user?.resident?.isVerified ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {user?.resident?.isVerified ? 'Verified Resident' : 'Pending Verification'}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="w-3 h-3 mr-2 text-emerald-500" />
                    <span>{formData.barangay || 'Barangay not set'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaCalendar className="w-3 h-3 mr-2 text-emerald-500" />
                    <span>Member since {user?.resident?.registrationDate ? new Date(user.resident.registrationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'Unknown'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              
              {/* Tabs */}
              <div className="border-b border-gray-100">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 py-4 border-b-2 transition-all duration-300 ${
                          activeTab === tab.id
                            ? 'border-emerald-500 text-emerald-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                
                {/* Personal Information Tab */}
                {activeTab === 'personal' && (
                  <div className="space-y-6 animate-slide-up">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                      
                      {/* Show different buttons based on profile completion status */}
                      {hasCompletedProfile && !isEditing ? (
                        <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200">
                          <FaCheck className="w-4 h-4" />
                          <span>Profile Completed</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                          disabled={loading || (hasCompletedProfile && !isEditing)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                            isEditing
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Saving...</span>
                            </>
                          ) : isEditing ? (
                            <>
                              <FaSave className="w-4 h-4" />
                              <span>Save Changes</span>
                            </>
                          ) : (
                            <>
                              <FaEdit className="w-4 h-4" />
                              <span>Edit Profile</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Success/Error Messages */}
                    {saveSuccess && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 animate-fade-in">
                        <div className="flex items-center">
                          <FaCheck className="w-5 h-5 text-green-500 mr-3" />
                          <p className="text-green-700 font-medium">Profile updated successfully!</p>
                        </div>
                      </div>
                    )}

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-fade-in">
                        <div className="flex items-center">
                          <FaExclamationTriangle className="w-5 h-5 text-red-500 mr-3" />
                          <p className="text-red-700 font-medium">{error}</p>
                        </div>
                      </div>
                    )}

                    {/* Profile Completion Progress */}
                    <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl p-4 border border-blue-200 mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-gray-800">Profile Completion</h3>
                        <span className="text-sm font-bold text-emerald-600">{getCompletionPercentage()}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${getCompletionPercentage()}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        {getCompletionPercentage() === 100 
                          ? "🎉 Profile completed! You can now generate your Digital ID." 
                          : "Complete all required fields to unlock your Digital ID"}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Basic Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-800 flex items-center">
                          <FaUserCircle className="w-5 h-5 mr-2 text-emerald-600" />
                          Basic Information
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600">
                              {formData.firstName}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Set during registration</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600">
                              {formData.lastName}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Set during registration</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                            <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600">
                              {formData.middleName || 'Not provided'}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Set during registration</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Suffix</label>
                            <input
                              type="text"
                              name="suffix"
                              value={formData.suffix}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              placeholder="Jr., Sr., III"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                            <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600">
                              {formData.birthDate ? new Date(formData.birthDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              }) : 'Not provided'}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Set during registration</p>
                          </div>
                          <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                              Gender
                              {getFieldIndicator('gender')}
                            </label>
                            <select
                              name="gender"
                              value={formData.gender}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300 ${
                                isFieldComplete('gender') ? 'border-green-300 bg-green-50' : 'border-red-300'
                              }`}
                            >
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                              Civil Status
                              {getFieldIndicator('civilStatus')}
                            </label>
                            <select
                              name="civilStatus"
                              value={formData.civilStatus}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300 ${
                                isFieldComplete('civilStatus') ? 'border-green-300 bg-green-50' : 'border-red-300'
                              }`}
                            >
                              <option value="">Select Civil Status</option>
                              <option value="Single">Single</option>
                              <option value="Married">Married</option>
                              <option value="Divorced">Divorced</option>
                              <option value="Widowed">Widowed</option>
                            </select>
                          </div>
                          <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                              Blood Type
                              {getFieldIndicator('bloodType')}
                            </label>
                            <select
                              name="bloodType"
                              value={formData.bloodType}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300 ${
                                isFieldComplete('bloodType') ? 'border-green-300 bg-green-50' : 'border-red-300'
                              }`}
                            >
                              <option value="">Select Blood Type</option>
                              <option value="A+">A+</option>
                              <option value="A-">A-</option>
                              <option value="B+">B+</option>
                              <option value="B-">B-</option>
                              <option value="AB+">AB+</option>
                              <option value="AB-">AB-</option>
                              <option value="O+">O+</option>
                              <option value="O-">O-</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Contact & Address */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-800 flex items-center">
                          <FaHome className="w-5 h-5 mr-2 text-emerald-600" />
                          Contact & Address
                        </h3>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                          <div className="relative w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600">
                            <div className="flex items-center justify-between">
                              <span>{formData.email}</span>
                              {user?.emailVerification && (
                                <div className="flex items-center text-green-600">
                                  <FaCheck className="w-4 h-4 mr-1" />
                                  <span className="text-xs font-medium">Verified</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Set during registration</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                          <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600">
                            {formData.phone}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Set during registration</p>
                        </div>

                        <div>
                          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                            Street Address
                            {getFieldIndicator('streetAddress')}
                          </label>
                          <select
                            name="streetAddress"
                            value={formData.streetAddress}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300 ${
                              isFieldComplete('streetAddress') ? 'border-green-300 bg-green-50' : 'border-red-300'
                            }`}
                          >
                            <option value="">Select Purok</option>
                            <option value="Purok 1">Purok 1</option>
                            <option value="Purok 2">Purok 2</option>
                            <option value="Purok 3">Purok 3</option>
                            <option value="Purok 4">Purok 4</option>
                            <option value="Purok 5">Purok 5</option>
                            <option value="Purok 6">Purok 6</option>
                            <option value="Purok 7">Purok 7</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Barangay</label>
                            <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 font-medium">
                              Delpilar
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Fixed location for this system</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Town/Province</label>
                            <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 font-medium">
                              Castillejos, Zambales
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Fixed location for this system</p>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                          <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 font-medium">
                            2208
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Fixed ZIP code for this system</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                          <input
                            type="text"
                            name="occupation"
                            value={formData.occupation}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                        <FaHeart className="w-5 h-5 mr-2 text-red-500" />
                        Emergency Contact
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                            Full Name
                            {getFieldIndicator('emergencyContactName')}
                          </label>
                          <input
                            type="text"
                            name="emergencyContactName"
                            value={formData.emergencyContactName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300 ${
                              isFieldComplete('emergencyContactName') ? 'border-green-300 bg-green-50' : 'border-red-300'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                            {getFieldIndicator('emergencyContactPhone')}
                          </label>
                          <input
                            type="tel"
                            name="emergencyContactPhone"
                            value={formData.emergencyContactPhone}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300 ${
                              isFieldComplete('emergencyContactPhone') ? 'border-green-300 bg-green-50' : 'border-red-300'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                            Relationship
                            {getFieldIndicator('emergencyContactRelation')}
                          </label>
                          <select
                            name="emergencyContactRelation"
                            value={formData.emergencyContactRelation}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300 ${
                              isFieldComplete('emergencyContactRelation') ? 'border-green-300 bg-green-50' : 'border-red-300'
                            }`}
                          >
                            <option value="">Select Relationship</option>
                            <option value="Spouse">Spouse</option>
                            <option value="Parent">Parent</option>
                            <option value="Child">Child</option>
                            <option value="Sibling">Sibling</option>
                            <option value="Friend">Friend</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div className="space-y-6 animate-slide-up">
                    <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
                    
                    {/* Change Password */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                        <FaKey className="w-5 h-5 mr-2 text-emerald-600" />
                        Change Password
                      </h3>
                      
                      <div className="space-y-4 max-w-md">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                          <input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                          <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                          />
                        </div>
                        
                        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105">
                          Update Password
                        </button>
                      </div>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                      <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                        <FaShieldAlt className="w-5 h-5 mr-2 text-blue-600" />
                        Two-Factor Authentication
                      </h3>
                      <p className="text-gray-600 mb-4">Add an extra layer of security to your account</p>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                        Enable 2FA
                      </button>
                    </div>

                    {/* Login Sessions */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-medium text-gray-800 mb-4">Active Sessions</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                          <div>
                            <p className="font-medium text-gray-900">Current Session</p>
                            <p className="text-sm text-gray-600">Windows • Chrome • Philippines</p>
                          </div>
                          <div className="flex items-center text-green-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm">Active now</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6 animate-slide-up">
                    <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
                    
                    <div className="space-y-4">
                      {Object.entries(notifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300">
                          <div>
                            <h3 className="font-medium text-gray-900 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {key === 'emailNotifications' && 'Receive notifications via email'}
                              {key === 'smsNotifications' && 'Receive SMS alerts and updates'}
                              {key === 'pushNotifications' && 'Browser push notifications'}
                              {key === 'serviceUpdates' && 'Updates about barangay services'}
                              {key === 'systemAlerts' && 'Important system announcements'}
                            </p>
                          </div>
                          <button
                            onClick={() => handleNotificationChange(key)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                              value ? 'bg-emerald-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                                value ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Activity Tab */}
                {activeTab === 'activity' && (
                  <div className="space-y-6 animate-slide-up">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                      <button className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors duration-300">
                        <FaDownload className="w-4 h-4" />
                        <span>Export Log</span>
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {recentActivities.map((activity, index) => (
                        <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            activity.type === 'view' ? 'bg-blue-100 text-blue-600' :
                            activity.type === 'edit' ? 'bg-emerald-100 text-emerald-600' :
                            activity.type === 'service' ? 'bg-purple-100 text-purple-600' :
                            activity.type === 'login' ? 'bg-green-100 text-green-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {activity.type === 'view' && <FaEye className="w-4 h-4" />}
                            {activity.type === 'edit' && <FaEdit className="w-4 h-4" />}
                            {activity.type === 'service' && <FaCog className="w-4 h-4" />}
                            {activity.type === 'login' && <FaUser className="w-4 h-4" />}
                            {activity.type === 'download' && <FaDownload className="w-4 h-4" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{activity.action}</p>
                            <p className="text-sm text-gray-600">{activity.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
