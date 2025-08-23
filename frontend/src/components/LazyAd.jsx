"use client";

import { useState, useEffect, useRef } from 'react';
import GoogleAd from './GoogleAd';

const LazyAd = ({ adSlot, adFormat = 'auto', className = '', threshold = 0.1, style = {} }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const adRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasIntersected) {
            setIsVisible(true);
            setHasIntersected(true);
            // Disconnect observer after first intersection
            observer.disconnect();
          }
        });
      },
      {
        threshold,
        rootMargin: '50px' // Start loading 50px before entering viewport
      }
    );

    if (adRef.current) {
      observer.observe(adRef.current);
    }

    return () => {
      if (adRef.current) {
        observer.unobserve(adRef.current);
      }
      observer.disconnect();
    };
  }, [threshold, hasIntersected]);

  return (
    <div ref={adRef} className={`lazy-ad-container ${className}`}>
      {isVisible ? (
        <GoogleAd 
          adSlot={adSlot} 
          adFormat={adFormat} 
          className={className}
          style={style}
        />
      ) : (
        <div className="ad-placeholder bg-gray-100 rounded-lg p-4 text-center animate-pulse">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LazyAd;
