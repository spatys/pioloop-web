import React from "react";
import { AddProperty } from "@/modules/property/components/AddProperty";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";

export default function AddPropertyPage() {
  return (
    <ProtectedRoute fallbackPath="/login">
      <AddProperty />
    </ProtectedRoute>
  );
}
