import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FaSearch, FaEye, FaCheck, FaTimes, FaDownload, FaPrint, FaFilter,
  FaUser, FaCalendar, FaShieldAlt, FaExclamationTriangle, FaClock,
  FaCheckCircle, FaTimesCircle, FaQrcode, FaSync
} from 'react-icons/fa'
import { digitalIdService, residentService, userInfoService } from '../../api/appwrite/appwrite'
import { useAuth } from '../../contexts/AuthContext'

const IDManagement = () => {
  const { user: adminUser, logout } = useAuth()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showPreview, setShowPreview] = useState(null)
  const [showRejectModal, setShowRejectModal] = useState(null)
  const [digitalIds, setDigitalIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [authChecked, setAuthChecked] = useState(false)
  const [loadingCall, setLoadingCall] = useState(false) // Prevent concurrent calls
  const [loadingProgress, setLoadingProgress] = useState(0) // Track batch loading progress

  // Handle authentication errors
  const handleAuthError = useCallback(async (error) => {
    console.error('Authentication error:', error)
    
    if (error.code === 401 || error.type === 'general_unauthorized_scope' || error.message?.includes('unauthorized')) {
      setError('Session expired. Redirecting to login...')
      
      try {
        await logout()
      } catch (logoutError) {
        console.error('Error during logout:', logoutError)
      }
      
      setTimeout(() => {
        navigate('/admin/login', { replace: true })
      }, 1500)
      
      return true
    }
    
    return false
  }, [logout, navigate])

  // Load digital IDs with proper error handling and no duplicates
  const loadDigitalIds = useCallback(async (forceReload = false) => {
    if (!adminUser?.id) {
      return
    }

    // Prevent concurrent calls unless forced
    if (loadingCall && !forceReload) {
      return
    }

    try {
      setLoadingCall(true)
      setLoading(true)
      setError('')
      setLoadingProgress(0)
      
      const response = await digitalIdService.getAllDigitalIds(statusFilter)
      
      // If no documents, set empty array and return early
      if (!response.documents || response.documents.length === 0) {
        setDigitalIds([])
        return
      }
      
      // Set basic digital IDs first for immediate display
      const basicIds = response.documents.map(digitalId => ({
        ...digitalId,
        resident: { firstName: 'Loading...', lastName: '', email: digitalId.userId },
        userInfo: {}
      }))
      setDigitalIds(basicIds)
      setLoading(false) // Show basic data immediately
      
      // Enrich with resident and user info data in batches to avoid overwhelming the API
      const batchSize = 5 // Process 5 records at a time
      const batches = []
      
      for (let i = 0; i < response.documents.length; i += batchSize) {
        batches.push(response.documents.slice(i, i + batchSize))
      }
      
      const enrichedIds = []
      
      for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        const batch = batches[batchIndex]
        
        setLoadingProgress(((batchIndex) / batches.length) * 100)
        
        const batchResults = await Promise.allSettled(
          batch.map(async (digitalId) => {
            try {
              // Add timeout to prevent hanging requests
              const timeout = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Request timeout')), 5000)
              )
              
              // Get resident and user info data in parallel with timeout
              const [resident, userInfo] = await Promise.race([
                Promise.all([
                  residentService.getResidentByUserId(digitalId.userId).catch(() => null),
                  userInfoService.getUserInfoByUserId(digitalId.userId).catch(() => null)
                ]),
                timeout
              ])
              
              return {
                ...digitalId,
                resident: resident || { firstName: 'Unknown', lastName: 'User', email: digitalId.userId },
                userInfo: userInfo || {}
              }
            } catch (error) {
              return {
                ...digitalId,
                resident: { firstName: 'Error Loading', lastName: '', email: digitalId.userId },
                userInfo: {}
              }
            }
          })
        )
        
        // Process batch results
        const batchValidIds = batchResults
          .filter(result => result.status === 'fulfilled')
          .map(result => result.value)
        
        enrichedIds.push(...batchValidIds)
        
        // Update UI with each batch to show progressive loading
        setDigitalIds(prev => {
          const updatedIds = [...prev]
          batchValidIds.forEach(enrichedId => {
            const index = updatedIds.findIndex(id => id.$id === enrichedId.$id)
            if (index !== -1) {
              updatedIds[index] = enrichedId
            }
          })
          return updatedIds
        })
        
        // Small delay between batches to avoid overwhelming the API
        if (batches.length > 1) {
          await new Promise(resolve => setTimeout(resolve, 200))
        }
      }
      
      setLoadingProgress(100)
      
    } catch (error) {
      console.error('Error in loadDigitalIds:', error)
      
      const authHandled = await handleAuthError(error)
      if (!authHandled) {
        // Fallback: try to load just the basic digital IDs without enrichment
        try {
          const response = await digitalIdService.getAllDigitalIds(statusFilter)
          const basicIds = response.documents.map(digitalId => ({
            ...digitalId,
            resident: { firstName: 'Loading...', lastName: '', email: '' },
            userInfo: {}
          }))
          setDigitalIds(basicIds)
          setError('Loaded with limited information. Some details may be missing.')
        } catch (fallbackError) {
          console.error('Fallback load also failed:', fallbackError)
          setError('Failed to load digital IDs. Please try refreshing the page.')
          setDigitalIds([])
        }
      }
    } finally {
      setLoading(false)
      setLoadingCall(false)
      setLoadingProgress(0)
    }
  }, [adminUser?.id, statusFilter, handleAuthError, loadingCall])

  // Debounce search term to prevent excessive filtering
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Initial authentication check and data load
  useEffect(() => {
    const initializeComponent = async () => {
      
      // Check if admin user exists
      if (!adminUser?.id) {
        navigate('/admin/login', { replace: true })
        return
      }

      setAuthChecked(true)
    }

    if (!authChecked) {
      initializeComponent()
    }
  }, [adminUser?.id, navigate, authChecked])

  // Load digital IDs after auth is confirmed
  useEffect(() => {
    if (authChecked && adminUser?.id) {
      loadDigitalIds()
    }
  }, [authChecked, adminUser?.id])

  // Reload data when status filter changes (but only after initial load)
  useEffect(() => {
    if (authChecked && adminUser?.id && !loadingCall) {
      loadDigitalIds(true) // Force reload
    }
  }, [statusFilter])

  // Force session cleanup and redirect
  const forceLogoutAndRedirect = useCallback(async () => {
    try {
      setError('Clearing session and redirecting...')
      
      sessionStorage.clear()
      localStorage.removeItem('user')
      localStorage.removeItem('userType')
      
      await logout()
    } catch (error) {
      console.error('Error during force logout:', error)
    } finally {
      window.location.href = '/admin/login'
    }
  }, [logout])

  // Filter digital IDs based on search term (memoized to prevent unnecessary recalculations)
  const filteredIds = React.useMemo(() => {
    return digitalIds.filter(id => {
      const searchMatch = 
        id.idNumber?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        id.resident?.firstName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        id.resident?.lastName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        id.resident?.email?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      
      return searchMatch
    })
  }, [digitalIds, debouncedSearchTerm])

  const getStatusBadge = useCallback((status) => {
    const configs = {
      pending_generation: { 
        icon: FaClock, 
        text: 'Pending Generation', 
        color: 'bg-gray-100 text-gray-700 border-gray-300' 
      },
      pending_verification: { 
        icon: FaClock, 
        text: 'Pending Verification', 
        color: 'bg-yellow-100 text-yellow-700 border-yellow-300' 
      },
      active: { 
        icon: FaCheckCircle, 
        text: 'Active', 
        color: 'bg-green-100 text-green-700 border-green-300' 
      },
      rejected: { 
        icon: FaTimesCircle, 
        text: 'Rejected', 
        color: 'bg-red-100 text-red-700 border-red-300' 
      },
      expired: { 
        icon: FaExclamationTriangle, 
        text: 'Expired', 
        color: 'bg-red-100 text-red-700 border-red-300' 
      }
    }
    
    const config = configs[status] || configs.pending_generation
    const Icon = config.icon
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    )
  }, [])

  // Track ongoing approval operations to prevent duplicates
  const ongoingApprovals = useRef(new Set())
  
  const handleApproveVerification = useCallback(async (digitalId) => {
    if (processing || loadingCall) {
      return
    }
    
    // Check if this specific document is already being processed
    const documentId = digitalId?.$id
    if (!documentId) {
      console.error('No document ID available for approval')
      return
    }
    
    if (ongoingApprovals.current.has(documentId)) {
      return
    }
    
    try {
      // Mark this document as being processed
      ongoingApprovals.current.add(documentId)
      setProcessing(true)
      setError('')
      
      if (!adminUser?.id) {
        throw new Error('Admin user ID not available')
      }
      
      // Double-check document hasn't been processed already by fetching current state
      const currentDoc = await digitalIdService.getDigitalIdById(documentId)
      
      if (currentDoc.status === 'active') {
        setError('This document has already been approved')
        return
      }
      
      if (currentDoc.status !== 'pending_verification') {
        setError(`Cannot approve document with status: ${currentDoc.status}`)
        return
      }
      
      const result = await digitalIdService.approveVerification(documentId, adminUser.id)
      
      // Validate the result
      if (result.status !== 'active') {
        throw new Error(`Approval appeared successful but status is '${result.status}' instead of 'active'`)
      }
      
      // Update the local state immediately to provide instant feedback
      setDigitalIds(prevIds => 
        prevIds.map(id => 
          id.$id === documentId 
            ? { ...id, status: 'active', verifiedBy: adminUser.id, verifiedDate: result.verifiedDate }
            : id
        )
      )
      
      // Also close any modals
      setShowPreview(null)
      
      // Show success message
      setError('') // Clear any previous errors
      
      // Force reload after a short delay to ensure database consistency
      setTimeout(async () => {
        try {
          await loadDigitalIds(true)
        } catch (reloadError) {
          console.error('Error reloading after approval:', reloadError)
        }
      }, 1000)
      
    } catch (error) {
      console.error('=== APPROVAL ERROR ===')
      console.error('Detailed approval error:', {
        error: error,
        message: error.message,
        code: error.code,
        type: error.type,
        digitalId: documentId,
        adminUserId: adminUser?.id
      })
      
      const authHandled = await handleAuthError(error)
      if (!authHandled) {
        setError(`Failed to approve verification: ${error.message || 'Unknown error'}`)
      }
    } finally {
      // Always remove from ongoing operations
      ongoingApprovals.current.delete(documentId)
      setProcessing(false)
    }
  }, [processing, loadingCall, adminUser?.id, loadDigitalIds, handleAuthError])

  // Track ongoing rejection operations to prevent duplicates
  const ongoingRejections = useRef(new Set())

  const handleRejectVerification = useCallback(async (digitalId, reason) => {
    if (processing || loadingCall) {
      return
    }
    
    // Check if this specific document is already being processed
    const documentId = digitalId?.$id
    if (!documentId) {
      console.error('No document ID available for rejection')
      return
    }
    
    if (ongoingRejections.current.has(documentId)) {
      return
    }
    
    try {
      // Mark this document as being processed
      ongoingRejections.current.add(documentId)
      setProcessing(true)
      setError('')
      
      if (!adminUser?.id) {
        throw new Error('Admin user ID not available')
      }
      
      if (!reason?.trim()) {
        throw new Error('Rejection reason is required')
      }
      
      // Double-check document hasn't been processed already
      const currentDoc = await digitalIdService.getDigitalIdById(documentId)
      
      if (currentDoc.status === 'rejected') {
        setError('This document has already been rejected')
        return
      }
      
      if (currentDoc.status !== 'pending_verification') {
        setError(`Cannot reject document with status: ${currentDoc.status}`)
        return
      }
      
      const result = await digitalIdService.rejectVerification(documentId, adminUser.id, reason.trim())
      
      // Validate the result
      if (result.status !== 'rejected') {
        throw new Error(`Rejection appeared successful but status is '${result.status}' instead of 'rejected'`)
      }
      
      // Update the local state immediately to provide instant feedback
      setDigitalIds(prevIds => 
        prevIds.map(id => 
          id.$id === documentId 
            ? { ...id, status: 'rejected', verifiedBy: adminUser.id, rejectionReason: reason.trim() }
            : id
        )
      )
      
      // Close modals
      setShowPreview(null)
      setShowRejectModal(null)
      
      // Clear any previous errors
      setError('')
      
      // Force reload after a short delay to ensure database consistency
      setTimeout(async () => {
        try {
          await loadDigitalIds(true)
        } catch (reloadError) {
          console.error('Error reloading after rejection:', reloadError)
        }
      }, 1000)
      
    } catch (error) {
      console.error('=== REJECTION ERROR ===')
      console.error('Detailed rejection error:', {
        error: error,
        message: error.message,
        code: error.code,
        type: error.type,
        digitalId: documentId,
        adminUserId: adminUser?.id,
        reason: reason
      })
      
      const authHandled = await handleAuthError(error)
      if (!authHandled) {
        setError(`Failed to reject verification: ${error.message || 'Unknown error'}`)
      }
    } finally {
      // Always remove from ongoing operations
      ongoingRejections.current.delete(documentId)
      setProcessing(false)
    }
  }, [processing, loadingCall, adminUser?.id, loadDigitalIds, handleAuthError])

  const RejectModal = React.memo(({ digitalId, onReject, onClose }) => {
    const [reason, setReason] = useState('')
    
    const handleSubmit = useCallback(() => {
      if (reason.trim()) {
        onReject(digitalId, reason.trim())
      }
    }, [reason, digitalId, onReject])
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Verification</h3>
          <p className="text-gray-600 mb-4">
            Please provide a reason for rejecting {digitalId.resident?.firstName} {digitalId.resident?.lastName}'s ID verification:
          </p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter rejection reason..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 mb-4 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
            autoFocus
          />
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={processing}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!reason.trim() || processing}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center"
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Rejecting...
                </>
              ) : (
                'Reject'
              )}
            </button>
          </div>
        </div>
      </div>
    )
  })

  const IDPreviewModal = React.memo(({ idData, onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Digital ID Preview</h2>
              <button
                onClick={onClose}
                disabled={processing}
                className="text-gray-400 hover:text-gray-600 text-2xl disabled:opacity-50"
              >
                ×
              </button>
            </div>

            {/* ID Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    <p className="text-gray-900">
                      {idData.resident?.firstName} {idData.resident?.middleName} {idData.resident?.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">ID Number</label>
                    <p className="text-gray-900 font-mono">{idData.idNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                    <p className="text-gray-900">{idData.resident?.birthDate}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Gender</label>
                    <p className="text-gray-900">{idData.userInfo?.gender}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Civil Status</label>
                    <p className="text-gray-900">{idData.userInfo?.civilStatus}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Blood Type</label>
                    <p className="text-gray-900">{idData.userInfo?.bloodType}</p>
                  </div>
                </div>
              </div>

              {/* Contact & Address Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Contact & Address</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-900">{idData.resident?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-gray-900">{idData.resident?.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Address</label>
                    <p className="text-gray-900">
                      {idData.userInfo?.address}, {idData.userInfo?.barangay}, {idData.userInfo?.city}, {idData.userInfo?.zipCode}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Emergency Contact</label>
                    <p className="text-gray-900">
                      {idData.userInfo?.emergencyContactName} - {idData.userInfo?.emergencyContactPhone}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Occupation</label>
                    <p className="text-gray-900">{idData.userInfo?.occupation}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Information */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Status Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Current Status</label>
                  <div className="mt-1">{getStatusBadge(idData.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Generated Date</label>
                  <p className="text-gray-900">{new Date(idData.createdAt).toLocaleDateString()}</p>
                </div>
                {idData.verificationRequestDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Verification Requested</label>
                    <p className="text-gray-900">{new Date(idData.verificationRequestDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
              
              {idData.rejectionReason && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-600">Rejection Reason</label>
                  <p className="text-red-700 bg-red-50 p-2 rounded mt-1">{idData.rejectionReason}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {idData.status === 'pending_verification' && (
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => !processing && setShowRejectModal(idData)}
                  disabled={processing || loadingCall}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaTimes className="w-4 h-4 mr-2" />
                  Reject
                </button>
                <button
                  onClick={() => !processing && handleApproveVerification(idData)}
                  disabled={processing || loadingCall}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaCheck className="w-4 h-4 mr-2" />
                      Approve
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  })

  if (loading && digitalIds.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading digital IDs...</p>
            {loadingProgress > 0 && (
              <div className="mt-4 w-64 mx-auto">
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${loadingProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">{Math.round(loadingProgress)}% loaded</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Digital ID Management</h1>
          <p className="text-gray-600 mt-1">Review and approve digital ID verification requests</p>
        </div>
        
        {/* Stats */}
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <button
            onClick={() => !loadingCall && loadDigitalIds(true)}
            disabled={loadingCall}
            className="flex items-center px-3 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FaSync className={`w-4 h-4 mr-2 ${loadingCall ? 'animate-spin' : ''}`} />
            {loadingCall ? 'Loading...' : 'Refresh'}
          </button>
          
          <div className="flex space-x-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-green-600">
                {digitalIds.filter(id => id.status === 'active').length}
              </div>
              <div className="text-gray-500">Active</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-yellow-600">
                {digitalIds.filter(id => id.status === 'pending_verification').length}
              </div>
              <div className="text-gray-500">Pending</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-600">
                {digitalIds.length}
              </div>
              <div className="text-gray-500">Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Progress Indicator */}
      {loadingCall && digitalIds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <p className="text-blue-700">Enriching data with user information...</p>
            </div>
            {loadingProgress > 0 && (
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${loadingProgress}%` }}
                  ></div>
                </div>
                <span className="text-sm text-blue-600">{Math.round(loadingProgress)}%</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaExclamationTriangle className="w-5 h-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
            {error.includes('Session expired') && (
              <button
                onClick={forceLogoutAndRedirect}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              >
                Force Logout
              </button>
            )}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, ID number, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
          
          {/* Status Filter */}
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="pending_verification">Pending Verification</option>
              <option value="active">Active</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Digital IDs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resident
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredIds.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <FaUser className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">No digital IDs found</p>
                      <p className="text-sm">Try adjusting your search or filter criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredIds.map((digitalId) => (
                  <tr key={digitalId.$id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-emerald-600 font-medium text-sm">
                            {digitalId.resident?.firstName?.[0]}{digitalId.resident?.lastName?.[0]}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {digitalId.resident?.firstName} {digitalId.resident?.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{digitalId.resident?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-mono text-gray-900">{digitalId.idNumber}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(digitalId.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {digitalId.verificationRequestDate 
                          ? new Date(digitalId.verificationRequestDate).toLocaleDateString()
                          : new Date(digitalId.createdAt).toLocaleDateString()
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setShowPreview(digitalId)}
                          className="text-emerald-600 hover:text-emerald-700 p-1"
                          title="View Details"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        
                        {digitalId.status === 'pending_verification' && (
                          <>
                            <button
                              onClick={() => !processing && handleApproveVerification(digitalId)}
                              disabled={processing || loadingCall}
                              className="text-green-600 hover:text-green-700 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Approve"
                            >
                              {processing ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                              ) : (
                                <FaCheck className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => !processing && setShowRejectModal(digitalId)}
                              disabled={processing || loadingCall}
                              className="text-red-600 hover:text-red-700 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Reject"
                            >
                              <FaTimes className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <IDPreviewModal 
          idData={showPreview} 
          onClose={() => setShowPreview(null)} 
        />
      )}

      {/* Standalone Reject Modal */}
      {showRejectModal && (
        <RejectModal
          digitalId={showRejectModal}
          onReject={handleRejectVerification}
          onClose={() => setShowRejectModal(null)}
        />
      )}
    </div>
  )
}

export default IDManagement
