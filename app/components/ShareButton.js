"use client";

import { useState } from 'react';
import { shortenUrl } from '../utils/urlShortener';

export default function ShareButton({ url, className }) {
  const [isSharing, setIsSharing] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  
  const handleShare = async () => {
    if (isSharing) return;
    
    setIsSharing(true);
    setShareMessage('Creating link...');
    
    try {
      const shareUrl = url || window.location.href;
      
      // Attempt to shorten the URL
      const shortened = await shortenUrl(shareUrl);
      
      // Copy the result to clipboard
      await navigator.clipboard.writeText(shortened);
      
      // Check if shortening was successful
      if (shortened !== shareUrl) {
        setShareMessage('Short link copied!');
      } else {
        setShareMessage('Link copied!');
      }
    } catch (error) {
      console.error("Error sharing:", error);
      
      try {
        // Try to fall back to copying the original URL
        const shareUrl = url || window.location.href;
        await navigator.clipboard.writeText(shareUrl);
        setShareMessage('Link copied!');
      } catch (clipboardError) {
        setShareMessage('Share failed!');
      }
    }
    
    // Reset after a reasonable time
    setTimeout(() => {
      setShareMessage('');
      setIsSharing(false);
    }, 2000);
  };
  
  return (
    <div className="inline-block relative">
      <button
        onClick={handleShare}
        disabled={isSharing}
        className={`${className || 'bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors'} ${isSharing ? 'opacity-75' : ''}`}
      >
        {isSharing ? 'Sharing...' : 'Share Link'}
      </button>
      
      {shareMessage && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap bg-black bg-opacity-75 text-white text-xs py-1 px-2 rounded text-center z-10">
          {shareMessage}
        </div>
      )}
    </div>
  );
}