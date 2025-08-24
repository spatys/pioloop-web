"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PropertyType, CreatePropertyRequest } from "@/core/types/Property";
import { getPropertyService } from "@/core/di/container";

interface AddPropertyProps {
  onClose?: () => void;
}

export const AddProperty: React.FC<AddPropertyProps> = ({ onClose }) => {
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

  const totalSteps = 4;

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
      
      // Simuler l'ownerId pour l'exemple
      const createRequest: CreatePropertyRequest = {
        ...formData as CreatePropertyRequest,
        ownerId: "current-user-id", // À remplacer par l'ID de l'utilisateur connecté
      };

      await propertyService.createProperty(createRequest);
      
      // Redirection vers la page des propriétés
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
      <div className="flex items-center justify-center space-x-4">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                index + 1 <= currentStep
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {index + 1}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`w-16 h-1 mx-2 ${
                  index + 1 < currentStep ? "bg-purple-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="text-center mt-2 text-sm text-gray-600">
        Étape {currentStep} sur {totalSteps}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations générales</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type de propriété *
        </label>
        <select
          value={formData.propertyType}
          onChange={(e) => handleInputChange("propertyType", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        >
          <option value="">Sélectionnez un type</option>
          {Object.values(PropertyType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Titre de l'annonce *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Ex: Appartement moderne au cœur de Douala"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Décrivez votre propriété..."
          required
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Capacité et équipements</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de chambres *
          </label>
          <input
            type="number"
            min="1"
            value={formData.bedrooms}
            onChange={(e) => handleInputChange("bedrooms", parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de lits *
          </label>
          <input
            type="number"
            min="1"
            value={formData.beds}
            onChange={(e) => handleInputChange("beds", parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de salles de bain *
          </label>
          <input
            type="number"
            min="1"
            value={formData.bathrooms}
            onChange={(e) => handleInputChange("bathrooms", parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Capacité maximale *
          </label>
          <input
            type="number"
            min="1"
            value={formData.maxGuests}
            onChange={(e) => handleInputChange("maxGuests", parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type de chambre
        </label>
        <select
          value={formData.roomType}
          onChange={(e) => handleInputChange("roomType", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">Sélectionnez un type</option>
          <option value="Entire place">Logement entier</option>
          <option value="Private room">Chambre privée</option>
          <option value="Shared room">Chambre partagée</option>
        </select>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Localisation</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Adresse complète *
        </label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="123 Rue de la Paix"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ville *
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Douala"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Code postal
          </label>
          <input
            type="text"
            value={formData.postalCode}
            onChange={(e) => handleInputChange("postalCode", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="12345"
          />
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Tarification</h2>
      
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prix par nuit (FCFA) *
          </label>
          <input
            type="number"
            min="0"
            value={formData.pricePerNight}
            onChange={(e) => handleInputChange("pricePerNight", parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="25000"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frais de ménage (FCFA)
            </label>
            <input
              type="number"
              min="0"
              value={formData.cleaningFee}
              onChange={(e) => handleInputChange("cleaningFee", parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="5000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frais de service (FCFA)
            </label>
            <input
              type="number"
              min="0"
              value={formData.serviceFee}
              onChange={(e) => handleInputChange("serviceFee", parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* En-tête */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Proposer mon bien
            </h1>
            <p className="text-gray-600">
              Remplissez les informations pour ajouter votre propriété
            </p>
          </div>

          {/* Indicateur de progression */}
          {renderStepIndicator()}

          {/* Contenu de l'étape */}
          <div className="mb-8">
            {renderCurrentStep()}
          </div>

          {/* Boutons de navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                currentStep === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Précédent
            </button>

            <div className="flex items-center space-x-4">
              {onClose && (
                <button
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Annuler
                </button>
              )}

              {currentStep < totalSteps ? (
                <button
                  onClick={nextStep}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200"
                >
                  Suivant
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                    isSubmitting
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                >
                  {isSubmitting ? "Création..." : "Créer la propriété"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
