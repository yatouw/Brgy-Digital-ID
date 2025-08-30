import React, { useState, useEffect } from 'react'
import { FaCheckCircle, FaTimes, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa'

// Toast notification component
const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLeaving(true)
      setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white border-green-600'
      case 'error':
        return 'bg-red-500 text-white border-red-600'
      case 'warning':
        return 'bg-yellow-500 text-white border-yellow-600'
      case 'info':
        return 'bg-blue-500 text-white border-blue-600'
      default:
        return 'bg-gray-500 text-white border-gray-600'
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="w-4 h-4" />
      case 'error':
        return <FaTimes className="w-4 h-4" />
      case 'warning':
        return <FaExclamationTriangle className="w-4 h-4" />
      case 'info':
        return <FaInfoCircle className="w-4 h-4" />
      default:
        return <FaInfoCircle className="w-4 h-4" />
    }
  }

  if (!isVisible) return null

  return (
    <div
      className={`fixed top-4 right-4 max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 z-50 transform transition-all duration-300 ${
        isLeaving ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      } ${getToastStyles()}`}
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsLeaving(true)
            setTimeout(() => {
              setIsVisible(false)
              onClose?.()
            }, 300)
          }}
          className="flex-shrink-0 text-white hover:text-gray-200 transition-colors"
        >
          <FaTimes className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}

// Toast container component
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 space-y-2 z-50 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  )
}

// Hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random()
    const newToast = { id, message, type, duration }
    
    setToasts(prev => [...prev, newToast])
    
    // Auto-remove after duration
    setTimeout(() => {
      removeToast(id)
    }, duration + 300) // Add 300ms for animation
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const showSuccess = (message, duration) => addToast(message, 'success', duration)
  const showError = (message, duration) => addToast(message, 'error', duration)
  const showWarning = (message, duration) => addToast(message, 'warning', duration)
  const showInfo = (message, duration) => addToast(message, 'info', duration)

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    ToastContainer
  }
}

export default Toast
