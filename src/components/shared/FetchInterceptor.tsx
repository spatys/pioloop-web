"use client";

import React, { useEffect } from "react";
import { useLoader } from "@/context/LoaderContext";
import { initializeGlobalLoader, setupFetchInterceptor } from "@/utils/fetchWithLoader";

export const FetchInterceptor: React.FC = () => {
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    // Initialiser le loader global
    initializeGlobalLoader(showLoader, hideLoader);
    
    // Configurer l'intercepteur fetch
    setupFetchInterceptor();
    
    console.log("FetchInterceptor: Intercepteur fetch configuré avec le loader global");
  }, [showLoader, hideLoader]);

  // Ce composant ne rend rien, il configure juste l'intercepteur
  return null;
};
