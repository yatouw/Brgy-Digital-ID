import React from 'react'
import App from '../App'
import useSessionCleanup from '../utils/useSessionCleanup'

const AppWithSessionManager = () => {
  // Initialize session cleanup hooks
  useSessionCleanup()

  return <App />
}

export default AppWithSessionManager
