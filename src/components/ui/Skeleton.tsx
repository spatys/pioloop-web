import React from "react";

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = "", 
  children 
}) => {
  return (
    <div 
      className={`animate-pulse bg-gray-200 rounded ${className}`}
    >
      {children}
    </div>
  );
};

// Composants skeleton spécialisés
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 1, 
  className = "" 
}) => (
  <div className={`space-y-2 ${className}`}>
    {[...Array(lines)].map((_, index) => (
      <Skeleton 
        key={index} 
        className={`h-4 ${index === lines - 1 ? 'w-3/4' : 'w-full'}`}
      />
    ))}
  </div>
);

export const SkeletonImage: React.FC<{ className?: string }> = ({ 
  className = "" 
}) => (
  <Skeleton className={`w-full h-48 ${className}`} />
);

export const SkeletonButton: React.FC<{ className?: string }> = ({ 
  className = "" 
}) => (
  <Skeleton className={`h-10 w-24 ${className}`} />
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ 
  className = "" 
}) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden ${className}`}>
    <SkeletonImage />
    <div className="p-4 space-y-3">
      <SkeletonText lines={2} />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  </div>
);
