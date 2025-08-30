// Notification utility functions
// Helper functions for managing notification persistence and cleanup

export const NOTIFICATION_TYPES = {
  REJECTION: 'rejection',
  APPROVAL: 'approval',
  REMINDER: 'reminder',
  INFO: 'info'
}

export const NOTIFICATION_STORAGE_KEYS = {
  READ: 'read_notifications',
  CLEARED: 'cleared_notifications',
  LAST_CLEANUP: 'notification_last_cleanup'
}

// Generate notification storage key for user
export const getNotificationStorageKey = (userId, type) => {
  return `${type}_${userId}`
}

// Check if notification should be auto-cleared based on status change
export const shouldClearNotificationOnStatusChange = (notification, newDigitalIdStatus) => {
  // Clear rejection notifications when ID is approved
  if (notification.type === NOTIFICATION_TYPES.REJECTION && newDigitalIdStatus === 'active') {
    return true
  }
  
  // Clear pending reminders when ID is approved or rejected
  if (notification.type === NOTIFICATION_TYPES.REMINDER && 
      (newDigitalIdStatus === 'active' || newDigitalIdStatus === 'rejected')) {
    return true
  }
  
  // Clear old approval notifications when ID is rejected
  if (notification.type === NOTIFICATION_TYPES.APPROVAL && newDigitalIdStatus === 'rejected') {
    return true
  }
  
  return false
}

// Clean up notifications based on digital ID status changes
export const cleanupNotificationsOnStatusChange = (userId, digitalId, previousStatus) => {
  if (!userId || !digitalId || digitalId.status === previousStatus) {
    return
  }
  
  try {
    const readStorageKey = `read_notifications_${userId}`
    const clearedStorageKey = `cleared_notifications_${userId}`
    
    // Get current data with timestamp structure support
    const readData = localStorage.getItem(readStorageKey)
    const clearedData = localStorage.getItem(clearedStorageKey)
    
    let readNotifications = []
    let clearedNotifications = []
    
    // Parse read notifications
    if (readData) {
      const parsedReadData = JSON.parse(readData)
      if (Array.isArray(parsedReadData)) {
        readNotifications = parsedReadData
      } else if (parsedReadData.data && Array.isArray(parsedReadData.data)) {
        readNotifications = parsedReadData.data
      }
    }
    
    // Parse cleared notifications
    if (clearedData) {
      const parsedClearedData = JSON.parse(clearedData)
      if (Array.isArray(parsedClearedData)) {
        clearedNotifications = parsedClearedData
      } else if (parsedClearedData.data && Array.isArray(parsedClearedData.data)) {
        clearedNotifications = parsedClearedData.data
      }
    }
    
    // Determine which notifications to auto-clear
    const notificationsToAutoClear = []
    
    // Check different notification types that might need clearing
    const rejectionId = `rejection-${digitalId.$id}`
    const approvalId = `approval-${digitalId.$id}`
    const reminderId = `pending-${digitalId.$id}`
    
    // Auto-clear based on status change
    if (digitalId.status === 'active') {
      // Clear rejection and reminder notifications when approved
      notificationsToAutoClear.push(rejectionId, reminderId)
    } else if (digitalId.status === 'rejected') {
      // Clear approval and reminder notifications when rejected
      notificationsToAutoClear.push(approvalId, reminderId)
    }
    
    // Add to cleared notifications
    const updatedClearedNotifications = [...new Set([...clearedNotifications, ...notificationsToAutoClear])]
    
    // Remove from read notifications (since they're now cleared)
    const updatedReadNotifications = readNotifications.filter(id => !notificationsToAutoClear.includes(id))
    
    // Save with timestamp structure
    const timestamp = Date.now()
    
    const readDataStructure = {
      data: updatedReadNotifications,
      timestamp: timestamp,
      userId: userId
    }
    
    const clearedDataStructure = {
      data: updatedClearedNotifications,
      timestamp: timestamp,
      userId: userId
    }
    
    localStorage.setItem(readStorageKey, JSON.stringify(readDataStructure))
    localStorage.setItem(clearedStorageKey, JSON.stringify(clearedDataStructure))
    
  } catch (error) {
    console.error('Error cleaning up notifications on status change:', error)
  }
}

// Cleanup expired notifications
export const cleanupExpiredNotifications = (userId, maxAgeDays = 30) => {
  try {
    const lastCleanupKey = `notification_last_cleanup_${userId}`
    const lastCleanupData = localStorage.getItem(lastCleanupKey)
    const now = Date.now()
    const oneDayAgo = 24 * 60 * 60 * 1000
    
    let lastCleanup = 0
    if (lastCleanupData) {
      try {
        const parsed = JSON.parse(lastCleanupData)
        lastCleanup = parsed.timestamp || parseInt(lastCleanupData)
      } catch {
        lastCleanup = parseInt(lastCleanupData) || 0
      }
    }
    
    // Only cleanup once per day per user
    if (lastCleanup && (now - lastCleanup) < oneDayAgo) {
      return
    }
    
    const maxAge = maxAgeDays * 24 * 60 * 60 * 1000
    const cutoffTime = now - maxAge
    
    // Clean up very old notification data
    const readStorageKey = `read_notifications_${userId}`
    const clearedStorageKey = `cleared_notifications_${userId}`
    
    [readStorageKey, clearedStorageKey].forEach(storageKey => {
      try {
        const data = localStorage.getItem(storageKey)
        if (data) {
          const parsed = JSON.parse(data)
          // If it has a timestamp and it's very old, clean it up
          if (parsed.timestamp && parsed.timestamp < cutoffTime) {
            localStorage.removeItem(storageKey)
          }
        }
      } catch (error) {
        console.error('Error during cleanup of key:', storageKey, error)
      }
    })
    
    // Mark cleanup as done with new structure
    const cleanupRecord = {
      timestamp: now,
      userId: userId,
      version: '2.0'
    }
    localStorage.setItem(lastCleanupKey, JSON.stringify(cleanupRecord))
    
  } catch (error) {
    console.error('Error cleaning up expired notifications:', error)
  }
}

// Get notification priority for sorting
export const getNotificationPriority = (notification) => {
  switch (notification.type) {
    case NOTIFICATION_TYPES.REJECTION:
      return 1 // Highest priority
    case NOTIFICATION_TYPES.APPROVAL:
      return 2
    case NOTIFICATION_TYPES.REMINDER:
      return 3
    case NOTIFICATION_TYPES.INFO:
      return 4
    default:
      return 5 // Lowest priority
  }
}

// Sort notifications by priority and timestamp
export const sortNotifications = (notifications) => {
  return [...notifications].sort((a, b) => {
    // First sort by read status (unread first)
    if (a.read !== b.read) {
      return a.read ? 1 : -1
    }
    
    // Then by priority
    const priorityDiff = getNotificationPriority(a) - getNotificationPriority(b)
    if (priorityDiff !== 0) {
      return priorityDiff
    }
    
    // Finally by timestamp (newest first)
    return new Date(b.timestamp) - new Date(a.timestamp)
  })
}

// Format notification timestamp for display
export const formatNotificationTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInMs = now - date
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInMinutes < 1) {
    return 'Just now'
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`
  } else if (diffInDays < 7) {
    return `${diffInDays}d ago`
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }
}

// Validate notification data
export const validateNotification = (notification) => {
  if (!notification || typeof notification !== 'object') {
    return false
  }
  
  const requiredFields = ['id', 'type', 'title', 'message', 'timestamp']
  return requiredFields.every(field => notification.hasOwnProperty(field) && notification[field] !== null)
}

// Clear all notification data for a user
export const clearAllUserNotificationData = (userId) => {
  if (!userId) return
  
  try {
    const keys = [
      `read_notifications_${userId}`,
      `cleared_notifications_${userId}`,
      `notification_last_cleanup_${userId}`
    ]
    
    keys.forEach(key => {
      localStorage.removeItem(key)
    })
    
    return true
  } catch (error) {
    console.error('Error clearing user notification data:', error)
    return false
  }
}
