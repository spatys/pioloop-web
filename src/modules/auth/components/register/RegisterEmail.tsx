"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "@/hooks/useAuth";
import { useAuth as useAuthContext } from "@/context/AuthContext";
import { Loader } from "lucide-react";

// Schéma de validation
const schema = yup.object({
  email: yup
    .string()
    .required("L'email est requis")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "L'email invalide",
    ),
});

type RegisterFormData = {
  email: string;
};

export const RegisterEmail: React.FC = () => {
  const router = useRouter();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const {
    registerEmail,
    isLoading,
    error,
    fieldErrors,
    success,
    clearError,
    clearSuccess,
    clearFieldErrors,
  } = useAuth();
  const { setRegisterEmail } = useAuthContext();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
    mode: "onChange", // Validation en temps réel
  });

  const watchedEmail = watch("email");

  const onSubmit = async (data: RegisterFormData) => {
    const response = await registerEmail(data.email);

    if (response.success && response.data) {
      // Nettoyer le message de succès pour ne pas l'afficher
      clearSuccess();

      // Stocker l'email dans le contexte
      setRegisterEmail(data.email);

      // Redirection directe vers la page de vérification
      router.push("/register-verify-email");
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f5fa] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo centré */}
        <div className="text-center mb-8">
          <Logo className="justify-center" href="/" />
        </div>

        {/* Card principale */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* En-tête */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-normal text-gray-700 mb-2">
              Créer un compte
            </h1>
          </div>

          {/* Formulaire */}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Input avec floating label */}
            <div className="relative">
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-4 border rounded-xl transition-all duration-200 ${
                  errors.email || fieldErrors?.email
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : focusedField === "email" && (!watchedEmail || watchedEmail.trim() === "")
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : "border-gray-200 hover:border-gray-300 focus:border-purple-500 focus:ring-purple-100"
                }`}
              />
              <label
                htmlFor="email"
                className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                  focusedField === "email" || watchedEmail
                    ? "top-2 text-xs text-purple-600 px-2"
                    : "top-4 text-sm text-gray-500"
                }`}
              >
                Email
              </label>
              {fieldErrors?.email && (
                <p className="mt-2 text-sm text-red-600">{fieldErrors.email}</p>
              )}
              {!fieldErrors?.email && errors.email && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
              {!fieldErrors?.email && !errors.email && error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}

            {/* Continue Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-4 px-6 rounded-xl font-normal hover:bg-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
            >
              {isLoading ? (
                <Loader
                  className="h-5 w-5 text-white"
                  style={{
                    animation: "spin 1s linear infinite",
                    transformOrigin: "center",
                  }}
                />
              ) : (
                "Continuer"
              )}
            </button>
          </form>

          {/* Conditions d'utilisation */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 leading-relaxed">
              En m'inscrivant, j'accepte les{" "}
              <Link
                href="/conditions-generales"
                className="text-purple-600 hover:text-purple-700 font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Conditions générales
              </Link>
              , la{" "}
              <Link
                href="/politique-confidentialite"
                className="text-purple-600 hover:text-purple-700 font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Politique de confidentialité
              </Link>{" "}
              et les{" "}
              <Link
                href="/conditions-service-paiement"
                className="text-purple-600 hover:text-purple-700 font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Conditions de service de paiement
              </Link>{" "}
              de Pioloop.
            </p>
          </div>

          {/* Lien de connexion */}
          <div className="text-center mt-6">
            <span className="text-gray-600">Déjà un compte ? </span>
            <Link
              href="/login"
              className="text-purple-600 font-normal hover:text-purple-700 transition-colors"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
