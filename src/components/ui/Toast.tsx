'use client';

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle, faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, type, title, message, duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrada animation
    const showTimer = setTimeout(() => setIsVisible(true), 10);
    
    // Auto dismiss
    const dismissTimer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => onClose(id), 300); // Wait for exit animation
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(dismissTimer);
    };
  }, [id, duration, onClose]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => onClose(id), 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return faCheckCircle;
      case 'error':
        return faExclamationTriangle;
      case 'warning':
        return faExclamationTriangle;
      case 'info':
        return faInfoCircle;
      default:
        return faInfoCircle;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 text-green-900';
      case 'error':
        return 'bg-gradient-to-r from-red-50 to-rose-50 border-red-300 text-red-900';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300 text-yellow-900';
      case 'info':
        return 'bg-gradient-to-r from-blue-50 to-sky-50 border-blue-300 text-blue-900';
      default:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-300 text-gray-900';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      case 'info':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div 
      className={`
        max-w-sm w-full ${getColorClasses()} 
        border rounded-xl shadow-xl backdrop-blur-sm
        p-4 mb-3 
        transform transition-all duration-300 ease-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}
        ${isLeaving ? 'translate-x-full opacity-0 scale-95' : ''}
        hover:shadow-2xl hover:scale-105
      `}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="p-1 rounded-full bg-white/20">
            <FontAwesomeIcon icon={getIcon()} className={`h-5 w-5 ${getIconColor()}`} />
          </div>
        </div>
        <div className="ml-3 w-0 flex-1">
          {title && (
            <p className="text-sm font-semibold leading-tight">
              {title}
            </p>
          )}
          <p className={`text-sm leading-relaxed ${title ? 'mt-1' : ''} opacity-90`}>
            {message}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            className="
              inline-flex items-center justify-center
              w-6 h-6 rounded-full
              text-gray-500 hover:text-gray-700 hover:bg-white/30
              focus:outline-none focus:ring-2 focus:ring-white/50
              transition-all duration-200 ease-in-out
              transform hover:scale-110
            "
            onClick={handleClose}
          >
            <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;