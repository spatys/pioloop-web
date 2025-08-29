"use client";

import React from "react";

export const PageLoader: React.FC = () => {
 return (
     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
     <div className="text-center">
       <div className="animate-spin bg-white bg-opacity-70 z-50 rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
     </div>
   </div>
  );
};
