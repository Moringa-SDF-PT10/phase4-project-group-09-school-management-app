import React, { useEffect } from 'react'

const Toast = ({ message, type, onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const styles = {
    success: {
      bg: 'bg-green-500',
      border: 'border-l-4 border-green-600',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    error: {
      bg: 'bg-red-500',
      border: 'border-l-4 border-red-600',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    }
  }

  const { bg, border, icon } = styles[type] || styles.success

  return (
    <div className={`
      fixed top-4 right-4 z-50 max-w-sm
      ${bg} ${border} text-white px-4 py-3 rounded-r-lg shadow-xl
      flex items-center space-x-3 transform transition-all duration-300
      animate-in slide-in-from-right-8 fade-in-90
    `}>
      <div className="flex-shrink-0">
        {icon}
      </div>
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-white hover:text-gray-200 transition-colors duration-200
                   focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded"
        aria-label="Close toast"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export default Toast