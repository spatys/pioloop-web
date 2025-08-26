"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Home, Plus, ArrowRight, Shield, Users, DollarSign } from "lucide-react";

interface UnauthorizedPageProps {
  requiredRole: string;
  currentRole?: string;
  message?: string;
  upgradePath?: string;
}

export const UnauthorizedPage: React.FC<UnauthorizedPageProps> = ({
  requiredRole,
  currentRole = "Tenant",
  message,
  upgradePath = "/property/add"
}) => {
  const router = useRouter();

  const getRoleInfo = () => {
    switch (requiredRole) {
      case "Owner":
        return {
          title: "Accès réservé aux propriétaires",
          description: "Cette section est réservée aux propriétaires de logements. Ajoutez votre premier logement pour devenir propriétaire et accéder à toutes les fonctionnalités.",
          icon: Home,
          benefits: [
            "Gérez vos propriétés et réservations",
            "Suivez vos revenus et performances",
            "Accédez aux outils de gestion avancés",
            "Recevez des notifications en temps réel"
          ]
        };
      case "Admin":
        return {
          title: "Accès administrateur requis",
          description: "Cette section nécessite des privilèges administrateur.",
          icon: Shield,
          benefits: []
        };
      default:
        return {
          title: "Accès non autorisé",
          description: "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
          icon: Shield,
          benefits: []
        };
    }
  };

  const roleInfo = getRoleInfo();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Icône */}
          <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
            <roleInfo.icon className="h-8 w-8 text-red-600" />
          </div>
          
          {/* Titre */}
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {roleInfo.title}
          </h2>
          
          {/* Description */}
          <p className="mt-2 text-sm text-gray-600">
            {message || roleInfo.description}
          </p>
        </div>

        {/* Informations sur le rôle actuel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Users className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600">
              Votre rôle actuel : <span className="font-medium text-gray-900">{currentRole}</span>
            </span>
          </div>
        </div>

        {/* Avantages si c'est pour devenir propriétaire */}
        {requiredRole === "Owner" && roleInfo.benefits.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Avantages d'être propriétaire
            </h3>
            <ul className="space-y-3">
              {roleInfo.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <DollarSign className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-4">
          {requiredRole === "Owner" && (
            <button
              onClick={() => router.push(upgradePath)}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Ajouter mon premier logement
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          )}
          
          <button
            onClick={() => router.push("/")}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>

        {/* Aide */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Besoin d'aide ? <button className="text-purple-600 hover:text-purple-500">Contactez le support</button>
          </p>
        </div>
      </div>
    </div>
  );
};
