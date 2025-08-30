import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaBell, FaTimes, FaExclamationTriangle, FaCheckCircle, FaClock, FaEye } from 'react-icons/fa'
import { useNotifications } from '../contexts/NotificationContext'
import { formatNotificationTime } from '../utils/notificationUtils'

const NotificationDropdown = () => {
  const notificationContext = useNotifications()
  
  // Handle case where context is not available
  if (!notificationContext) {
    return (
      <div className="relative">
        <button className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-300 transform hover:scale-110 active:scale-95">
          <FaBell className="w-5 h-5" />
        </button>
      </div>
    )
  }
  
  const { notifications, unreadCount, markAsRead, clearNotification, markAllAsRead, clearAllNotifications, forceCleanup } = notificationContext
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'rejection':
        return <FaExclamationTriangle className="w-4 h-4 text-red-500" />
      case 'approval':
        return <FaCheckCircle className="w-4 h-4 text-green-500" />
      case 'reminder':
        return <FaClock className="w-4 h-4 text-yellow-500" />
      default:
        return <FaBell className="w-4 h-4 text-blue-500" />
    }
  }

  // Get notification background color based on type
  const getNotificationBg = (type, read) => {
    if (read) {
      return 'bg-gray-50 opacity-75'
    }
    
    switch (type) {
      case 'rejection':
        return 'bg-red-50 border-l-4 border-red-500'
      case 'approval':
        return 'bg-green-50 border-l-4 border-green-500'
      case 'reminder':
        return 'bg-yellow-50 border-l-4 border-yellow-500'
      default:
        return 'bg-blue-50 border-l-4 border-blue-500'
    }
  }

  // Format timestamp - now using utility function
  const formatTimestamp = (timestamp) => {
    return formatNotificationTime(timestamp)
  }

  // Handle notification click
  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
  }

  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    markAllAsRead()
  }

  // Handle clear all notifications
  const handleClearAllNotifications = () => {
    clearAllNotifications()
    setIsOpen(false)
  }

  // Handle single notification clear
  const handleClearNotification = (notificationId, e) => {
    e.stopPropagation()
    clearNotification(notificationId)
  }

  // Handle single notification mark as read
  const handleMarkAsRead = (notificationId, e) => {
    e.stopPropagation()
    markAsRead(notificationId)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-300 transform hover:scale-110 active:scale-95"
      >
        <FaBell className="w-5 h-5" />
        
        {/* Notification Badge */}
        {unreadCount > 0 && (
          <>
            <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1 border-2 border-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full animate-ping"></span>
          </>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                  {unreadCount} new
                </span>
              )}
              {notifications.length > 0 && (
                <div className="flex items-center space-x-1">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      title="Mark all as read"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={handleClearAllNotifications}
                    className="text-xs text-gray-500 hover:text-red-600 font-medium transition-colors ml-2"
                    title="Clear all notifications"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <FaBell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              <div className="py-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer group ${getNotificationBg(notification.type, notification.read)}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1 relative">
                        {getNotificationIcon(notification.type)}
                        {/* Unread indicator dot */}
                        {!notification.read && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className={`text-sm font-medium flex items-center ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                              {notification.title}
                              {!notification.read && (
                                <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                              )}
                            </h4>
                            <p className={`text-sm mt-1 ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {formatTimestamp(notification.timestamp)}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!notification.read && (
                              <button
                                onClick={(e) => handleMarkAsRead(notification.id, e)}
                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                title="Mark as read"
                              >
                                <FaEye className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              onClick={(e) => handleClearNotification(notification.id, e)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="Remove notification"
                            >
                              <FaTimes className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Quick Action for Rejected IDs */}
                        {notification.type === 'rejection' && (
                          <div className="mt-2">
                            <Link
                              to="/user/digital-id"
                              className="inline-flex items-center text-xs bg-red-100 text-red-700 px-2 py-1 rounded-md hover:bg-red-200 transition-colors"
                              onClick={() => setIsOpen(false)}
                            >
                              View Digital ID
                            </Link>
                          </div>
                        )}

                        {/* Quick Action for Approved IDs */}
                        {notification.type === 'approval' && (
                          <div className="mt-2">
                            <Link
                              to="/user/digital-id"
                              className="inline-flex items-center text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md hover:bg-green-200 transition-colors"
                              onClick={() => setIsOpen(false)}
                            >
                              View Active ID
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
              <Link
                to="/user/digital-id"
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                View Digital ID →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationDropdown
