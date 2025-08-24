"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface ProtectedBoutonLinkProps {
  variant?: "default" | "secondary" | "outline";
  size?: "xs" | "sm" | "default" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  href: string;
  children: React.ReactNode;
  className?: string;
  fallbackPath?: string;
}

const ProtectedBoutonLink: React.FC<ProtectedBoutonLinkProps> = ({
  variant = "default",
  size = "default",
  fullWidth = false,
  href,
  children,
  className = "",
  fallbackPath = "/login",
  ...props
}) => {
  const router = useRouter();
  const { user, loading } = useAuth();

  const baseClasses =
    "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 cursor-pointer";

  const variantClasses = {
    default:
      "bg-purple-600 text-white hover:bg-purple-700 shadow-sm hover:shadow-md",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    outline:
      "border border-gray-300 text-gray-700 hover:border-purple-500 hover:text-purple-600 bg-white",
  };

  const sizeClasses = {
    xs: "h-7 px-2 py-1 text-xs",
    sm: "h-8 px-3 py-1.5 text-xs",
    default: "h-10 px-4 py-2",
    md: "h-11 px-5 py-2.5",
    lg: "h-12 px-6 py-3 text-base",
    xl: "h-14 px-8 py-4 text-lg",
  };

  const widthClass = fullWidth ? "w-full" : "";

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (loading) {
      // Attendre que l'authentification soit vérifiée
      return;
    }

    if (user) {
      // Utilisateur connecté, naviguer vers la destination
      router.push(href);
    } else {
      // Utilisateur non connecté, rediriger vers la connexion
      router.push(fallbackPath);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={buttonClasses}
      disabled={loading}
      {...props}
    >
      {children}
    </button>
  );
};

export { ProtectedBoutonLink };
