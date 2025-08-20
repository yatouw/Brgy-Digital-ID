import React, { useState } from 'react'
import { FaDownload, FaShare, FaPrint, FaQrcode, FaShieldAlt, FaCalendar, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa'

const DigitalID = () => {
  const [isFlipped, setIsFlipped] = useState(false)
  
  // Sample resident data
  const residentData = {
    fullName: "JUAN DELA CRUZ",
    firstName: "Juan",
    middleName: "Santos",
    lastName: "Dela Cruz",
    suffix: "",
    idNumber: "2024-001234",
    address: "123 Sampaguita Street, Barangay San Miguel",
    city: "Marikina City",
    zipCode: "1800",
    birthDate: "January 15, 1990",
    age: 34,
    civilStatus: "Married",
    gender: "Male",
    contactNumber: "+63 917 123 4567",
    email: "juan.delacruz@email.com",
    emergencyContact: "Maria Dela Cruz - 09171234568",
    bloodType: "O+",
    occupation: "Software Engineer",
    issuedDate: "March 15, 2024",
    expiryDate: "March 15, 2027",
    status: "ACTIVE",
    qrCode: "EBRGY2024001234JUANDELACRUZ1990011534M",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Digital ID</h1>
          <p className="text-gray-600">Your official eBrgy Digital Identification Card</p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
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
        </div>
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
                            <img 
                              src={residentData.photo} 
                              alt="Profile" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        {/* Personal Info */}
                        <div className="col-span-2 space-y-2">
                          {/* ID Number */}
                          <div>
                            <div className="text-xs text-gray-500 font-medium">ID Number</div>
                            <div className="text-sm font-bold text-gray-900 font-mono">{residentData.idNumber}</div>
                          </div>

                          {/* Last Name */}
                          <div>
                            <div className="text-xs text-gray-500 font-medium">Last Name</div>
                            <div className="text-sm font-bold text-gray-900 uppercase">{residentData.lastName}</div>
                          </div>

                          {/* First Name */}
                          <div>
                            <div className="text-xs text-gray-500 font-medium">First Name</div>
                            <div className="text-sm font-bold text-gray-900 uppercase">{residentData.firstName}</div>
                          </div>

                          {/* Middle Name */}
                          <div>
                            <div className="text-xs text-gray-500 font-medium">Middle Name</div>
                            <div className="text-sm font-bold text-gray-900 uppercase">{residentData.middleName}</div>
                          </div>
                        </div>
                      </div>

                      {/* Address Section */}
                      <div className="mt-4 space-y-2">
                        <div>
                          <div className="text-xs text-gray-500 font-medium">Date of Birth</div>
                          <div className="text-sm font-bold text-gray-900">{residentData.birthDate}</div>
                        </div>

                        <div>
                          <div className="text-xs text-gray-500 font-medium">Address</div>
                          <div className="text-xs text-gray-800 leading-tight">{residentData.address}</div>
                          <div className="text-xs text-gray-800">{residentData.city}, {residentData.zipCode}</div>
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
                        <span className="font-semibold text-gray-900">{residentData.gender}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Blood Type: </span>
                        <span className="font-semibold text-gray-900">{residentData.bloodType}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Status: </span>
                        <span className="font-semibold text-emerald-700">{residentData.status}</span>
                      </div>
                    </div>
                    <div className="text-emerald-600 font-medium">Valid: {residentData.expiryDate}</div>
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
                <div className="bg-white-600 px-4 py-3 text-black">
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
                      <div className="text-sm font-bold text-gray-900">{residentData.civilStatus}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium mb-1">Blood Type</div>
                      <div className="text-sm font-bold text-gray-900">{residentData.bloodType}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500 font-medium mb-1">Occupation</div>
                    <div className="text-sm font-bold text-gray-900">{residentData.occupation}</div>
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
                            <span className="text-sm font-bold text-gray-900">{residentData.contactNumber}</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <FaEnvelope className="w-3 h-3 mr-2 text-emerald-600" />
                            <span className="text-sm font-bold text-gray-900">{residentData.email}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Right Column - Emergency Contact */}
                      <div>
                        <div className="text-xs text-gray-500 font-medium mb-1">Emergency Contact</div>
                        <div className="text-sm font-bold text-gray-900">{residentData.emergencyContact}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 bg-white-600 px-4 py-2">
                  <div className="flex justify-between items-center text-xs text-black">
                    <div>
                      <span className="font-medium">Issued: </span>
                      <span className="font-bold">{residentData.issuedDate}</span>
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

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <FaShieldAlt className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">ID Status</h3>
              <p className="text-emerald-600 font-medium">{residentData.status}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FaCalendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Valid Until</h3>
              <p className="text-blue-600 font-medium">{residentData.expiryDate}</p>
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
              <p className="text-purple-600 font-medium">QR Code Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-blue-600 text-xs font-bold">i</span>
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-1">How to use your Digital ID</h4>
            <p className="text-blue-700 text-sm">
              Click on the ID card to view additional information on the back. You can download, share, or print your ID for official use. 
              The QR code allows for quick digital verification of your identity.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DigitalID
