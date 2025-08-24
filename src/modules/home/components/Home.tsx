"use client";

import React from "react";
import { Hero } from "./Hero";
import { LatestProperties } from "./LatestProperties";
import { ContentSections } from "./ContentSections";
import { ServicesSection } from "./ServicesSection";

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <LatestProperties />
      <ContentSections />
      <ServicesSection />
    </div>
  );
};
