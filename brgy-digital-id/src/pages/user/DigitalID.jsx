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
    idNumber: "EBRGY-2024-001234",
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
            className={`relative w-96 h-60 transition-transform duration-700 transform-style-3d cursor-pointer ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Front Side */}
            <div className="absolute inset-0 w-full h-full backface-hidden">
              <div className="w-full h-full bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 rounded-2xl shadow-2xl overflow-hidden relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 left-4 w-32 h-32 border-4 border-white rounded-full"></div>
                  <div className="absolute bottom-4 right-4 w-24 h-24 border-4 border-white rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-white rounded-full opacity-50"></div>
                </div>

                {/* Header */}
                <div className="relative z-10 bg-white/10 backdrop-blur-sm px-4 py-3 border-b border-white/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img 
                        src="/src/assets/ebrgy-logo2.png" 
                        alt="eBrgy Logo" 
                        className="w-8 h-8 object-contain"
                      />
                      <div>
                        <h3 className="text-white font-bold text-sm">eBrgy Digital ID</h3>
                        <p className="text-emerald-100 text-xs">Republic of the Philippines</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white text-xs font-medium">ID No.</div>
                      <div className="text-emerald-100 text-xs font-mono">{residentData.idNumber}</div>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="relative z-10 p-4 flex space-x-4">
                  {/* Photo */}
                  <div className="flex-shrink-0">
                    <img 
                      src={residentData.photo} 
                      alt="Profile" 
                      className="w-20 h-24 object-cover rounded-lg border-2 border-white/30 shadow-lg"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 text-white">
                    <h2 className="font-bold text-lg leading-tight mb-1">{residentData.fullName}</h2>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="w-3 h-3 mr-2 text-emerald-200" />
                        <span className="text-emerald-100 text-xs leading-tight">{residentData.address}</span>
                      </div>
                      <div className="flex items-center">
                        <FaCalendar className="w-3 h-3 mr-2 text-emerald-200" />
                        <span className="text-emerald-100 text-xs">Born: {residentData.birthDate}</span>
                      </div>
                      <div className="flex space-x-4 text-xs">
                        <span className="text-emerald-100">Age: {residentData.age}</span>
                        <span className="text-emerald-100">Gender: {residentData.gender}</span>
                        <span className="text-emerald-100">Blood: {residentData.bloodType}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm px-4 py-2 border-t border-white/20">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <FaShieldAlt className="w-3 h-3 mr-1 text-emerald-200" />
                        <span className="text-emerald-100">Status: {residentData.status}</span>
                      </div>
                      <span className="text-emerald-100">Valid until: {residentData.expiryDate}</span>
                    </div>
                    <div className="text-emerald-100">Click to flip →</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Side */}
            <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
              <div className="w-full h-full bg-gradient-to-br from-slate-100 to-gray-200 rounded-2xl shadow-2xl overflow-hidden relative border border-gray-300">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-4 right-4 w-32 h-32 border-2 border-gray-400 rounded-full"></div>
                  <div className="absolute bottom-4 left-4 w-24 h-24 border-2 border-gray-400 rounded-full"></div>
                </div>

                {/* Header */}
                <div className="relative z-10 bg-emerald-600 px-4 py-3 text-white">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm">Additional Information</h3>
                    <FaQrcode className="w-5 h-5" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="text-gray-500 text-xs font-medium">Civil Status</label>
                      <p className="text-gray-900 font-medium">{residentData.civilStatus}</p>
                    </div>
                    <div>
                      <label className="text-gray-500 text-xs font-medium">Occupation</label>
                      <p className="text-gray-900 font-medium">{residentData.occupation}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <FaPhone className="w-3 h-3 mr-2 text-emerald-600" />
                      <span className="text-gray-700">{residentData.contactNumber}</span>
                    </div>
                    <div className="flex items-center">
                      <FaEnvelope className="w-3 h-3 mr-2 text-emerald-600" />
                      <span className="text-gray-700 text-xs">{residentData.email}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-300 pt-3">
                    <label className="text-gray-500 text-xs font-medium">Emergency Contact</label>
                    <p className="text-gray-900 text-sm">{residentData.emergencyContact}</p>
                  </div>

                  {/* QR Code */}
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                      <FaQrcode className="w-12 h-12 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 bg-gray-100 px-4 py-2 border-t border-gray-300">
                  <div className="flex justify-between items-center text-xs text-gray-600">
                    <span>Issued: {residentData.issuedDate}</span>
                    <span>← Click to flip back</span>
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
