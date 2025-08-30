// Data cleanup utility for Brgy-Digital-ID system
// Helper functions to clean up localStorage and debug data issues

/**
 * Clean up all localStorage data for the application
 * This includes session data, notification data, and any other app-specific data
 */
export const cleanupAllAppData = () => {
  try {
    const keysToRemove = []
    
    // Scan all localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (
        key.startsWith('read_notifications_') ||
        key.startsWith('cleared_notifications_') ||
        key.startsWith('notification_last_cleanup_') ||
        key.startsWith('session_') ||
        key.startsWith('auth_')
      )) {
        keysToRemove.push(key)
      }
    }
    
    // Remove all identified keys
    keysToRemove.forEach(key => {
      localStorage.removeItem(key)
    })
    
    // Also clear sessionStorage
    sessionStorage.clear()
    
    return true
  } catch (error) {
    console.error('Error during data cleanup:', error)
    return false
  }
}

/**
 * Reset notification data for all users
 */
export const resetAllNotificationData = () => {
  try {
    const notificationKeys = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (
        key.startsWith('read_notifications_') ||
        key.startsWith('cleared_notifications_') ||
        key.startsWith('notification_last_cleanup_')
      )) {
        notificationKeys.push(key)
      }
    }
    
    notificationKeys.forEach(key => {
      localStorage.removeItem(key)
    })
    
    return true
  } catch (error) {
    console.error('Error resetting notification data:', error)
    return false
  }
}

/**
 * Debug all localStorage data
 */
export const debugAllLocalStorageData = () => {
  console.log('=== FULL LOCALSTORAGE DEBUG ===')
  
  try {
    const allData = {}
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        try {
          const value = localStorage.getItem(key)
          // Try to parse as JSON
          try {
            allData[key] = JSON.parse(value)
          } catch {
            allData[key] = value // Keep as string if not JSON
          }
        } catch (error) {
          allData[key] = `[ERROR: ${error.message}]`
        }
      }
    }
    
    console.log('All localStorage data:', allData)
    
    // Specifically look for notification data
    const notificationData = {}
    Object.keys(allData).forEach(key => {
      if (key.includes('notification') || key.includes('read_') || key.includes('cleared_')) {
        notificationData[key] = allData[key]
      }
    })
    
    console.log('Notification-specific data:', notificationData)
    
    return allData
  } catch (error) {
    console.error('Error debugging localStorage:', error)
    return null
  }
}

/**
 * Migrate old notification format to new format for a specific user
 */
export const migrateUserNotificationData = (userId) => {
  if (!userId) {
    console.error('User ID is required for migration')
    return false
  }
  
  try {
    const readKey = `read_notifications_${userId}`
    const clearedKey = `cleared_notifications_${userId}`
    
    let migrated = false
    
    // Migrate read notifications
    const readData = localStorage.getItem(readKey)
    if (readData) {
      try {
        const parsed = JSON.parse(readData)
        if (Array.isArray(parsed)) {
          const newStructure = {
            data: parsed,
            timestamp: Date.now(),
            userId: userId,
            migrated: true,
            version: '2.0'
          }
          localStorage.setItem(readKey, JSON.stringify(newStructure))
          migrated = true
        }
      } catch (error) {
        console.error('Error migrating read notifications:', error)
      }
    }
    
    // Migrate cleared notifications
    const clearedData = localStorage.getItem(clearedKey)
    if (clearedData) {
      try {
        const parsed = JSON.parse(clearedData)
        if (Array.isArray(parsed)) {
          const newStructure = {
            data: parsed,
            timestamp: Date.now(),
            userId: userId,
            migrated: true,
            version: '2.0'
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
    console.error('Error during notification migration:', error)
    return false
  }
}

// Expose cleanup functions to window for console debugging
if (typeof window !== 'undefined') {
  window.cleanupAllAppData = cleanupAllAppData
  window.resetAllNotificationData = resetAllNotificationData
  window.debugAllLocalStorageData = debugAllLocalStorageData
  window.migrateUserNotificationData = migrateUserNotificationData
}

export default {
  cleanupAllAppData,
  resetAllNotificationData,
  debugAllLocalStorageData,
  migrateUserNotificationData
}
