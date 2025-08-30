import React, { createContext, useContext, useState, useEffect } from 'react'
import { digitalIdService } from '../api/appwrite/appwrite'
import { useAuth } from './AuthContext'
import { 
  cleanupExpiredNotifications, 
  sortNotifications, 
  cleanupNotificationsOnStatusChange,
  validateNotification 
} from '../utils/notificationUtils'

// Create NotificationContext
const NotificationContext = createContext({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  clearNotification: () => {},
  markAllAsRead: () => {},
  clearAllNotifications: () => {},
  refreshNotifications: () => {}
})

// NotificationProvider component
export function NotificationProvider({ children }) {
  const { user, isAuthenticated, isAdmin } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [lastDigitalIdStatus, setLastDigitalIdStatus] = useState(null)

  // Get notification storage key for current user
  const getNotificationStorageKey = (userId) => `notifications_${userId}`
  const getReadNotificationsKey = (userId) => `read_notifications_${userId}`
  const getClearedNotificationsKey = (userId) => `cleared_notifications_${userId}`

  // Migrate old notification data format to new format
  const migrateNotificationData = (userId) => {
    try {
      const readKey = getReadNotificationsKey(userId)
      const clearedKey = getClearedNotificationsKey(userId)
      
      // Check if data needs migration
      const readData = localStorage.getItem(readKey)
      const clearedData = localStorage.getItem(clearedKey)
      
      let migrated = false
      
      if (readData) {
        try {
          const parsed = JSON.parse(readData)
          // If it's an array (old format), migrate it
          if (Array.isArray(parsed)) {
            const newStructure = {
              data: parsed,
              timestamp: Date.now(),
              userId: userId,
              migrated: true
            }
            localStorage.setItem(readKey, JSON.stringify(newStructure))
            migrated = true
          }
        } catch (error) {
          console.error('Error migrating read notifications:', error)
        }
      }
      
      if (clearedData) {
        try {
          const parsed = JSON.parse(clearedData)
          // If it's an array (old format), migrate it
          if (Array.isArray(parsed)) {
            const newStructure = {
              data: parsed,
              timestamp: Date.now(),
              userId: userId,
              migrated: true
            }
            localStorage.setItem(clearedKey, JSON.stringify(newStructure))
            migrated = true
          }
        } catch (error) {
          console.error('Error migrating cleared notifications:', error)
        }
      }
      
      return migrated
    } catch (error) {
      console.error('Error during notification data migration:', error)
      return false
    }
  }

  // Load persisted notification states
  const getPersistedNotificationStates = (userId) => {
    try {
      // First, try to migrate old data if necessary
      migrateNotificationData(userId)
      
      const readKey = getReadNotificationsKey(userId)
      const clearedKey = getClearedNotificationsKey(userId)
      
      // Get stored data with timestamp structure
      const readData = localStorage.getItem(readKey)
      const clearedData = localStorage.getItem(clearedKey)
      
      let readNotifications = []
      let clearedNotifications = []
      
      // Parse read notifications
      if (readData) {
        const parsedReadData = JSON.parse(readData)
        // Handle both old format (array) and new format (object with data and timestamp)
        if (Array.isArray(parsedReadData)) {
          readNotifications = parsedReadData
          // Auto-migrate this old format
          migrateNotificationData(userId)
        } else if (parsedReadData.data && Array.isArray(parsedReadData.data)) {
          readNotifications = parsedReadData.data
        }
      }
      
      // Parse cleared notifications
      if (clearedData) {
        const parsedClearedData = JSON.parse(clearedData)
        // Handle both old format (array) and new format (object with data and timestamp)
        if (Array.isArray(parsedClearedData)) {
          clearedNotifications = parsedClearedData
          // Auto-migrate this old format
          migrateNotificationData(userId)
        } else if (parsedClearedData.data && Array.isArray(parsedClearedData.data)) {
          clearedNotifications = parsedClearedData.data
        }
      }
      
      return { readNotifications, clearedNotifications }
    } catch (error) {
      console.error('Error loading persisted notification states:', error)
      return { readNotifications: [], clearedNotifications: [] }
    }
  }

  // Save notification state to localStorage with timestamp
  const saveNotificationState = (userId, readNotifications, clearedNotifications) => {
    try {
      const readKey = getReadNotificationsKey(userId)
      const clearedKey = getClearedNotificationsKey(userId)
      const timestamp = Date.now()
      
      // Store with timestamp metadata
      const readDataStructure = {
        data: readNotifications,
        timestamp: timestamp,
        userId: userId
      }
      
      const clearedDataStructure = {
        data: clearedNotifications,
        timestamp: timestamp,
        userId: userId
      }
      
      localStorage.setItem(readKey, JSON.stringify(readDataStructure))
      localStorage.setItem(clearedKey, JSON.stringify(clearedDataStructure))
      
    } catch (error) {
      console.error('Error saving notification state:', error)
    }
  }

  // Load notifications when user changes
  useEffect(() => {
    if (isAuthenticated && !isAdmin && user?.id) {
      // Cleanup expired notifications periodically
      cleanupExpiredNotifications(user.id)
      loadNotifications()
    } else {
      setNotifications([])
      setUnreadCount(0)
      setLastDigitalIdStatus(null)
      // Don't clean up notification states when user logs out - keep them for next login
    }
  }, [isAuthenticated, isAdmin, user?.id])

  // Cleanup old notification states (older than 30 days)
  const cleanupOldNotificationStates = () => {
    try {
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
      
      // Get all localStorage keys related to notifications
      const keysToCheck = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (key.startsWith('notifications_') || key.startsWith('read_notifications_') || key.startsWith('cleared_notifications_'))) {
          keysToCheck.push(key)
        }
      }
      
      // Check each key's timestamp and remove if old
      keysToCheck.forEach(key => {
        try {
          const item = localStorage.getItem(key)
          if (item) {
            const parsed = JSON.parse(item)
            // Check if it has a timestamp field, if not, remove it (legacy)
            if (!parsed.timestamp || parsed.timestamp < thirtyDaysAgo) {
              localStorage.removeItem(key)
            }
          }
        } catch (error) {
          // If parsing fails, remove the corrupted item
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error('Error cleaning up old notification states:', error)
    }
  }

  // Load user notifications
  const loadNotifications = async () => {
    try {
      if (!user?.id) return
      
      // Get persisted notification states
      const { readNotifications, clearedNotifications } = getPersistedNotificationStates(user.id)
      
      // Get user's digital ID to check for notifications
      const digitalId = await digitalIdService.getDigitalIdByUserId(user.id)
      
      const newNotifications = []
      
      if (digitalId) {
        // Store the current status for next time comparison
        const currentStatus = digitalId.status
        
        // Check for rejection notification
        if (digitalId.status === 'rejected' && digitalId.rejectionReason) {
          const rejectionNotificationId = `rejection-${digitalId.$id}`
          
          // Only add if not cleared
          if (!clearedNotifications.includes(rejectionNotificationId)) {
            const rejectionNotification = {
              id: rejectionNotificationId,
              type: 'rejection',
              title: 'ID Verification Rejected',
              message: digitalId.rejectionReason,
              timestamp: digitalId.updatedAt || digitalId.createdAt,
              read: readNotifications.includes(rejectionNotificationId),
              digitalIdData: digitalId
            }
            newNotifications.push(rejectionNotification)
          } else {
            // Notification already cleared
          }
        }
        
        // Check for approval notification
        if (digitalId.status === 'active' && digitalId.verifiedDate) {
          // Only show approval notification if it's recent (within last 7 days)
          const verifiedDate = new Date(digitalId.verifiedDate)
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          
          if (verifiedDate > weekAgo) {
            const approvalNotificationId = `approval-${digitalId.$id}`
            
            // Only add if not cleared
            if (!clearedNotifications.includes(approvalNotificationId)) {
              const approvalNotification = {
                id: approvalNotificationId,
                type: 'approval',
                title: 'ID Verification Approved',
                message: 'Your digital ID has been approved and is now active. You can now use it for official transactions.',
                timestamp: digitalId.verifiedDate,
                read: readNotifications.includes(approvalNotificationId),
                digitalIdData: digitalId
              }
              newNotifications.push(approvalNotification)
            } else {
              // Approval notification already cleared
            }
          }
        }
        
        // Check for pending verification reminder
        if (digitalId.status === 'pending_verification') {
          const requestDate = new Date(digitalId.verificationRequestDate || digitalId.createdAt)
          const threeDaysAgo = new Date()
          threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
          
          // Show reminder if pending for more than 3 days
          if (requestDate < threeDaysAgo) {
            const reminderNotificationId = `pending-${digitalId.$id}`
            
            // Only add if not cleared
            if (!clearedNotifications.includes(reminderNotificationId)) {
              const reminderNotification = {
                id: reminderNotificationId,
                type: 'reminder',
                title: 'Verification Pending',
                message: 'Your ID verification request is still being reviewed by the administrator. Please be patient.',
                timestamp: digitalId.verificationRequestDate || digitalId.createdAt,
                read: readNotifications.includes(reminderNotificationId),
                digitalIdData: digitalId
              }
              newNotifications.push(reminderNotification)
            } else {
              // Reminder notification already cleared
            }
          }
        }
        
        // Check for status changes and auto-clear notifications
        if (lastDigitalIdStatus && currentStatus !== lastDigitalIdStatus && lastDigitalIdStatus !== null) {
          cleanupNotificationsOnStatusChange(user.id, digitalId, lastDigitalIdStatus)
          
          // Reload the persisted states after cleanup
          const { readNotifications: updatedRead, clearedNotifications: updatedCleared } = getPersistedNotificationStates(user.id)
          
          // Re-filter notifications based on updated cleared list
          const filteredNotifications = newNotifications.filter(notification => 
            !updatedCleared.includes(notification.id)
          )
          
          // Update read status for remaining notifications
          filteredNotifications.forEach(notification => {
            notification.read = updatedRead.includes(notification.id)
          })
          
          // Use filtered notifications
          const sortedFilteredNotifications = sortNotifications(filteredNotifications)
          setNotifications(sortedFilteredNotifications)
          
          // Calculate unread count for filtered notifications
          const unread = sortedFilteredNotifications.filter(n => !n.read).length
          setUnreadCount(unread)
          
          setLastDigitalIdStatus(currentStatus)
          
          return
        }
        
        setLastDigitalIdStatus(currentStatus)
      }
      
      // Sort notifications by priority and timestamp
      const sortedNotifications = sortNotifications(newNotifications)
      setNotifications(sortedNotifications)
      
      // Calculate unread count
      const unread = sortedNotifications.filter(n => !n.read).length
      setUnreadCount(unread)
      
    } catch (error) {
      console.error('Error loading notifications:', error)
      setNotifications([])
      setUnreadCount(0)
    }
  }

  // Mark notification as read
  const markAsRead = (notificationId) => {
    if (!user?.id) return
    
    // Update local state first
    setNotifications(prev => {
      const updatedNotifications = prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
      return updatedNotifications
    })
    
    // Update unread count
    setUnreadCount(prev => Math.max(0, prev - 1))
    
    // Persist to localStorage
    try {
      const { readNotifications, clearedNotifications } = getPersistedNotificationStates(user.id)
      
      if (!readNotifications.includes(notificationId)) {
        const updatedReadNotifications = [...readNotifications, notificationId]
        saveNotificationState(user.id, updatedReadNotifications, clearedNotifications)
      }
    } catch (error) {
      console.error('Error persisting read state:', error)
    }
  }

  // Clear notification
  const clearNotification = (notificationId) => {
    if (!user?.id) return
    
    // Update local state
    setNotifications(prev => {
      const notification = prev.find(n => n.id === notificationId)
      const filteredNotifications = prev.filter(n => n.id !== notificationId)
      
      // Update unread count if the cleared notification was unread
      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1))
      }
      
      return filteredNotifications
    })
    
    // Persist to localStorage
    try {
      const { readNotifications, clearedNotifications } = getPersistedNotificationStates(user.id)
      
      if (!clearedNotifications.includes(notificationId)) {
        const updatedClearedNotifications = [...clearedNotifications, notificationId]
        const updatedReadNotifications = readNotifications.filter(id => id !== notificationId)
        saveNotificationState(user.id, updatedReadNotifications, updatedClearedNotifications)
      }
    } catch (error) {
      console.error('Error persisting cleared state:', error)
    }
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    if (!user?.id) return
    
    // Update local state
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
    setUnreadCount(0)
    
    // Persist to localStorage
    const { clearedNotifications } = getPersistedNotificationStates(user.id)
    const allNotificationIds = notifications.map(n => n.id)
    saveNotificationState(user.id, allNotificationIds, clearedNotifications)
  }

  // Clear all notifications
  const clearAllNotifications = () => {
    if (!user?.id) return
    
    // Update local state
    setNotifications([])
    setUnreadCount(0)
    
    // Persist to localStorage
    const allNotificationIds = notifications.map(n => n.id)
    saveNotificationState(user.id, [], allNotificationIds)
  }

  // Force clear all notification data (for debugging/reset)
  const forceCleanup = () => {
    if (!user?.id) return
    
    try {
      const keys = [
        getReadNotificationsKey(user.id),
        getClearedNotificationsKey(user.id),
        `notification_last_cleanup_${user.id}`
      ]
      
      keys.forEach(key => {
        localStorage.removeItem(key)
      })
      
      // Reset local state
      setNotifications([])
      setUnreadCount(0)
      setLastDigitalIdStatus(null)
      
      // Reload notifications after cleanup
      setTimeout(() => {
        loadNotifications()
      }, 100)
      
    } catch (error) {
      console.error('Error during force cleanup:', error)
    }
  }

  // Refresh notifications
  const refreshNotifications = () => {
    if (isAuthenticated && !isAdmin && user?.id) {
      loadNotifications()
    }
  }

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    clearNotification,
    markAllAsRead,
    clearAllNotifications,
    refreshNotifications
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

// Custom hook to use notification context
export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    // If used outside of provider, return a fallback object instead of throwing
    console.warn('useNotifications must be used within a NotificationProvider. Using fallback values.')
    return {
      notifications: [],
      unreadCount: 0,
      markAsRead: () => {},
      clearNotification: () => {},
      markAllAsRead: () => {},
      clearAllNotifications: () => {},
      refreshNotifications: () => {}
    }
  }
  return context
}
