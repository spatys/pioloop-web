"use client";

import React from "react";
import { Hero } from "./Hero";
import { ContentSections } from "./ContentSections";
import { ServicesSection } from "./ServicesSection";

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <ContentSections />
      <ServicesSection />
    </div>
  );
};
