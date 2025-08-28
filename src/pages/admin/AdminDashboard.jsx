import React from 'react'
import { Link } from 'react-router-dom'
import { FaUsers, FaIdCard, FaCogs, FaChartBar, FaEye, FaCheck, FaClock, FaExclamationTriangle } from 'react-icons/fa'

const AdminDashboard = () => {
  const quickActions = [
    { 
      title: 'Manage Residents', 
      description: 'View and manage resident registrations',
      icon: FaUsers,
      link: '/admin/residents',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      count: '1,245'
    },
    { 
      title: 'Digital ID Management', 
      description: 'Generate and verify digital IDs',
      icon: FaIdCard,
      link: '/admin/digital-ids',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      count: '1,180'
    },
    { 
      title: 'Service Requests', 
      description: 'Process service applications',
      icon: FaCogs,
      link: '/admin/services',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      count: '67'
    }
  ]

  const recentActivities = [
    { 
      type: 'registration', 
      title: 'New Resident Registration', 
      description: 'Maria Santos submitted registration',
      status: 'pending', 
      date: '2025-08-21',
      time: '10:30 AM',
      icon: FaUsers,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    { 
      type: 'id-generated', 
      title: 'Digital ID Generated', 
      description: 'ID created for Juan Dela Cruz',
      status: 'completed', 
      date: '2025-08-21',
      time: '09:45 AM',
      icon: FaIdCard,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    { 
      type: 'service-approved', 
      title: 'Clearance Request Approved', 
      description: 'Barangay clearance for Ana Rodriguez',
      status: 'approved', 
      date: '2025-08-21',
      time: '09:15 AM',
      icon: FaCheck,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    { 
      type: 'system-alert', 
      title: 'System Maintenance', 
      description: 'Scheduled maintenance completed',
      status: 'info', 
      date: '2025-08-20',
      time: '11:00 PM',
      icon: FaCogs,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ]

  const systemStats = [
    {
      label: 'Total Residents',
      value: '1,245',
      change: '+12',
      changeType: 'increase',
      icon: FaUsers,
      color: 'blue'
    },
    {
      label: 'Active Digital IDs',
      value: '1,180',
      change: '+8',
      changeType: 'increase',
      icon: FaIdCard,
      color: 'green'
    },
    {
      label: 'Pending Requests',
      value: '23',
      change: '-5',
      changeType: 'decrease',
      icon: FaClock,
      color: 'yellow'
    },
    {
      label: 'System Uptime',
      value: '99.9%',
      change: '+0.1%',
      changeType: 'increase',
      icon: FaChartBar,
      color: 'purple'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-3">Welcome to Admin Dashboard</h1>
          <p className="text-emerald-100 text-lg">
            Manage the Barangay Delpilar Digital ID System efficiently and effectively.
          </p>
          <div className="mt-4 flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-emerald-100">System Online</span>
            </div>
            <div className="text-emerald-200">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
        
        {/* Floating decorative elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full animate-bounce"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
      </div>

      {/* System Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className={`text-sm font-medium ${
                stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <FaCogs className="w-5 h-5 mr-2 text-emerald-600" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="group relative bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`w-16 h-16 ${action.color} ${action.hoverColor} rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <action.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {action.description}
                  </p>
                  <div className="text-lg font-bold text-emerald-600 mt-2">
                    {action.count}
                  </div>
                </div>
              </div>
              
              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <FaEye className="w-5 h-5 mr-2 text-emerald-600" />
            Recent Activities
          </h2>
          <Link 
            to="/admin/activities" 
            className="text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors"
          >
            View All →
          </Link>
        </div>
        
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
              <div className={`w-10 h-10 ${activity.bgColor} rounded-xl flex items-center justify-center mr-4 flex-shrink-0`}>
                <activity.icon className={`w-5 h-5 ${activity.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{activity.title}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{activity.time}</span>
                    <span>•</span>
                    <span>{activity.date}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                <div className="flex items-center mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                    activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    activity.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

     
    </div>
  )
}

export default AdminDashboard
