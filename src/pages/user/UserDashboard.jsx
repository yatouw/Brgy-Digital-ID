import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useNotifications } from '../../contexts/NotificationContext'

const UserDashboard = () => {
  const { user } = useAuth()
  const { notifications, unreadCount, forceCleanup } = useNotifications()
  
  const quickActions = [
    { 
      title: 'View Digital ID', 
      description: 'Access your digital identification',
      icon: '🆔',
      link: '/user/digital-id',
      color: 'bg-blue-500'
    },
    { 
      title: 'Apply for Clearance', 
      description: 'Request barangay clearance',
      icon: '📋',
      link: '/user/services',
      color: 'bg-green-500'
    },
    { 
      title: 'Health Records', 
      description: 'View your health information',
      icon: '🏥',
      link: '/user/services',
      color: 'bg-red-500'
    },
    { 
      title: 'Financial Aid', 
      description: 'Apply for assistance programs',
      icon: '💰',
      link: '/user/services',
      color: 'bg-yellow-500'
    }
  ]

  const recentActivities = [
    { 
      type: 'clearance', 
      title: 'Barangay Clearance Application', 
      status: 'approved', 
      date: '2025-05-25',
      icon: '✅'
    },
    { 
      type: 'profile', 
      title: 'Profile Information Updated', 
      status: 'completed', 
      date: '2025-05-20',
      icon: '📝'
    },
    { 
      type: 'health', 
      title: 'Health Record Accessed', 
      status: 'viewed', 
      date: '2025-05-18',
      icon: '👁️'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, Juan!</h1>
        <p className="text-blue-100">
          Your digital ID is active and ready to use. Manage your services and profile from this dashboard.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">🆔</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Digital ID</p>
              <p className="text-2xl font-bold text-gray-900">Active</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-xl">📋</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Applications</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600 text-xl">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
          </div>
        </div>


      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="group p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <span className="text-white text-xl">{action.icon}</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">{activity.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.date}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activity.status === 'approved' ? 'bg-green-100 text-green-800' :
                  activity.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800">
            View all activities →
          </button>
        </div>

        {/* Announcements */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Barangay Announcements</h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-1">Community Meeting</h3>
              <p className="text-sm text-blue-700 mb-2">
                Monthly barangay assembly on May 30, 2025 at 2:00 PM
              </p>
              <span className="text-xs text-blue-600">Posted 2 days ago</span>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-900 mb-1">Health Program</h3>
              <p className="text-sm text-green-700 mb-2">
                Free health check-up program starting June 1, 2025
              </p>
              <span className="text-xs text-green-600">Posted 5 days ago</span>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-medium text-yellow-900 mb-1">System Maintenance</h3>
              <p className="text-sm text-yellow-700 mb-2">
                Digital ID system will be down for maintenance on June 5, 2025
              </p>
              <span className="text-xs text-yellow-600">Posted 1 week ago</span>
            </div>
          </div>
          <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800">
            View all announcements →
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
