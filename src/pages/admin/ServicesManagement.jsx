import React, { useState } from 'react'
import { FaSearch, FaFilter, FaPlus, FaEdit, FaEye, FaTrash, FaDownload, FaCheck, FaClock, FaExclamationTriangle, FaClipboardList, FaFileAlt, FaMedkit, FaDollarSign, FaBuilding } from 'react-icons/fa'

const ServicesManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all')
  const [showRequestModal, setShowRequestModal] = useState(null)

  const serviceRequests = [
    {
      id: 'REQ-001',
      residentId: 'RES-001',
      residentName: 'Juan Dela Cruz',
      serviceType: 'barangay_clearance',
      title: 'Barangay Clearance Request',
      purpose: 'Employment requirements',
      status: 'approved',
      dateRequested: '2025-08-15',
      dateProcessed: '2025-08-18',
      processedBy: 'Admin User',
      documents: ['valid_id.pdf', 'application_form.pdf'],
      fee: 50,
      remarks: 'All requirements complete'
    },
    {
      id: 'REQ-002',
      residentId: 'RES-002',
      residentName: 'Maria Santos',
      serviceType: 'business_permit',
      title: 'Business Permit Application',
      purpose: 'New business registration',
      status: 'pending',
      dateRequested: '2025-08-20',
      dateProcessed: null,
      processedBy: null,
      documents: ['business_plan.pdf', 'location_sketch.pdf'],
      fee: 500,
      remarks: 'Under review by business office'
    },
    {
      id: 'REQ-003',
      residentId: 'RES-003',
      residentName: 'Ana Rodriguez',
      serviceType: 'health_certificate',
      title: 'Health Certificate Request',
      purpose: 'School enrollment',
      status: 'under_review',
      dateRequested: '2025-08-18',
      dateProcessed: null,
      processedBy: null,
      documents: ['medical_records.pdf'],
      fee: 100,
      remarks: 'Waiting for health officer approval'
    },
    {
      id: 'REQ-004',
      residentId: 'RES-004',
      residentName: 'Carlos Mendoza',
      serviceType: 'financial_aid',
      title: 'Financial Aid Application',
      purpose: 'Medical assistance',
      status: 'rejected',
      dateRequested: '2025-08-10',
      dateProcessed: '2025-08-12',
      processedBy: 'Admin User',
      documents: ['medical_certificate.pdf', 'income_statement.pdf'],
      fee: 0,
      remarks: 'Incomplete requirements'
    },
    {
      id: 'REQ-005',
      residentId: 'RES-005',
      residentName: 'Sofia Reyes',
      serviceType: 'barangay_clearance',
      title: 'Barangay Clearance Request',
      purpose: 'Travel requirements',
      status: 'approved',
      dateRequested: '2025-08-12',
      dateProcessed: '2025-08-14',
      processedBy: 'Admin User',
      documents: ['valid_id.pdf'],
      fee: 50,
      remarks: 'Expedited processing'
    }
  ]

  const serviceTypes = {
    barangay_clearance: { label: 'Barangay Clearance', icon: FaFileAlt, color: 'blue' },
    business_permit: { label: 'Business Permit', icon: FaBuilding, color: 'purple' },
    health_certificate: { label: 'Health Certificate', icon: FaMedkit, color: 'green' },
    financial_aid: { label: 'Financial Aid', icon: FaDollarSign, color: 'yellow' }
  }

  const filteredRequests = serviceRequests.filter(request => {
    const matchesSearch = request.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter
    const matchesType = serviceTypeFilter === 'all' || request.serviceType === serviceTypeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: { color: 'bg-green-100 text-green-800', icon: FaCheck, label: 'Approved' },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: FaClock, label: 'Pending' },
      under_review: { color: 'bg-blue-100 text-blue-800', icon: FaExclamationTriangle, label: 'Under Review' },
      rejected: { color: 'bg-red-100 text-red-800', icon: FaExclamationTriangle, label: 'Rejected' }
    }
    const config = statusConfig[status] || statusConfig.pending
    const IconComponent = config.icon

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    )
  }

  const getServiceBadge = (serviceType) => {
    const config = serviceTypes[serviceType] || { label: serviceType, icon: FaClipboardList, color: 'gray' }
    const IconComponent = config.icon

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    )
  }

  const RequestDetailsModal = ({ request, onClose }) => {
    if (!request) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Service Request Details</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            
            {/* Request Info */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Request ID</label>
                  <p className="text-sm text-gray-900">{request.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">{getStatusBadge(request.status)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Resident</label>
                  <p className="text-sm text-gray-900">{request.residentName}</p>
                  <p className="text-xs text-gray-500">{request.residentId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Service Type</label>
                  <div className="mt-1">{getServiceBadge(request.serviceType)}</div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Purpose</label>
                <p className="text-sm text-gray-900">{request.purpose}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Date Requested</label>
                  <p className="text-sm text-gray-900">{new Date(request.dateRequested).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Fee</label>
                  <p className="text-sm text-gray-900">₱{request.fee}</p>
                </div>
              </div>

              {request.dateProcessed && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date Processed</label>
                    <p className="text-sm text-gray-900">{new Date(request.dateProcessed).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Processed By</label>
                    <p className="text-sm text-gray-900">{request.processedBy}</p>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-500">Documents</label>
                <div className="mt-2 space-y-2">
                  {request.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">{doc}</span>
                      <button className="text-emerald-600 hover:text-emerald-700 text-sm">
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Remarks</label>
                <p className="text-sm text-gray-900">{request.remarks}</p>
              </div>
            </div>

            <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200">
              {request.status === 'pending' && (
                <>
                  <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                    <FaCheck className="w-4 h-4 inline mr-2" />
                    Approve
                  </button>
                  <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                    <FaExclamationTriangle className="w-4 h-4 inline mr-2" />
                    Reject
                  </button>
                </>
              )}
              <button onClick={onClose} className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                Close
              </button>
            </div>
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
          <h1 className="text-3xl font-bold text-gray-900">Services Management</h1>
          <p className="text-gray-600 mt-1">Process and manage resident service requests</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            <FaPlus className="w-4 h-4 mr-2" />
            New Service
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            <FaDownload className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Service Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FaClipboardList className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{serviceRequests.length}</p>
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
                {serviceRequests.filter(r => r.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FaCheck className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {serviceRequests.filter(r => r.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <FaDollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ₱{serviceRequests.reduce((total, r) => total + (r.status === 'approved' ? r.fee : 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by resident name, request ID, or service title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-400 w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <select
                value={serviceTypeFilter}
                onChange={(e) => setServiceTypeFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">All Services</option>
                <option value="barangay_clearance">Barangay Clearance</option>
                <option value="business_permit">Business Permit</option>
                <option value="health_certificate">Health Certificate</option>
                <option value="financial_aid">Financial Aid</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Service Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resident
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{request.title}</div>
                      <div className="text-sm text-gray-500">{request.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-emerald-700 font-semibold text-xs">
                          {request.residentName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{request.residentName}</div>
                        <div className="text-sm text-gray-500">{request.residentId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getServiceBadge(request.serviceType)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(request.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₱{request.fee}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(request.dateRequested).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => setShowRequestModal(request)}
                        className="text-emerald-600 hover:text-emerald-900 p-1"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900 p-1">
                        <FaEdit className="w-4 h-4" />
                      </button>
                      {request.status === 'pending' && (
                        <>
                          <button className="text-green-600 hover:text-green-900 p-1">
                            <FaCheck className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900 p-1">
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </>
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
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredRequests.length}</span> of{' '}
            <span className="font-medium">{serviceRequests.length}</span> results
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

      {/* Request Details Modal */}
      <RequestDetailsModal 
        request={showRequestModal} 
        onClose={() => setShowRequestModal(null)} 
      />
    </div>
  )
}

export default ServicesManagement
