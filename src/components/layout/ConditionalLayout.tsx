"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PageLoader } from "@/components/ui/PageLoader";

// Pages d'authentification qui ne doivent pas avoir de header/footer
const authPages = [
  "/login",
  "/register-email",
  "/register-verify-email",
  "/register-verify-code",
  "/register-complete",
];

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export const ConditionalLayout: React.FC<ConditionalLayoutProps> = ({
  children,
}) => {
  const pathname = usePathname();
  const { isLoading } = useAuth();
  const isAuthPage = authPages.includes(pathname);



  if (isAuthPage) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {isLoading && <PageLoader />}
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};
