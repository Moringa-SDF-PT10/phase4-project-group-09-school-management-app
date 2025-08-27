import React, { useEffect } from 'react'

const Toast = ({ message, type, onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500'
  const icon = type === 'success' ? '✓' : '✕'

  return (
    <div className={`toast ${type} ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2`}>
      <span className="text-lg font-bold">{icon}</span>
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-white hover:text-gray-200 text-xl font-bold"
      >
        ×
      </button>
    </div>
  )
}

export default Toast