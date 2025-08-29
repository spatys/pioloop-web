"use client";

import React from "react";

export const PageLoader: React.FC = () => {
 return (
  <div className="fixed inset-0 bg-white bg-opacity-60 z-50 flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
    </div>
  </div>
  );
};