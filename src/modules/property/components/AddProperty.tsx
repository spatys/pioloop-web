"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  PropertyType,
  CreatePropertyRequest,
  PropertyAmenityRequest,
  PropertyImageRequest,
} from "@/core/types/Property";
import { getPropertyService } from "@/core/di/container";
import { Loader } from "lucide-react";
import { Dropdown } from "@/components/ui/Dropdown";
import { PageLoader } from "@/components/ui/PageLoader";


export const AddProperty: React.FC = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showPageLoader, setShowPageLoader] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<Partial<CreatePropertyRequest>>({
    title: "",
    description: "",
    propertyType: "",
    maxGuests: 1,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    squareMeters: 0,
    address: "",
    neighborhood: "",
    city: "",
    postalCode: "",
    pricePerNight: 0,
    cleaningFee: 0,
    serviceFee: 0,
    amenities: [],
    images: [],
  });

  const totalSteps = 6;

  // Fonction pour convertir un fichier en base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Extraire la partie base64 (après "data:image/jpeg;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleInputChange = (
    field: keyof CreatePropertyRequest,
    value: any,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Effacer l'erreur du champ dès que l'utilisateur commence à saisir
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const imageFiles = fileArray.filter(
        (file) =>
          file.type.startsWith("image/") &&
          (file.type === "image/jpeg" ||
            file.type === "image/png" ||
            file.type === "image/jpg"),
      );

      if (imageFiles.length + (formData.images?.length || 0) > 10) {
        alert("Vous ne pouvez pas ajouter plus de 10 images au total.");
        return;
      }

      // Convertir les fichiers en base64 et créer les objets PropertyImageRequest
      const newImages: PropertyImageRequest[] = await Promise.all(
        imageFiles.map(async (file, index) => {
          const base64 = await convertFileToBase64(file);
          return {
            imageUrl: base64,
            altText: file.name,
            isMainImage: (formData.images?.length || 0) === 0 && index === 0,
            displayOrder: (formData.images?.length || 0) + index + 1,
          };
        })
      );
      const updatedImages = [...(formData.images || []), ...newImages];
      handleInputChange("images", updatedImages);
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const files = event.dataTransfer.files;
    if (files) {
      const fileArray = Array.from(files);
      const imageFiles = fileArray.filter(
        (file) =>
          file.type.startsWith("image/") &&
          (file.type === "image/jpeg" ||
            file.type === "image/png" ||
            file.type === "image/jpg"),
      );

      if (imageFiles.length + (formData.images?.length || 0) > 10) {
        alert("Vous ne pouvez pas ajouter plus de 10 images au total.");
        return;
      }

      // Convertir les fichiers en base64 et créer les objets PropertyImageRequest
      const newImages: PropertyImageRequest[] = await Promise.all(
        imageFiles.map(async (file, index) => {
          const base64 = await convertFileToBase64(file);
          return {
            imageUrl: base64,
            altText: file.name,
            isMainImage: (formData.images?.length || 0) === 0 && index === 0,
            displayOrder: (formData.images?.length || 0) + index + 1,
          };
        })
      );
      const updatedImages = [...(formData.images || []), ...newImages];
      handleInputChange("images", updatedImages);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const removeImage = (index: number) => {
    const newImages = formData.images?.filter((_, i) => i !== index) || [];
    handleInputChange("images", newImages);
    
    // Ajouter l'erreur des images si on a moins de 3 images
    if (newImages.length < 3 && !errors.images) {
      setErrors((prev) => ({
        ...prev,
        images: "Vous devez ajouter au moins 3 images"
      }));
    }
  };

  // Fonctions de validation
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.propertyType?.trim()) {
          newErrors.propertyType = "Le type de logement est requis";
        }
        if (!formData.title?.trim()) {
          newErrors.title = "Le titre de l'annonce est requis";
        }
        if (!formData.description?.trim()) {
          newErrors.description = "La description est requise";
        }
        break;

      case 2:
        if (!formData.bedrooms || formData.bedrooms < 1) {
          newErrors.bedrooms = "Le nombre de chambres doit être au moins 1";
        }
        if (!formData.beds || formData.beds < 1) {
          newErrors.beds = "Le nombre de lits doit être au moins 1";
        }
        if (!formData.bathrooms || formData.bathrooms < 1) {
          newErrors.bathrooms = "Le nombre de salles de bain doit être au moins 1";
        }
        if (!formData.maxGuests || formData.maxGuests < 1) {
          newErrors.maxGuests = "La capacité maximale doit être au moins 1";
        }
        if (!formData.squareMeters || formData.squareMeters < 1) {
          newErrors.squareMeters = "La surface doit être au moins 1 m²";
        }
        break;

      case 3:
        if (!formData.neighborhood?.trim()) {
          newErrors.neighborhood = "Le quartier est requis";
        }
        if (!formData.city?.trim()) {
          newErrors.city = "La ville est requise";
        }
        break;

      case 4:
        if (!formData.pricePerNight || formData.pricePerNight < 1) {
                      newErrors.pricePerNight = "Le prix par nuit doit être au moins 1";
        }
        break;

      case 5:
        if (!formData.images || formData.images.length < 3) {
          newErrors.images = "Vous devez ajouter au moins 3 images";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        setErrors({}); // Réinitialiser les erreurs
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Validation finale avant soumission
    if (!validateStep(5)) {
      return;
    }

    setShowPageLoader(true);
    
    const propertyService = getPropertyService();

    const createRequest: CreatePropertyRequest = {
      ...(formData as CreatePropertyRequest),
    };
    console.log(createRequest);
    const response = await propertyService.createProperty(createRequest);
    console.log(response);
    if (response) {
      setShowPageLoader(false);
      // Redirection vers le dashboard du propriétaire avec un paramètre pour forcer la revalidation
      router.push("/dashboard?refresh=true");
    }

    setShowPageLoader(false);
  };

  const stepTitles = [
    "Informations générales",
    "Capacité et équipements", 
    "Localisation",
    "Tarification",
    "Images du logement",
    "Récapitulatif"
  ];

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-12">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div key={index} className="flex flex-col items-center w-36">
            <div className="flex items-center justify-center w-full h-10 mb-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                  index + 1 === currentStep
                    ? "bg-purple-600 text-white shadow-lg"
                    : index + 1 < currentStep
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                }`}
              >
                {index + 1 < currentStep ? "✓" : index + 1}
              </div>
            </div>
            
            <div className="text-center h-12 flex items-center justify-center">
              <div
                className={`text-xs font-medium transition-colors duration-200 leading-tight text-center ${
                  index + 1 === currentStep
                    ? "text-purple-600"
                    : index + 1 < currentStep
                      ? "text-green-600"
                      : "text-gray-500"
                }`}
              >
                {stepTitles[index]}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-medium text-gray-900 mb-4">
        Informations générales
      </h2>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <Dropdown
            label="Type de logement"
            required
            value={formData.propertyType}
            onChange={(value) => {
              handleInputChange("propertyType", value);
              
              // Validation en temps réel pour les champs texte
              if (value.trim() && errors.propertyType) {
                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.propertyType;
                  return newErrors;
                });
              }
            }}
            placeholder="Sélectionnez un type"
            error={errors.propertyType}
            options={Object.values(PropertyType).map((type) => ({
              value: type,
              label: type,
            }))}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-normal text-gray-700 mb-2">
          Titre de l'annonce <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => {
            handleInputChange("title", e.target.value);
            
            // Validation en temps réel pour les champs texte
            if (e.target.value.trim() && errors.title) {
              setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.title;
                return newErrors;
              });
            }
          }}
          className={`w-full px-3 py-2 border rounded-md focus:border-purple-500 ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Ex: Appartement moderne au cœur de Douala"
          required
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-normal text-gray-700 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => {
            handleInputChange("description", e.target.value);
            
            // Validation en temps réel pour les champs texte
            if (e.target.value.trim() && errors.description) {
              setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.description;
                return newErrors;
              });
            }
          }}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md focus:border-purple-500 ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Décrivez votre logement..."
          required
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-medium text-gray-900 mb-4">
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
            onChange={(e) => {
              const value =
                e.target.value === "" ? 0 : parseInt(e.target.value) || 0;
              handleInputChange("bedrooms", value);
              
              // Validation en temps réel pour les champs numériques
              if (value >= 1 && errors.bedrooms) {
                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.bedrooms;
                  return newErrors;
                });
              }
            }}
            className={`w-full px-3 py-2 border rounded-md focus:border-purple-500 text-center ${
              errors.bedrooms ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors.bedrooms && (
            <p className="mt-1 text-sm text-red-600">{errors.bedrooms}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">
            Lits <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            value={formData.beds}
            onChange={(e) => {
              const value =
                e.target.value === "" ? 0 : parseInt(e.target.value) || 0;
              handleInputChange("beds", value);
              
              // Validation en temps réel pour les champs numériques
              if (value >= 1 && errors.beds) {
                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.beds;
                  return newErrors;
                });
              }
            }}
            className={`w-full px-3 py-2 border rounded-md focus:border-purple-500 text-center ${
              errors.beds ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors.beds && (
            <p className="mt-1 text-sm text-red-600">{errors.beds}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">
            Salles de bain <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            value={formData.bathrooms}
            onChange={(e) => {
              const value =
                e.target.value === "" ? 0 : parseInt(e.target.value) || 0;
              handleInputChange("bathrooms", value);
              
              // Validation en temps réel pour les champs numériques
              if (value >= 1 && errors.bathrooms) {
                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.bathrooms;
                  return newErrors;
                });
              }
            }}
            className={`w-full px-3 py-2 border rounded-md focus:border-purple-500 text-center ${
              errors.bathrooms ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors.bathrooms && (
            <p className="mt-1 text-sm text-red-600">{errors.bathrooms}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">
            Capacité max <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            value={formData.maxGuests}
            onChange={(e) => {
              const value =
                e.target.value === "" ? 0 : parseInt(e.target.value) || 0;
              handleInputChange("maxGuests", value);
              
              // Validation en temps réel pour les champs numériques
              if (value >= 1 && errors.maxGuests) {
                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.maxGuests;
                  return newErrors;
                });
              }
            }}
            className={`w-full px-3 py-2 border rounded-md focus:border-purple-500 text-center ${
              errors.maxGuests ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors.maxGuests && (
            <p className="mt-1 text-sm text-red-600">{errors.maxGuests}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-normal text-gray-700 mb-2">
          Surface (m²) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          min="1"
          value={formData.squareMeters}
          onChange={(e) => {
            const value =
              e.target.value === "" ? 0 : parseInt(e.target.value) || 0;
            handleInputChange("squareMeters", value);
            
            // Validation en temps réel pour les champs numériques
            if (value >= 1 && errors.squareMeters) {
              setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.squareMeters;
                return newErrors;
              });
            }
          }}
          className={`w-full px-3 py-2 border rounded-md focus:border-purple-500 ${
            errors.squareMeters ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="120"
          required
        />
        {errors.squareMeters && (
          <p className="mt-1 text-sm text-red-600">{errors.squareMeters}</p>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-medium text-gray-900 mb-4">Localisation</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">
            Adresse complète (optionnel)
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-purple-500"
            placeholder="123 Rue de la Paix"
          />
        </div>

        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">
            Quartier <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.neighborhood}
            onChange={(e) => {
              handleInputChange("neighborhood", e.target.value);
              
              // Validation en temps réel pour les champs texte
              if (e.target.value.trim() && errors.neighborhood) {
                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.neighborhood;
                  return newErrors;
                });
              }
            }}
            className={`w-full px-3 py-2 border rounded-md focus:border-purple-500 ${
              errors.neighborhood ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Akwa, Bali, etc."
            required
          />
          {errors.neighborhood && (
            <p className="mt-1 text-sm text-red-600">{errors.neighborhood}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">
            Ville <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => {
              handleInputChange("city", e.target.value);
              
              // Validation en temps réel pour les champs texte
              if (e.target.value.trim() && errors.city) {
                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.city;
                  return newErrors;
                });
              }
            }}
            className={`w-full px-3 py-2 border rounded-md focus:border-purple-500 ${
              errors.city ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Douala"
            required
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city}</p>
          )}
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
      <h2 className="text-xl font-medium text-gray-900 mb-4">Tarification</h2>
      <div>
        <label className="block text-sm font-normal text-gray-700 mb-2">
          Prix par nuit <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          min="0"
          value={formData.pricePerNight}
          onChange={(e) => {
            const value =
              e.target.value === "" ? 0 : parseInt(e.target.value) || 0;
            handleInputChange("pricePerNight", value);
            
            // Validation en temps réel pour les champs numériques
            if (value >= 1 && errors.pricePerNight) {
              setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.pricePerNight;
                return newErrors;
              });
            }
          }}
          className={`w-full px-3 py-2 border rounded-md focus:border-purple-500 ${
            errors.pricePerNight ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="25000"
          required
        />
        {errors.pricePerNight && (
          <p className="mt-1 text-sm text-red-600">{errors.pricePerNight}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">
            Frais de ménage
          </label>
          <input
            type="number"
            min="0"
            value={formData.cleaningFee}
            onChange={(e) => {
              const value =
                e.target.value === "" ? 0 : parseInt(e.target.value) || 0;
              handleInputChange("cleaningFee", value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-purple-500"
            placeholder="5000"
          />
        </div>

        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">
            Frais de service
          </label>
          <input
            type="number"
            min="0"
            value={formData.serviceFee}
            onChange={(e) => {
              const value =
                e.target.value === "" ? 0 : parseInt(e.target.value) || 0;
              handleInputChange("serviceFee", value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-purple-500"
            placeholder="2000"
          />
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-medium text-gray-900 mb-4">
        Images du logement
      </h2>

      <div>
        <label className="block text-sm font-normal text-gray-700 mb-2">
          Photos de votre logement <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-600 mb-4">
          Ajoutez entre 3 et 10 photos de votre logement. La première photo sera
          la photo principale.
        </p>

        <div className="space-y-4">
          {/* Zone de drop/upload avec aperçu intégré */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 transition-colors duration-200 ${
              isDragOver ? "border-purple-500 bg-purple-50" : "border-gray-300"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {/* Input file caché */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Aperçu des images sélectionnées */}
            {formData.images && formData.images.length > 0 ? (
              <div>
                <p className="text-sm text-gray-600 mb-3">
                  Aperçu des images ({formData.images.length}/10)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-4">
                  {formData.images.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-video bg-gray-100 rounded-lg border border-gray-300 relative group"
                    >
                      <img
                        src={`data:image/jpeg;base64,${image.imageUrl}`}
                        alt={image.altText}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        ×
                      </button>
                      {image.isMainImage && (
                        <div className="absolute bottom-1 left-1 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                          Principale
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Emplacements vides */}
                  {Array.from(
                    { length: Math.max(3, 10 - formData.images.length) },
                    (_, index) => (
                      <div
                        key={`empty-${index}`}
                        className="aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
                      >
                        <div className="text-center">
                          <svg
                            className="mx-auto h-6 w-6 text-gray-400 mb-1"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          <p className="text-xs text-gray-500">Ajouter</p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}

            {/* Bouton pour sélectionner des fichiers */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-purple-600 text-white rounded-md font-normal hover:bg-purple-700"
              >
                Choisir des fichiers
              </button>
              <p className="text-xs text-gray-500 mt-2">
                PNG, JPG jusqu'à 10MB - 3 à 10 images
              </p>
              <p className="text-xs text-gray-500">
                Ou glissez-déposez vos images ici
              </p>
            </div>
          </div>

                      {/* Message d'aide */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Conseil :</strong> Ajoutez des photos de qualité montrant
                les différentes pièces de votre logement pour attirer plus de
                voyageurs. La première image sera affichée en premier.
              </p>
            </div>

            {/* Affichage de l'erreur pour les images */}
            {errors.images && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.images}</p>
              </div>
            )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-normal text-gray-700 mb-2">
          Équipements et commodités
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { name: "Wi-Fi", type: 2, category: 2 },
            { name: "Climatisation", type: 1, category: 1 },
            { name: "Cuisine", type: 1, category: 1 },
            { name: "Parking", type: 1, category: 3 },
            { name: "Piscine", type: 1, category: 4 },
            { name: "Balcon", type: 1, category: 1 },
            { name: "Ascenseur", type: 1, category: 1 },
            { name: "Sécurité", type: 1, category: 3 },
            { name: "Ménage", type: 2, category: 2 },
            { name: "Petit-déjeuner", type: 2, category: 2 },
            { name: "Animaux", type: 2, category: 2 },
            { name: "Fumeur", type: 2, category: 2 },
          ].map((amenity) => (
            <label key={amenity.name} className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                onChange={(e) => {
                  const currentAmenities = formData.amenities || [];
                  if (e.target.checked) {
                    const newAmenity: PropertyAmenityRequest = {
                      name: amenity.name,
                      description: amenity.name,
                      type: amenity.type,
                      category: amenity.category,
                      isAvailable: true,
                      isIncludedInRent: true,
                      additionalCost: 0,
                      icon: amenity.name.toLowerCase(),
                      priority: 1,
                    };
                    handleInputChange("amenities", [
                      ...currentAmenities,
                      newAmenity,
                    ]);
                  } else {
                    handleInputChange(
                      "amenities",
                      currentAmenities.filter((a) => a.name !== amenity.name),
                    );
                  }
                }}
              />
              <span className="ml-2 text-sm text-gray-700">{amenity.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-medium text-gray-900 mb-4">
        Récapitulatif
      </h2>
      
      <div className="bg-gray-50 rounded-lg p-6 space-y-6">
        {/* Informations générales */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center">
            <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm mr-3">1</span>
            Informations générales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-600">Type de logement</span>
              <p className="text-gray-900">{formData.propertyType || "Non renseigné"}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Titre</span>
              <p className="text-gray-900">{formData.title || "Non renseigné"}</p>
            </div>
            <div className="md:col-span-2">
              <span className="text-sm font-medium text-gray-600">Description</span>
              <p className="text-gray-900">{formData.description || "Non renseigné"}</p>
            </div>
          </div>
        </div>

        {/* Capacité et équipements */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center">
            <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm mr-3">2</span>
            Capacité et équipements
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-600">Voyageurs max</span>
              <p className="text-gray-900">{formData.maxGuests || 0}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Chambres</span>
              <p className="text-gray-900">{formData.bedrooms || 0}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Lits</span>
              <p className="text-gray-900">{formData.beds || 0}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Salles de bain</span>
              <p className="text-gray-900">{formData.bathrooms || 0}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Surface (m²)</span>
              <p className="text-gray-900">{formData.squareMeters || 0}</p>
            </div>
          </div>
          
          {formData.amenities && formData.amenities.length > 0 && (
            <div className="mt-4">
              <span className="text-sm font-medium text-gray-600">Équipements</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.amenities.map((amenity, index) => (
                  <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-sm">
                    {amenity.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Localisation */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center">
            <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm mr-3">3</span>
            Localisation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-600">Adresse</span>
              <p className="text-gray-900">{formData.address || "Non renseigné"}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Quartier</span>
              <p className="text-gray-900">{formData.neighborhood || "Non renseigné"}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Ville</span>
              <p className="text-gray-900">{formData.city || "Non renseigné"}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Code postal</span>
              <p className="text-gray-900">{formData.postalCode || "Non renseigné"}</p>
            </div>
          </div>
        </div>

        {/* Tarification */}
        <div>
          <h3 className="text-lg font-normal text-gray-700 mb-3 flex items-center">
            <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm mr-3">4</span>
            Tarification
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-600">Prix par nuit</span>
              <p className="text-gray-900">{formData.pricePerNight || 0} €</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Frais de ménage</span>
              <p className="text-gray-900">{formData.cleaningFee || 0} €</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Frais de service</span>
              <p className="text-gray-900">{formData.serviceFee || 0} €</p>
            </div>
          </div>
        </div>

        {/* Images */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center">
            <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm mr-3">5</span>
            Images du logement
          </h3>
          <div>
            <span className="text-sm font-medium text-gray-600">Nombre d'images</span>
            <p className="text-gray-900">{formData.images?.length || 0} image(s)</p>
            {formData.images && formData.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-3">
                {formData.images.slice(0, 4).map((image, index) => (
                  <div key={index} className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={`data:image/jpeg;base64,${image.imageUrl}`}
                      alt={image.altText}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {formData.images.length > 4 && (
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm text-gray-600">+{formData.images.length - 4} autres</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Vérifiez attentivement</strong> toutes les informations avant de valider l'ajout de votre logement. 
          Vous pourrez modifier ces informations ultérieurement depuis votre tableau de bord.
        </p>
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
      case 6:
        return renderStep6();
      default:
        return null;
    }
  };

  return (
    <>
      {showPageLoader && (
        <PageLoader />
      )}
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
                className="px-4 py-2 bg-purple-600 text-white rounded-md font-normal hover:bg-purple-700"
              >
                Valider
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
