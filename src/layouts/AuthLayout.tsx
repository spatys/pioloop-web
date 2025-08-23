"use client";

import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
};
