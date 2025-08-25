import React from "react";
import { SkeletonCard } from "@/components/ui/Skeleton";

interface PropertySkeletonProps {
  count?: number;
  className?: string;
}

export const PropertySkeleton: React.FC<PropertySkeletonProps> = ({
  count = 5,
  className = "",
}) => {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 ${className}`}
    >
      {[...Array(count)].map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};
