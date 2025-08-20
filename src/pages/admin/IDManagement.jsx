import React, { useState } from 'react'
import { FaSearch, FaFilter, FaIdCard, FaQrcode, FaDownload, FaEye, FaEdit, FaCheck, FaClock, FaExclamationTriangle, FaBan, FaRedo } from 'react-icons/fa'

const IDManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showPreview, setShowPreview] = useState(null)

  const digitalIds = [
    {
      id: 'DID-001',
      residentId: 'RES-001',
      residentName: 'Juan Dela Cruz',
      idNumber: 'BRG-2025-001',
      status: 'active',
      issueDate: '2025-07-20',
      expiryDate: '2030-07-20',
      qrCode: 'QR12345678',
      photo: null,
      lastAccessed: '2025-08-21',
      accessCount: 45
    },
    {
      id: 'DID-002',
      residentId: 'RES-002',
      residentName: 'Maria Santos',
      idNumber: 'BRG-2025-002',
      status: 'pending_generation',
      issueDate: null,
      expiryDate: null,
      qrCode: null,
      photo: null,
      lastAccessed: null,
      accessCount: 0
    },
    {
      id: 'DID-003',
      residentId: 'RES-003',
      residentName: 'Ana Rodriguez',
      idNumber: 'BRG-2025-003',
      status: 'active',
      issueDate: '2025-06-15',
      expiryDate: '2030-06-15',
      qrCode: 'QR87654321',
      photo: null,
      lastAccessed: '2025-08-20',
      accessCount: 28
    },
    {
      id: 'DID-004',
      residentId: 'RES-004',
      residentName: 'Carlos Mendoza',
      idNumber: 'BRG-2025-004',
      status: 'under_review',
      issueDate: null,
      expiryDate: null,
      qrCode: null,
      photo: null,
      lastAccessed: null,
      accessCount: 0
    },
    {
      id: 'DID-005',
      residentId: 'RES-005',
      residentName: 'Sofia Reyes',
      idNumber: 'BRG-2025-005',
      status: 'expired',
      issueDate: '2020-05-25',
      expiryDate: '2025-05-25',
      qrCode: 'QR11223344',
      photo: null,
      lastAccessed: '2025-05-20',
      accessCount: 156
    }
  ]

  const filteredIds = digitalIds.filter(id => {
    const matchesSearch = id.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         id.idNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         id.residentId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || id.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: FaCheck, label: 'Active' },
      pending_generation: { color: 'bg-yellow-100 text-yellow-800', icon: FaClock, label: 'Pending Generation' },
      under_review: { color: 'bg-blue-100 text-blue-800', icon: FaExclamationTriangle, label: 'Under Review' },
      expired: { color: 'bg-red-100 text-red-800', icon: FaBan, label: 'Expired' },
      suspended: { color: 'bg-gray-100 text-gray-800', icon: FaBan, label: 'Suspended' }
    }
    const config = statusConfig[status] || statusConfig.pending_generation
    const IconComponent = config.icon

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    )
  }

  const handleGenerateId = (idData) => {
    console.log('Generating ID for:', idData.residentName)
    // TODO: Implement ID generation logic
  }

  const handleRevokeId = (idData) => {
    console.log('Revoking ID for:', idData.residentName)
    // TODO: Implement ID revocation logic
  }

  const handleRenewId = (idData) => {
    console.log('Renewing ID for:', idData.residentName)
    // TODO: Implement ID renewal logic
  }

  const IDPreviewModal = ({ idData, onClose }) => {
    if (!idData) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Digital ID Preview</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
          
          {/* ID Card Preview */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white relative overflow-hidden mb-4">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-medium opacity-90">BARANGAY ANINGWAY</div>
                <div className="text-xs opacity-90">DIGITAL ID</div>
              </div>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {idData.residentName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg">{idData.residentName}</div>
                  <div className="text-sm opacity-90">{idData.idNumber}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="opacity-75">Issue Date</div>
                  <div className="font-medium">{idData.issueDate ? new Date(idData.issueDate).toLocaleDateString() : 'N/A'}</div>
                </div>
                <div>
                  <div className="opacity-75">Expiry Date</div>
                  <div className="font-medium">{idData.expiryDate ? new Date(idData.expiryDate).toLocaleDateString() : 'N/A'}</div>
                </div>
              </div>
              
              {idData.qrCode && (
                <div className="mt-4 text-center">
                  <div className="inline-block bg-white p-2 rounded">
                    <FaQrcode className="w-8 h-8 text-gray-800" />
                  </div>
                  <div className="text-xs mt-1 opacity-75">{idData.qrCode}</div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors">
              <FaDownload className="w-4 h-4 inline mr-2" />
              Download
            </button>
            <button onClick={onClose} className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
              Close
            </button>
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
          <p className="text-gray-600 mt-1">Generate, manage, and track digital identification cards</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            <FaIdCard className="w-4 h-4 mr-2" />
            Bulk Generate
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            <FaDownload className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FaIdCard className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active IDs</p>
              <p className="text-2xl font-bold text-gray-900">
                {digitalIds.filter(id => id.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <FaClock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {digitalIds.filter(id => id.status === 'pending_generation').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <FaBan className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Expired</p>
              <p className="text-2xl font-bold text-gray-900">
                {digitalIds.filter(id => id.status === 'expired').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FaQrcode className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Scans</p>
              <p className="text-2xl font-bold text-gray-900">
                {digitalIds.reduce((total, id) => total + id.accessCount, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by resident name, ID number, or resident ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-400 w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending_generation">Pending Generation</option>
                <option value="under_review">Under Review</option>
                <option value="expired">Expired</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Digital IDs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resident
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Information
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue/Expiry
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage Stats
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIds.map((idData) => (
                <tr key={idData.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-emerald-700 font-semibold text-sm">
                          {idData.residentName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{idData.residentName}</div>
                        <div className="text-sm text-gray-500">{idData.residentId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{idData.idNumber}</div>
                    <div className="text-sm text-gray-500">
                      {idData.qrCode ? `QR: ${idData.qrCode}` : 'QR not generated'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(idData.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>Issue: {idData.issueDate ? new Date(idData.issueDate).toLocaleDateString() : 'N/A'}</div>
                    <div>Expiry: {idData.expiryDate ? new Date(idData.expiryDate).toLocaleDateString() : 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>Scans: {idData.accessCount}</div>
                    <div>Last: {idData.lastAccessed ? new Date(idData.lastAccessed).toLocaleDateString() : 'Never'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => setShowPreview(idData)}
                        className="text-emerald-600 hover:text-emerald-900 p-1"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900 p-1">
                        <FaEdit className="w-4 h-4" />
                      </button>
                      {idData.status === 'pending_generation' && (
                        <button 
                          onClick={() => handleGenerateId(idData)}
                          className="text-green-600 hover:text-green-900 p-1"
                        >
                          <FaIdCard className="w-4 h-4" />
                        </button>
                      )}
                      {idData.status === 'expired' && (
                        <button 
                          onClick={() => handleRenewId(idData)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                        >
                          <FaRedo className="w-4 h-4" />
                        </button>
                      )}
                      {idData.status === 'active' && (
                        <button 
                          onClick={() => handleRevokeId(idData)}
                          className="text-red-600 hover:text-red-900 p-1"
                        >
                          <FaBan className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredIds.length}</span> of{' '}
            <span className="font-medium">{digitalIds.length}</span> results
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-1 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ID Preview Modal */}
      <IDPreviewModal 
        idData={showPreview} 
        onClose={() => setShowPreview(null)} 
      />
    </div>
  )
}

export default IDManagement
