"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PropertyType, CreatePropertyRequest } from "@/core/types/Property";
import { getPropertyService } from "@/core/di/container";

export const AddProperty: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<CreatePropertyRequest>>({
    title: "",
    description: "",
    propertyType: "",
    roomType: "",
    maxGuests: 1,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    address: "",
    city: "",
    postalCode: "",
    pricePerNight: 0,
    cleaningFee: 0,
    serviceFee: 0,
    isInstantBookable: false,
    imageUrls: [],
    amenities: [],
  });

  const totalSteps = 5;

  const handleInputChange = (field: keyof CreatePropertyRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const propertyService = getPropertyService();
      
      const createRequest: CreatePropertyRequest = {
        ...formData as CreatePropertyRequest,
        ownerId: "current-user-id",
      };

      await propertyService.createProperty(createRequest);
      router.push("/properties");
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      alert("Erreur lors de la création de la propriété");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-1">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-normal ${
                index + 1 === currentStep
                  ? "bg-purple-600 text-white"
                  : index + 1 < currentStep
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {index + 1 < currentStep ? "✓" : index + 1}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`w-12 h-0.5 mx-2 ${
                  index + 1 < currentStep ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="text-center mt-3 text-sm text-gray-600">
        Étape {currentStep} sur {totalSteps}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-normal text-gray-900 mb-4">
        Informations générales
      </h2>
      
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">
            Type de logement <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.propertyType}
            onChange={(e) => handleInputChange("propertyType", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-purple-500"
            required
          >
            <option value="">Sélectionnez un type</option>
            {Object.values(PropertyType).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-normal text-gray-700 mb-2">
          Titre de l'annonce <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-purple-500"
          placeholder="Ex: Appartement moderne au cœur de Douala"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-normal text-gray-700 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-purple-500"
          placeholder="Décrivez votre logement..."
          required
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-normal text-gray-900 mb-4">
        Capacité et équipements
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">
            Chambres <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            value={formData.bedrooms}
            onChange={(e) => handleInputChange("bedrooms", parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-purple-500 text-center"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">
            Lits <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            value={formData.beds}
            onChange={(e) => handleInputChange("beds", parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-purple-500 text-center"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">
            Salles de bain <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            value={formData.bathrooms}
            onChange={(e) => handleInputChange("bathrooms", parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-purple-500 text-center"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">
            Capacité max <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            value={formData.maxGuests}
            onChange={(e) => handleInputChange("maxGuests", parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-purple-500 text-center"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-normal text-gray-900 mb-4">
        Localisation
      </h2>
      
      <div>
        <label className="block text-sm font-normal text-gray-700 mb-2">
          Adresse complète
        </label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-purple-500"
          placeholder="123 Rue de la Paix"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">
            Ville
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-purple-500"
            placeholder="Douala"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">
            Code postal
          </label>
          <input
            type="text"
            value={formData.postalCode}
            onChange={(e) => handleInputChange("postalCode", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-purple-500"
            placeholder="12345"
          />
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-normal text-gray-900 mb-4">
        Tarification
      </h2>
      
      <div>
        <label className="block text-sm font-normal text-gray-700 mb-2">
          Prix par nuit (FCFA) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          min="0"
          value={formData.pricePerNight}
          onChange={(e) => handleInputChange("pricePerNight", parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-purple-500"
          placeholder="25000"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">
            Frais de ménage (FCFA)
          </label>
          <input
            type="number"
            min="0"
            value={formData.cleaningFee}
            onChange={(e) => handleInputChange("cleaningFee", parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-purple-500"
            placeholder="5000"
          />
        </div>

        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">
            Frais de service (FCFA)
          </label>
          <input
            type="number"
            min="0"
            value={formData.serviceFee}
            onChange={(e) => handleInputChange("serviceFee", parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-purple-500"
            placeholder="2000"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="instantBookable"
          checked={formData.isInstantBookable}
          onChange={(e) => handleInputChange("isInstantBookable", e.target.checked)}
          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
        />
        <label htmlFor="instantBookable" className="ml-2 text-sm text-gray-700">
          Réservation instantanée disponible
        </label>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-normal text-gray-900 mb-4">
        Images du logement
      </h2>
      
      <div>
        <label className="block text-sm font-normal text-gray-700 mb-2">
          Photos de votre logement <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-600 mb-4">
          Ajoutez au moins 3 photos de votre logement. La première photo sera la photo principale.
        </p>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div className="space-y-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <button
                type="button"
                className="px-4 py-2 bg-purple-600 text-white rounded-md font-normal hover:bg-purple-700"
              >
                Choisir des fichiers
              </button>
              <p className="text-xs text-gray-500 mt-2">
                PNG, JPG jusqu'à 10MB
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-normal text-gray-700 mb-2">
          Équipements et commodités
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            "Wi-Fi", "Climatisation", "Cuisine", "Parking", "Piscine", "Balcon",
            "Ascenseur", "Sécurité", "Ménage", "Petit-déjeuner", "Animaux", "Fumeur"
          ].map((amenity) => (
            <label key={amenity} className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                onChange={(e) => {
                  const currentAmenities = formData.amenities || [];
                  if (e.target.checked) {
                    handleInputChange("amenities", [...currentAmenities, amenity]);
                  } else {
                    handleInputChange("amenities", currentAmenities.filter(a => a !== amenity));
                  }
                }}
              />
              <span className="ml-2 text-sm text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête simple */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-normal text-gray-900 mb-2">
            Proposer mon bien
          </h1>
          <p className="text-gray-600">
            Remplissez les informations pour ajouter votre logement
          </p>
        </div>

        {/* Indicateur de progression simple */}
        {renderStepIndicator()}

        {/* Contenu de l'étape */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          {renderCurrentStep()}
        </div>

        {/* Boutons de navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-4 py-2 rounded-md font-normal ${
              currentStep === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Précédent
          </button>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-normal hover:bg-gray-50"
            >
              Annuler
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                className="px-4 py-2 bg-purple-600 text-white rounded-md font-normal hover:bg-purple-700"
              >
                Suivant
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-md font-normal ${
                  isSubmitting
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                {isSubmitting ? "Création..." : "Ajouter"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
