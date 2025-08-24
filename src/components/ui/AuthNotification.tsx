"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { X, AlertCircle } from "lucide-react";

interface AuthNotificationProps {
  message?: string;
  showLoginButton?: boolean;
  onClose?: () => void;
  className?: string;
}

export const AuthNotification: React.FC<AuthNotificationProps> = ({
  message = "Vous devez être connecté pour accéder à cette fonctionnalité",
  showLoginButton = true,
  onClose,
  className = "",
}) => {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
    onClose?.();
  };

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-blue-400" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-blue-800">{message}</p>
          {showLoginButton && (
            <div className="mt-3 flex space-x-3">
              <button
                onClick={handleLogin}
                className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Se connecter
              </button>
              <button
                onClick={() => router.push("/register-email")}
                className="bg-white text-blue-600 border border-blue-300 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors"
              >
                S'inscrire
              </button>
            </div>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto flex-shrink-0 text-blue-400 hover:text-blue-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};
