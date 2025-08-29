import React, { useEffect } from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/solid';

const Toast = ({ 
  message, 
  type = 'info', 
  onClose, 
  duration = 5000,
  title = null,
  position = 'top-right',
  showProgress = true 
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getToastStyles = () => {
    const baseStyles = {
      success: {
        bg: 'bg-green-50',
        border: 'border border-green-200',
        text: 'text-green-800',
        icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
        progress: 'bg-green-500'
      },
      error: {
        bg: 'bg-red-50',
        border: 'border border-red-200',
        text: 'text-red-800',
        icon: <XCircleIcon className="h-5 w-5 text-red-500" />,
        progress: 'bg-red-500'
      },
      warning: {
        bg: 'bg-yellow-50',
        border: 'border border-yellow-200',
        text: 'text-yellow-800',
        icon: <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />,
        progress: 'bg-yellow-500'
      },
      info: {
        bg: 'bg-blue-50',
        border: 'border border-blue-200',
        text: 'text-blue-800',
        icon: <InformationCircleIcon className="h-5 w-5 text-blue-500" />,
        progress: 'bg-blue-500'
      }
    };

    return baseStyles[type] || baseStyles.info;
  };

  const getPositionStyles = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      default: 
        return 'top-4 right-4';
    }
  };

  const styles = getToastStyles();
  const positionStyles = getPositionStyles();

  return (
    <div className={`fixed ${positionStyles} z-50 max-w-sm w-full animate-slide-in`}>
      <div className={`${styles.bg} ${styles.border} rounded-lg shadow-lg overflow-hidden`}>

        {showProgress && duration > 0 && (
          <div className="w-full h-1 bg-gray-200">
            <div 
              className={`h-full ${styles.progress} animate-progress`}
              style={{ 
                animationDuration: `${duration}ms`,
                animationFillMode: 'forwards'
              }}
            />
          </div>
        )}
        
        <div className="p-4 flex items-start space-x-3">
          <div className="flex-shrink-0">
            {styles.icon}
          </div>
          
          <div className="flex-1 min-w-0">
            {title && (
              <h3 className={`text-sm font-semibold ${styles.text} mb-1`}>
                {title}
              </h3>
            )}
            <p className={`text-sm ${styles.text}`}>
              {message}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            aria-label="Close notification"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out forwards;
        }
        .animate-progress {
          animation: progress linear forwards;
        }
      `}</style>
    </div>
  );
};

export default Toast;