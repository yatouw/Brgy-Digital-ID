import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppWithSessionManager from './components/AppWithSessionManager.jsx'
import { AuthProvider } from './contexts/AuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AppWithSessionManager />
    </AuthProvider>
  </StrictMode>,
)
