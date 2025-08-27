"use client";

import React from "react";

interface PageLoaderProps {
  message?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ 
}) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 z-50 flex items-center justify-center">
       <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border border-purple-600/20 border-t-2 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    </div>
  );
};
