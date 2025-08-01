'use client';

import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
}

export default function LoadingSpinner({ 
  className = '' 
}: LoadingSpinnerProps) {
  return (
    <div className={`inline-block ${className}`}>
      <div className="h-16 w-16 relative">
        <div 
          className="absolute inset-0 rounded-full border-2 border-gray-200"
        />
        <div 
          className="absolute inset-0 rounded-full border-2 border-transparent text-purple-600 animate-spin"
          style={{
            borderTopColor: 'currentColor',
            borderRightColor: 'transparent',
            borderBottomColor: 'transparent',
            borderLeftColor: 'transparent',
            animationDuration: '0.8s',
            animationTimingFunction: 'linear'
          }}
        />
      </div>
    </div>
  );
} 