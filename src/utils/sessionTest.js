// Test file to verify session optimization
// Run this to check if excessive API calls are fixed

import SESSION_CONFIG from '../config/sessionConfig.js'

// Test the throttling configuration
console.log('Session Configuration Test:')
console.log('============================')
console.log('Session Timeout:', SESSION_CONFIG.SESSION_TIMEOUT / (60 * 1000), 'minutes')
console.log('Validation Cooldown:', SESSION_CONFIG.VALIDATION_COOLDOWN / 1000, 'seconds')
console.log('Activity Throttle:', SESSION_CONFIG.ACTIVITY_THROTTLE / 1000, 'seconds')
console.log('Throttling Enabled:', SESSION_CONFIG.ENABLE_THROTTLING)
console.log('Local Validation Enabled:', SESSION_CONFIG.ENABLE_LOCAL_VALIDATION)

// Function to simulate tab switching and measure API calls
let apiCallCount = 0
let startTime = Date.now()

// Mock the validation function to count calls
const mockValidateSession = () => {
  apiCallCount++
  console.log(`API Call #${apiCallCount} at ${Date.now() - startTime}ms`)
}

// Simulate rapid tab switching (this should be throttled)
console.log('\nSimulating rapid tab switching (should be throttled):')
console.log('======================================================')

// Reset counters
apiCallCount = 0
startTime = Date.now()

// Test throttling behavior
const testThrottling = () => {
  // Simulate 10 rapid visibility changes (alt-tab)
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      console.log(`Tab switch ${i + 1}`)
      // This would normally trigger session validation
      // With throttling, only the first call within cooldown period should execute
      mockValidateSession()
    }, i * 100) // 100ms apart - much faster than cooldown
  }
  
  // Check results after all attempts
  setTimeout(() => {
    console.log(`\nResults after 1 second:`)
    console.log(`Expected: 1 API call (throttled)`)
    console.log(`Actual: ${apiCallCount} API calls`)
    console.log(`Improvement: ${apiCallCount === 1 ? 'SUCCESS' : 'NEEDS ADJUSTMENT'}`)
  }, 1100)
}

// Run the test
testThrottling()

// Performance monitoring helper
export const monitorPerformance = () => {
  console.log('\nPerformance Monitoring Active')
  console.log('Open browser DevTools Network tab to see API calls')
  console.log('Try alt-tabbing between windows/tabs')
  console.log('API calls to appwrite.js should be limited to once per minute')
}

export default {
  testThrottling,
  monitorPerformance
}
