"use client";

import { useEffect, useState } from 'react';

const GoogleAd = ({ adSlot, adFormat = 'auto', className = '', style = {} }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    // Check for ad blocker
    const checkAdBlocker = () => {
      const testAd = document.createElement('div');
      testAd.innerHTML = '&nbsp;';
      testAd.className = 'adsbox';
      testAd.style.position = 'absolute';
      testAd.style.left = '-9999px';
      document.body.appendChild(testAd);
      
      const isBlocked = testAd.offsetHeight === 0;
      document.body.removeChild(testAd);
      
      return isBlocked;
    };

    const adBlockerDetected = checkAdBlocker();
    setIsBlocked(adBlockerDetected);

    if (!adBlockerDetected) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setIsLoaded(true);
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }
  }, [adSlot]);

  if (isBlocked) {
    return (
      <div className={`ad-blocked ${className}`} style={style}>
        <div className="bg-gray-100 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600">Please disable your ad blocker to support our content</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`ad-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
      {!isLoaded && (
        <div className="ad-loading bg-gray-100 rounded-lg p-4 text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleAd;
