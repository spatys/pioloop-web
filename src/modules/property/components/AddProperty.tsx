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
import { AvailabilityManager } from "@/components/ui/AvailabilityManager";


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
    maxGuests: undefined,
    bedrooms: undefined,
    beds: undefined,
    bathrooms: undefined,
    squareMeters: undefined,
    address: "",
    neighborhood: "",
    city: "",
    postalCode: "",
    pricePerNight: undefined,
    cleaningFee: undefined,
    serviceFee: undefined,
    amenities: [],
    images: [],
  });

  // État pour stocker les fichiers WebP
  const [webpFiles, setWebpFiles] = useState<File[]>([]);

  const totalSteps = 7;

  // Fonction pour convertir un fichier en WebP et retourner le fichier
  const convertFileToWebP = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Redimensionner si nécessaire (max 1920px de largeur)
        const maxWidth = 1920;
        const maxHeight = 1080;
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Dessiner l'image redimensionnée
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convertir en WebP avec qualité 85%
        canvas.toBlob((blob) => {
          if (blob) {
            const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
              type: 'image/webp',
              lastModified: Date.now()
            });
            resolve(webpFile);
          } else {
            reject(new Error('Erreur lors de la conversion en WebP'));
          }
        }, 'image/webp', 0.85);
      };
      
      img.onerror = () => reject(new Error('Erreur lors du chargement de l\'image'));
      img.src = URL.createObjectURL(file);
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
            file.type === "image/jpg" ||
            file.type === "image/webp"),
      );

      if (imageFiles.length + (formData.images?.length || 0) > 10) {
        alert("Vous ne pouvez pas ajouter plus de 10 images au total.");
        return;
      }

      try {
        // Convertir les fichiers en WebP
        const webpFiles = await Promise.all(
          imageFiles.map(file => convertFileToWebP(file))
        );

        // Créer les objets PropertyImageRequest avec les fichiers WebP (sans base64)
        const newImages: PropertyImageRequest[] = webpFiles.map((webpFile, index) => ({
          imageData: '', // Sera rempli après l'upload
          contentType: webpFile.type || 'image/webp',
          altText: webpFile.name,
            isMainImage: (formData.images?.length || 0) === 0 && index === 0,
            displayOrder: (formData.images?.length || 0) + index + 1,
        }));

        // Mettre à jour les états
      const updatedImages = [...(formData.images || []), ...newImages];
        const updatedWebpFiles = [...webpFiles, ...webpFiles];
        
      handleInputChange("images", updatedImages);
        setWebpFiles(updatedWebpFiles);
      } catch (error) {
        console.error('Erreur lors de la conversion en WebP:', error);
        alert('Erreur lors de la conversion des images. Veuillez réessayer.');
      }
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
            file.type === "image/jpg" ||
            file.type === "image/webp"),
      );

      if (imageFiles.length + (formData.images?.length || 0) > 10) {
        alert("Vous ne pouvez pas ajouter plus de 10 images au total.");
        return;
      }

      try {
        // Convertir les fichiers en WebP
        const webpFiles = await Promise.all(
          imageFiles.map(file => convertFileToWebP(file))
        );

        // Créer les objets PropertyImageRequest avec les fichiers WebP (sans base64)
        const newImages: PropertyImageRequest[] = webpFiles.map((webpFile, index) => ({
          imageData: '', // Sera rempli après l'upload
          contentType: webpFile.type || 'image/webp',
          altText: webpFile.name,
            isMainImage: (formData.images?.length || 0) === 0 && index === 0,
            displayOrder: (formData.images?.length || 0) + index + 1,
        }));

        // Mettre à jour les états
      const updatedImages = [...(formData.images || []), ...newImages];
        const updatedWebpFiles = [...webpFiles, ...webpFiles];
        
      handleInputChange("images", updatedImages);
        setWebpFiles(updatedWebpFiles);
      } catch (error) {
        console.error('Erreur lors de la conversion en WebP:', error);
        alert('Erreur lors de la conversion des images. Veuillez réessayer.');
      }
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
    const newWebpFiles = webpFiles.filter((_, i) => i !== index);
    
    handleInputChange("images", newImages);
    setWebpFiles(newWebpFiles);
    
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
        if (formData.bedrooms === undefined || formData.bedrooms < 1) {
          newErrors.bedrooms = "Le nombre de chambres doit être au moins 1";
        }
        if (formData.beds === undefined || formData.beds < 1) {
          newErrors.beds = "Le nombre de lits doit être au moins 1";
        }
        if (formData.bathrooms === undefined || formData.bathrooms < 1) {
          newErrors.bathrooms = "Le nombre de salles de bain doit être au moins 1";
        }
        if (formData.maxGuests === undefined || formData.maxGuests < 1) {
          newErrors.maxGuests = "La capacité maximale doit être au moins 1";
        }
        if (formData.squareMeters === undefined || formData.squareMeters < 1) {
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
        if (formData.pricePerNight === undefined || formData.pricePerNight < 1) {
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

    // Protection contre les soumissions multiples
    if (showPageLoader) {
      return;
    }

    setShowPageLoader(true);
    
    try {
    const propertyService = getPropertyService();

      // Convertir les images WebP en base64 (meilleur pour l'affichage)
      const imagesWithBase64 = await Promise.all(
        webpFiles.map(async (file, index) => {
          return new Promise<PropertyImageRequest>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              const dataUrl = reader.result as string; // data:image/webp;base64,iVBORw0KGgo...
              resolve({
                imageData: dataUrl, // Data URL prêt pour l'affichage et la transmission
                contentType: file.type || 'image/webp', // MIME type
                altText: formData.images?.[index]?.altText || file.name,
                isMainImage: index === 0, // La première image est toujours l'image principale
                displayOrder: formData.images?.[index]?.displayOrder || index + 1,
              });
            };
            reader.readAsDataURL(file); // Meilleur pour l'affichage
          });
        })
      );

      // Créer la propriété avec les images base64
    const createRequest: CreatePropertyRequest = {
      ...(formData as CreatePropertyRequest),
        maxGuests: formData.maxGuests || 1,
        bedrooms: formData.bedrooms || 1,
        beds: formData.beds || 1,
        bathrooms: formData.bathrooms || 1,
        squareMeters: formData.squareMeters || 0,
        pricePerNight: formData.pricePerNight || 0,
        cleaningFee: formData.cleaningFee || 0,
        serviceFee: formData.serviceFee || 0,
        images: imagesWithBase64,
      };

      console.log('Creating property with base64 images...');
      const propertyResponse = await propertyService.createProperty(createRequest);
      console.log('Property created with images:', propertyResponse);
      
      if (propertyResponse) {
      setShowPageLoader(false);
      // Redirection vers le dashboard du propriétaire avec un paramètre pour forcer la revalidation
      router.push("/dashboard?refresh=true");
    }
    } catch (error) {
      console.error('Erreur lors de la création de la propriété:', error);
      alert('Erreur lors de la création de la propriété. Veuillez réessayer.');
    } finally {
    setShowPageLoader(false);
    }
  };

  const stepTitles = [
    "Informations générales",
    "Capacité et équipements", 
    "Localisation",
    "Tarification",
    "Images du logement",
    "Disponibilités",
    "Récapitulatif"
  ];

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between">
          {Array.from({ length: totalSteps }, (_, index) => (
            <div key={index} className="flex flex-col items-center flex-1 relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                index + 1 < currentStep
                  ? "bg-green-500 text-white"
                  : index + 1 === currentStep
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-500"
              }`}>
                {index + 1 < currentStep ? "✓" : index + 1}
              </div>
              
              <div className="mt-2 text-center">
                <div className={`text-xs font-medium transition-colors duration-200 ${
                  index + 1 <= currentStep ? "text-gray-700" : "text-gray-400"
                }`}>
                  {stepTitles[index]}
                </div>
              </div>
              
              {/* Barre de progression entre les étapes */}
              {index < totalSteps - 1 && (
                <div className="absolute top-4 left-1/2 w-full h-0.5 bg-gray-200 -z-10">
                  <div className={`h-full transition-all duration-500 ${
                    index + 1 < currentStep ? "bg-green-500" : "bg-gray-200"
                  }`} style={{ width: "100%" }} />
                </div>
              )}
            </div>
          ))}
        </div>
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
            value={formData.bedrooms?.toString() || ""}
            onChange={(e) => {
              const value =
                e.target.value === "" ? undefined : parseInt(e.target.value) || undefined;
              handleInputChange("bedrooms", value);
              
              // Validation en temps réel pour les champs numériques
              if (value && value >= 1 && errors.bedrooms) {
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
            value={formData.beds?.toString() || ""}
            onChange={(e) => {
              const value =
                e.target.value === "" ? undefined : parseInt(e.target.value) || undefined;
              handleInputChange("beds", value);
              
              // Validation en temps réel pour les champs numériques
              if (value && value >= 1 && errors.beds) {
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
            value={formData.bathrooms?.toString() || ""}
            onChange={(e) => {
              const value =
                e.target.value === "" ? undefined : parseInt(e.target.value) || undefined;
              handleInputChange("bathrooms", value);
              
              // Validation en temps réel pour les champs numériques
              if (value && value >= 1 && errors.bathrooms) {
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
            value={formData.maxGuests?.toString() || ""}
            onChange={(e) => {
              const value =
                e.target.value === "" ? undefined : parseInt(e.target.value) || undefined;
              handleInputChange("maxGuests", value);
              
              // Validation en temps réel pour les champs numériques
              if (value && value >= 1 && errors.maxGuests) {
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
          value={formData.squareMeters?.toString() || ""}
          onChange={(e) => {
            const value =
              e.target.value === "" ? undefined : parseInt(e.target.value) || undefined;
            handleInputChange("squareMeters", value);
            
            // Validation en temps réel pour les champs numériques
            if (value && value >= 1 && errors.squareMeters) {
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
          value={formData.pricePerNight?.toString() || ""}
          onChange={(e) => {
            const value =
              e.target.value === "" ? undefined : parseInt(e.target.value) || undefined;
            handleInputChange("pricePerNight", value);
            
            // Validation en temps réel pour les champs numériques
            if (value && value >= 1 && errors.pricePerNight) {
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
            value={formData.cleaningFee?.toString() || ""}
            onChange={(e) => {
              const value =
                e.target.value === "" ? undefined : parseInt(e.target.value) || undefined;
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
            value={formData.serviceFee?.toString() || ""}
            onChange={(e) => {
              const value =
                e.target.value === "" ? undefined : parseInt(e.target.value) || undefined;
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
                        src={webpFiles[index] ? URL.createObjectURL(webpFiles[index]) : image.imageData}
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
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Configurez votre disponibilité
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Définissez les dates disponibles pour votre logement. Vous pourrez modifier ces paramètres à tout moment depuis votre tableau de bord.
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Information importante</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Votre logement sera automatiquement disponible dès sa validation. Vous pourrez ensuite configurer des périodes spécifiques, 
              des prix spéciaux et marquer des dates comme indisponibles.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Gestion de la disponibilité
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Une fois votre logement créé, vous pourrez accéder à un calendrier complet pour gérer votre disponibilité, 
            définir des prix spéciaux et configurer des périodes d'indisponibilité.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-sm font-medium text-gray-900">Disponibilité</h4>
              <p className="text-xs text-gray-600">Marquez les dates disponibles</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h4 className="text-sm font-medium text-gray-900">Prix spéciaux</h4>
              <p className="text-xs text-gray-600">Définissez des tarifs saisonniers</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="text-sm font-medium text-gray-900">Maintenance</h4>
              <p className="text-xs text-gray-600">Bloquez des dates si nécessaire</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep7 = () => (
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
              <p className="text-gray-900">{formData.maxGuests || "Non renseigné"}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Chambres</span>
              <p className="text-gray-900">{formData.bedrooms || "Non renseigné"}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Lits</span>
              <p className="text-gray-900">{formData.beds || "Non renseigné"}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Salles de bain</span>
              <p className="text-gray-900">{formData.bathrooms || "Non renseigné"}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Surface (m²)</span>
              <p className="text-gray-900">{formData.squareMeters || "Non renseigné"}</p>
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
              <p className="text-gray-900">{formData.pricePerNight || "Non renseigné"} {formData.pricePerNight ? "€" : ""}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Frais de ménage</span>
              <p className="text-gray-900">{formData.cleaningFee || "Non renseigné"} {formData.cleaningFee ? "€" : ""}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Frais de service</span>
              <p className="text-gray-900">{formData.serviceFee || "Non renseigné"} {formData.serviceFee ? "€" : ""}</p>
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
                      src={webpFiles[index] ? URL.createObjectURL(webpFiles[index]) : image.imageData}
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

        {/* Disponibilité */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center">
            <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm mr-3">6</span>
            Disponibilité
          </h3>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-green-900">Disponibilité automatique</h4>
                <p className="text-sm text-green-700">
                  Votre logement sera automatiquement disponible dès sa validation. 
                  Vous pourrez ensuite configurer des périodes spécifiques depuis votre tableau de bord.
                </p>
              </div>
            </div>
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
      case 7:
        return renderStep7();
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
