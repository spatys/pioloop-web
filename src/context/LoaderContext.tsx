"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { PageLoader } from "@/components/ui/PageLoader";

interface LoaderContextType {
  showLoader: (message?: string) => void;
  hideLoader: () => void;
  isLoading: boolean;
  message: string;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error("useLoader must be used within a LoaderProvider");
  }
  return context;
};

interface LoaderProviderProps {
  children: React.ReactNode;
}

export const LoaderProvider: React.FC<LoaderProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("Chargement en cours...");

  const showLoader = useCallback((customMessage?: string) => {
    setMessage(customMessage || "Chargement en cours...");
    setIsLoading(true);
  }, []);

  const hideLoader = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader, isLoading, message }}>
      {children}
      {isLoading && <PageLoader />}
    </LoaderContext.Provider>
  );
};
