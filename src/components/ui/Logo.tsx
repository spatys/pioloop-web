import React from 'react';
import Link from 'next/link';

interface LogoProps {
  showSubtitle?: boolean;
  className?: string;
  href?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  showSubtitle = true, 
  className = '',
  href = "/"
}) => {
  const LogoContent = () => (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200 group-hover:scale-105">
        <span className="text-white text-lg font-bold">P</span>
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-200">Pioloop</span>
        {showSubtitle && (
          <span className="text-xs text-gray-500 font-medium">Location de logements</span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className={`flex items-center space-x-3 group ${className}`}>
        <LogoContent />
      </Link>
    );
  }

  return (
    <div className={`flex items-center space-x-3 group ${className}`}>
      <LogoContent />
    </div>
  );
}; 