import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppWithSessionManager from './components/AppWithSessionManager.jsx'
import { AuthProvider } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'

// Import debug utilities for development
if (process.env.NODE_ENV === 'development') {
  import('./utils/dataCleanup.js')
  import('./utils/notificationUtils.js')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <AppWithSessionManager />
      </NotificationProvider>
    </AuthProvider>
  </StrictMode>,
)
