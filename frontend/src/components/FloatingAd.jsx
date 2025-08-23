"use client";

import { useState, useEffect } from 'react';
import GoogleAd from './GoogleAd';

const FloatingAd = ({ 
  position = 'bottom-right', 
  adSlot, 
  className = '',
  showCloseButton = true,
  autoHide = false,
  hideDelay = 5000 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Delay mounting to avoid immediate display
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 1000);

    // Auto hide after delay
    if (autoHide) {
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, hideDelay);

      return () => clearTimeout(hideTimer);
    }

    return () => clearTimeout(timer);
  }, [autoHide, hideDelay]);

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'center-left': 'top-1/2 left-4 transform -translate-y-1/2',
    'center-right': 'top-1/2 right-4 transform -translate-y-1/2',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };

  const sizeClasses = {
    'top-left': 'w-64 h-48',
    'top-right': 'w-64 h-48',
    'bottom-left': 'w-64 h-48',
    'bottom-right': 'w-64 h-48',
    'center-left': 'w-48 h-64',
    'center-right': 'w-48 h-64',
    'top-center': 'w-80 h-32',
    'bottom-center': 'w-80 h-32'
  };

  if (!isVisible || !isMounted) return null;

  return (
    <div 
      className={`fixed z-50 ${positionClasses[position]} ${sizeClasses[position]} ${className} transition-all duration-300 ease-in-out`}
      style={{
        animation: 'fadeInUp 0.5s ease-out'
      }}
    >
      <div className="relative bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
        {showCloseButton && (
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-2 right-2 z-10 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-red-600 transition-colors"
            aria-label="Close ad"
          >
            ×
          </button>
        )}
        
        <div className="w-full h-full">
          <GoogleAd 
            adSlot={adSlot}
            adFormat="auto"
            className="w-full h-full"
            style={{ minHeight: '100%' }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default FloatingAd;
