import React from "react";
import Link from "next/link";

interface LogoProps {
  showSubtitle?: boolean;
  className?: string;
  href?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "", href = "/" }) => {
  const LogoContent = () => (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-2xl font-bold">PL</span>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-purple-700">PioLoop</span>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`flex items-center space-x-3 group ${className}`}
      >
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
