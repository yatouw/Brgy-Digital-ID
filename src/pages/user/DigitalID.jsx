import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaDownload, FaShare, FaPrint, FaQrcode, FaShieldAlt, FaCalendar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaExclamationTriangle, FaCheckCircle, FaClock, FaTimesCircle, FaUser } from 'react-icons/fa'
import { useAuth } from '../../contexts/AuthContext'
import { useNotifications } from '../../contexts/NotificationContext'
import { digitalIdService, userInfoService } from '../../api/appwrite/appwrite'

const DigitalID = () => {
  const { user } = useAuth()
  const notificationContext = useNotifications()
  const [isFlipped, setIsFlipped] = useState(false)
  const [digitalId, setDigitalId] = useState(null)
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [generating, setGenerating] = useState(false)
  const [requesting, setRequesting] = useState(false)

  // Safe refresh function that checks if context is available
  const safeRefreshNotifications = () => {
    try {
      if (notificationContext && typeof notificationContext.refreshNotifications === 'function') {
        notificationContext.refreshNotifications()
      }
    } catch (error) {
      console.warn('Error refreshing notifications:', error)
    }
  }

  // Load digital ID and user info
  useEffect(() => {
    const loadData = async () => {
      if (!user?.id || !user?.resident) {
        setLoading(false)
        setError('User session not found. Please refresh the page or log in again.')
        return
      }

      try {
        setLoading(true)
        setError('')
        
        // Load user info first
        const info = await userInfoService.getUserInfoByUserId(user.id)
        setUserInfo(info)
        
        // Load digital ID
        const id = await digitalIdService.getDigitalIdByUserId(user.id)
        setDigitalId(id)
        
        // Refresh notifications after loading digital ID data
        safeRefreshNotifications()
        
      } catch (error) {
        console.error('Error loading digital ID data:', error)
        if (error.code === 401 || error.type === 'user_unauthorized') {
          setError('Database access issue. Please check that the digital_ids collection exists and has proper permissions.')
        } else if (error.message?.includes('Collection with the requested ID could not be found')) {
          setError('The digital_ids collection does not exist. Please contact administrator to set up the database.')
        } else {
          setError('Failed to load digital ID information. Please try refreshing the page.')
        }
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [user])

  // Check if profile is complete
  const isProfileComplete = () => {
    if (!user?.resident || !userInfo) return false
    
    const resident = user.resident
    const requiredFields = [
      resident.firstName, 
      resident.lastName, 
      resident.birthDate, 
      resident.phone,
      userInfo.gender, 
      userInfo.civilStatus, 
      userInfo.bloodType, 
      userInfo.address,
      userInfo.barangay, 
      userInfo.city, 
      userInfo.zipCode, 
      userInfo.emergencyContactName,
      userInfo.emergencyContactPhone, 
      userInfo.emergencyContactRelation
    ]
    
    return requiredFields.every(field => field && field.toString().trim() !== '')
  }

  // Generate digital ID
  const handleGenerateId = async () => {
    try {
      setGenerating(true)
      setError('')
      
      if (!isProfileComplete()) {
        setError('Please complete your profile first before generating ID')
        return
      }
      
      const newId = await digitalIdService.requestIdGeneration(
        user.id,
        user.resident.$id,
        user.resident,
        userInfo
      )
      
      setDigitalId(newId)
      
      // Refresh notifications after generating ID
      safeRefreshNotifications()
      
    } catch (error) {
      console.error('Error generating ID:', error)
      if (error.message.includes('already exists')) {
        setError('You already have a digital ID')
      } else {
        setError('Failed to generate digital ID. Please try again.')
      }
    } finally {
      setGenerating(false)
    }
  }

  // Request verification
  const handleRequestVerification = async () => {
    try {
      setRequesting(true)
      setError('')
      
      const updatedId = await digitalIdService.requestVerification(digitalId.$id)
      setDigitalId(updatedId)
      
      // Refresh notifications after requesting verification
      safeRefreshNotifications()
      
    } catch (error) {
      console.error('Error requesting verification:', error)
      setError('Failed to request verification. Please try again.')
    } finally {
      setRequesting(false)
    }
  }

  // Format address
  const getFullAddress = () => {
    if (!userInfo) return 'Address not available'
    return `${userInfo.address || ''}, ${userInfo.barangay || ''}, ${userInfo.city || ''}, ${userInfo.zipCode || ''}`
  }

  // Get status badge
  const getStatusBadge = (status) => {
    const configs = {
      pending_generation: { icon: FaClock, text: 'Not Generated', color: 'bg-gray-100 text-gray-700' },
      pending_verification: { icon: FaClock, text: 'Pending Verification', color: 'bg-yellow-100 text-yellow-700' },
      active: { icon: FaCheckCircle, text: 'Active', color: 'bg-green-100 text-green-700' },
      rejected: { icon: FaTimesCircle, text: 'Rejected', color: 'bg-red-100 text-red-700' },
      expired: { icon: FaExclamationTriangle, text: 'Expired', color: 'bg-red-100 text-red-700' }
    }
    
    const config = configs[status] || configs.pending_generation
    const Icon = config.icon
    
    return (
      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${config.color}`}>
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{config.text}</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your digital ID...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Digital ID</h1>
          <p className="text-gray-600">Your official eBrgy Digital Identification Card</p>
        </div>
        
        {/* Status Badge */}
        <div className="mt-4 sm:mt-0">
          {digitalId ? getStatusBadge(digitalId.status) : getStatusBadge('pending_generation')}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <FaExclamationTriangle className="w-5 h-5 text-red-500" />
            <div className="flex-1">
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Alert - Show prominently if ID is rejected */}
      {digitalId?.status === 'rejected' && digitalId.rejectionReason && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 shadow-lg">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <FaTimesCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-red-900">ID Verification Rejected</h3>
                <span className="bg-red-100 text-red-800 text-xs font-medium px-3 py-1 rounded-full">
                  Action Required
                </span>
              </div>
              <p className="text-red-700 mb-4">
                <span className="font-medium">Admin Remark:</span> {digitalId.rejectionReason}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/user/profile"
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
                >
                  <FaUser className="w-4 h-4 mr-2" />
                  Update Profile
                </Link>
                <button
                  onClick={() => {
                    setError('')
                    // You can add a function to re-request verification here if needed
                  }}
                  className="inline-flex items-center px-4 py-2 bg-white text-red-600 border-2 border-red-200 rounded-lg hover:bg-red-50 transition-all duration-300 transform hover:scale-105"
                >
                  <FaExclamationTriangle className="w-4 h-4 mr-2" />
                  Contact Support
                </button>
              </div>
              <div className="mt-3 text-sm text-red-600">
                <p>Please review the admin's remarks, update your profile if necessary, and contact support if you need assistance.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Digital ID - Show Generate Button */}
      {!digitalId && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaShieldAlt className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Generate Your Digital ID</h3>
          <p className="text-gray-600 mb-4">
            {isProfileComplete() 
              ? "Your profile is complete! You can now generate your digital ID."
              : "Please complete your profile first to generate your digital ID."
            }
          </p>
          <button
            onClick={handleGenerateId}
            disabled={!isProfileComplete() || generating}
            className={`flex items-center space-x-2 mx-auto px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
              isProfileComplete() 
                ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                : 'bg-gray-300 text-gray-500'
            }`}
          >
            {generating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <FaShieldAlt className="w-5 h-5" />
                <span>Generate Digital ID</span>
              </>
            )}
          </button>
          {!isProfileComplete() && (
            <p className="text-sm text-gray-500 mt-2">
              <Link to="/user/profile" className="text-blue-600 hover:text-blue-700 underline">
                Complete your profile
              </Link> to enable ID generation
            </p>
          )}
        </div>
      )}

      {/* Digital ID Generated - Show Card */}
      {digitalId && (
        <>
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {digitalId.status === 'pending_generation' && (
              <button
                onClick={handleRequestVerification}
                disabled={requesting}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
              >
                {requesting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Requesting...
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="w-4 h-4 mr-2" />
                    Request Verification
                  </>
                )}
              </button>
            )}
            
            {digitalId.status === 'active' && (
              <>
                <button className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105">
                  <FaDownload className="w-4 h-4 mr-2" />
                  Download
                </button>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                  <FaShare className="w-4 h-4 mr-2" />
                  Share
                </button>
                <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
                  <FaPrint className="w-4 h-4 mr-2" />
                  Print
                </button>
              </>
            )}
          </div>

          {/* Digital ID Card */}
          <div className="flex justify-center">
            <div className="relative">
              <div 
                className={`relative w-[500px] h-80 transition-transform duration-700 transform-style-3d cursor-pointer ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                {/* Front Side */}
                <div className="absolute inset-0 w-full h-full backface-hidden">
                  <div className="w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden relative border border-gray-300">
                    {/* Header */}
                    <div className="bg-white px-4 py-2 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">PH</span>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-gray-900">REPUBLIKA NG PILIPINAS</div>
                            <div className="text-xs text-gray-700">Republic of the Philippines</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-emerald-700">BARANGAY DELPILAR</div>
                          <div className="text-xs text-gray-600">Digital ID Card</div>
                        </div>
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="p-4 bg-white">
                      <div className="flex space-x-4">
                        {/* Left Column - Photo and Info */}
                        <div className="flex-1">
                          <div className="grid grid-cols-3 gap-4">
                            {/* Photo */}
                            <div className="col-span-1">
                              <div className="w-20 h-24 border border-gray-300 rounded bg-gray-50 overflow-hidden">
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-gray-400 text-xs">Photo</span>
                                </div>
                              </div>
                            </div>

                            {/* Personal Info */}
                            <div className="col-span-2 space-y-2">
                              {/* ID Number */}
                              <div>
                                <div className="text-xs text-gray-500 font-medium">ID Number</div>
                                <div className="text-sm font-bold text-gray-900 font-mono">{digitalId?.idNumber || 'N/A'}</div>
                              </div>

                              {/* Last Name */}
                              <div>
                                <div className="text-xs text-gray-500 font-medium">Last Name</div>
                                <div className="text-sm font-bold text-gray-900 uppercase">{user?.resident?.lastName || 'N/A'}</div>
                              </div>

                              {/* First Name */}
                              <div>
                                <div className="text-xs text-gray-500 font-medium">First Name</div>
                                <div className="text-sm font-bold text-gray-900 uppercase">{user?.resident?.firstName || 'N/A'}</div>
                              </div>

                              {/* Middle Name */}
                              <div>
                                <div className="text-xs text-gray-500 font-medium">Middle Name</div>
                                <div className="text-sm font-bold text-gray-900 uppercase">{user?.resident?.middleName || 'N/A'}</div>
                              </div>
                            </div>
                          </div>

                          {/* Address Section */}
                          <div className="mt-4 space-y-2">
                            <div>
                              <div className="text-xs text-gray-500 font-medium">Date of Birth</div>
                              <div className="text-sm font-bold text-gray-900">{user?.resident?.birthDate || 'N/A'}</div>
                            </div>

                            <div>
                              <div className="text-xs text-gray-500 font-medium">Address</div>
                              <div className="text-xs text-gray-800 leading-tight">{getFullAddress()}</div>
                            </div>
                          </div>
                        </div>

                        {/* Right Column - QR Code */}
                        <div className="w-20 flex flex-col items-center">
                          <div className="w-16 h-16 bg-gray-100 border border-gray-300 rounded flex items-center justify-center mb-2">
                            <FaQrcode className="w-12 h-12 text-gray-400" />
                          </div>
                          <div className="text-xs text-center text-gray-600">Digital Verification</div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-emerald-50 border-t border-emerald-200 px-4 py-2">
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex space-x-4">
                          <div>
                            <span className="text-gray-600">Sex: </span>
                            <span className="font-semibold text-gray-900">{userInfo?.gender || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Blood Type: </span>
                            <span className="font-semibold text-gray-900">{userInfo?.bloodType || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Status: </span>
                            <span className={`font-semibold ${digitalId?.status === 'active' ? 'text-emerald-700' : 'text-yellow-600'}`}>
                              {digitalId?.status?.replace('_', ' ')?.toUpperCase() || 'PENDING'}
                            </span>
                          </div>
                        </div>
                        {digitalId.expiryDate && (
                          <div className="text-emerald-600 font-medium">
                            Valid: {new Date(digitalId.expiryDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Security Features */}
                    <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center border border-emerald-300">
                      <FaShieldAlt className="w-3 h-3 text-emerald-600" />
                    </div>
                  </div>
                </div>

                {/* Back Side */}
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                  <div className="w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden relative border border-gray-200">
                    {/* Header */}
                    <div className="bg-gray-600 px-4 py-3 text-white">
                      <div className="text-center">
                        <div className="text-sm font-bold">ADDITIONAL INFORMATION</div>
                        <div className="text-xs opacity-90">Barangay Delpilar Digital ID</div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-2 bg-white">
                      {/* Personal Details Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-500 font-medium mb-1">Civil Status</div>
                          <div className="text-sm font-bold text-gray-900">{userInfo?.civilStatus || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 font-medium mb-1">Blood Type</div>
                          <div className="text-sm font-bold text-gray-900">{userInfo?.bloodType || 'N/A'}</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-500 font-medium mb-1">Occupation</div>
                        <div className="text-sm font-bold text-gray-900">{userInfo?.occupation || 'N/A'}</div>
                      </div>

                      {/* Contact Information */}
                      <div className="border-t border-gray-200 pt-2">
                        <div className="grid grid-cols-2 gap-4">
                          {/* Left Column - Contact Information */}
                          <div>
                            <div className="text-xs text-gray-500 font-medium mb-1">Contact Information</div>
                            <div className="space-y-1">
                              <div className="flex items-center text-xs">
                                <FaPhone className="w-3 h-3 mr-2 text-emerald-600" />
                                <span className="text-sm font-bold text-gray-900">{user?.resident?.phone || 'N/A'}</span>
                              </div>
                              <div className="flex items-center text-xs">
                                <FaEnvelope className="w-3 h-3 mr-2 text-emerald-600" />
                                <span className="text-sm font-bold text-gray-900">{user?.resident?.email || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Right Column - Emergency Contact */}
                          <div>
                            <div className="text-xs text-gray-500 font-medium mb-1">Emergency Contact</div>
                            <div className="text-sm font-bold text-gray-900">
                              {userInfo?.emergencyContactName ? `${userInfo.emergencyContactName} - ${userInfo.emergencyContactPhone}` : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gray-600 px-4 py-2">
                      <div className="flex justify-between items-center text-xs text-white">
                        <div>
                          <span className="font-medium">Generated: </span>
                          <span className="font-bold">{digitalId?.createdAt ? new Date(digitalId.createdAt).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-xs opacity-90">← Click to view front</div>
                        </div>
                      </div>
                    </div>

                    {/* Signature Line */}
                    <div className="absolute bottom-8 left-4 right-4">
                      <div className="border-t border-gray-300 pt-1">
                        <div className="text-center text-xs text-gray-600">
                          Digital Signature on File
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <FaShieldAlt className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">ID Status</h3>
                  <p className={`font-medium ${digitalId?.status === 'active' ? 'text-emerald-600' : 'text-yellow-600'}`}>
                    {digitalId?.status?.replace('_', ' ')?.toUpperCase() || 'PENDING'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FaCalendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {digitalId?.expiryDate ? 'Valid Until' : 'Generated'}
                  </h3>
                  <p className="text-blue-600 font-medium">
                    {digitalId?.expiryDate 
                      ? new Date(digitalId.expiryDate).toLocaleDateString()
                      : digitalId?.createdAt 
                        ? new Date(digitalId.createdAt).toLocaleDateString()
                        : 'N/A'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FaQrcode className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Digital Verification</h3>
                  <p className="text-purple-600 font-medium">
                    {digitalId?.qrCode ? 'QR Code Available' : 'Pending Generation'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-blue-600 text-xs font-bold">i</span>
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-1">About Your Digital ID</h4>
            <div className="text-blue-700 text-sm space-y-1">
              {!digitalId && (
                <p>Complete your profile to generate your digital ID. Once generated, you'll need to request verification from admin.</p>
              )}
              {digitalId?.status === 'pending_generation' && (
                <p>Your ID has been generated. Click "Request Verification" to submit it for admin approval.</p>
              )}
              {digitalId?.status === 'pending_verification' && (
                <p>Your verification request has been submitted. Please wait for admin approval.</p>
              )}
              {digitalId?.status === 'active' && (
                <p>Your digital ID is active and can be used for official transactions. Click on the card to view additional information.</p>
              )}
              {digitalId?.status === 'rejected' && (
                <p>Your verification request was rejected. Reason: {digitalId.rejectionReason}. Please contact admin for assistance.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DigitalID
