"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "@/hooks/useAuth";
import { useAuth as useAuthContext } from "@/context/AuthContext";
import { CompleteRegisterForm } from "@/core/types/Forms";
import { Eye, EyeOff, Loader } from "lucide-react";

// Schema de validation
const schema = yup.object({
  firstName: yup
    .string()
    .required("Le prénom est requis")
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères"),
  lastName: yup
    .string()
    .required("Le nom est requis")
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
  password: yup
    .string()
    .required("Le mot de passe est requis")
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre",
    ),
  confirmPassword: yup
    .string()
    .required("La confirmation du mot de passe est requise")
    .oneOf([yup.ref("password")], "Les mots de passe ne correspondent pas"),
});

export const RegisterComplete: React.FC = () => {
  const router = useRouter();
  const {
    registerComplete,
    isLoading,
    error,
    success,
    clearError,
    clearSuccess,
  } = useAuth();
  const { registerEmail } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CompleteRegisterForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const watchedFields = watch();

  const onSubmit = async (data: CompleteRegisterForm) => {
    if (!registerEmail) {
      console.error("Aucun email en cours de vérification");
      return;
    }

    // Afficher le loader de redirection immédiatement
    setIsRedirecting(true);

    const response = await registerComplete({
      email: registerEmail,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });

    if (response.success) {
      // Nettoyer le message de succès pour ne pas l'afficher
      clearSuccess();

      console.log("Inscription complétée avec succès");

      // Attendre 2 secondes avant la redirection pour laisser le temps de voir le succès
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } else {
      // Masquer le loader en cas d'erreur
      setIsRedirecting(false);
      console.error(
        "Erreur lors de la complétion de l'inscription:",
        response.message,
      );
      // L'erreur sera automatiquement affichée par le hook useAuth
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
              Complétez votre profil
            </h1>
            <p className="text-gray-600">
              Ajoutez vos informations personnelles pour finaliser votre inscription
            </p>
          </div>

          {/* Formulaire */}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Last Name Input avec floating label */}
            <div className="relative">
              <input
                id="lastName"
                type="text"
                autoComplete="family-name"
                disabled={isLoading || isRedirecting}
                {...register("lastName")}
                onFocus={() => setFocusedField("lastName")}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-4 border rounded-xl transition-all duration-200 ${
                  errors.lastName
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : focusedField === "lastName" && (!watchedFields.lastName || watchedFields.lastName.trim() === "")
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : "border-gray-200 hover:border-gray-300 focus:border-purple-500 focus:ring-purple-100"
                }`}
              />
              <label
                htmlFor="lastName"
                className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                  focusedField === "lastName" || watchedFields.lastName
                    ? "top-2 text-xs text-purple-600 px-2"
                    : "top-4 text-sm text-gray-500"
                }`}
              >
                Nom
              </label>
              {errors.lastName && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            {/* First Name Input avec floating label */}
            <div className="relative">
              <input
                id="firstName"
                type="text"
                autoComplete="given-name"
                disabled={isLoading || isRedirecting}
                {...register("firstName")}
                onFocus={() => setFocusedField("firstName")}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-4 border rounded-xl transition-all duration-200 ${
                  errors.firstName
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : focusedField === "firstName" && (!watchedFields.firstName || watchedFields.firstName.trim() === "")
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : "border-gray-200 hover:border-gray-300 focus:border-purple-500 focus:ring-purple-100"
                }`}
              />
              <label
                htmlFor="firstName"
                className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                  focusedField === "firstName" || watchedFields.firstName
                    ? "top-2 text-xs text-purple-600 px-2"
                    : "top-4 text-sm text-gray-500"
                }`}
              >
                Prénom
              </label>
              {errors.firstName && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Password Input avec floating label */}
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                disabled={isLoading || isRedirecting}
                {...register("password")}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-4 pr-12 border rounded-xl transition-all duration-200 ${
                  errors.password
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : focusedField === "password" && (!watchedFields.password || watchedFields.password.trim() === "")
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : "border-gray-200 hover:border-gray-300 focus:border-purple-500 focus:ring-purple-100"
                }`}
              />
              <label
                htmlFor="password"
                className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                  focusedField === "password" || watchedFields.password
                    ? "top-2 text-xs text-purple-600 px-2"
                    : "top-4 text-sm text-gray-500"
                }`}
              >
                Mot de passe
              </label>
              <button
                type="button"
                disabled={isLoading || isRedirecting}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Input avec floating label */}
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                disabled={isLoading || isRedirecting}
                {...register("confirmPassword")}
                onFocus={() => setFocusedField("confirmPassword")}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-4 pr-12 border rounded-xl transition-all duration-200 ${
                  errors.confirmPassword
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : focusedField === "confirmPassword" && (!watchedFields.confirmPassword || watchedFields.confirmPassword.trim() === "")
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : "border-gray-200 hover:border-gray-300 focus:border-purple-500 focus:ring-purple-100"
                }`}
              />
              <label
                htmlFor="confirmPassword"
                className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                  focusedField === "confirmPassword" || watchedFields.confirmPassword
                    ? "top-2 text-xs text-purple-600 px-2"
                    : "top-4 text-sm text-gray-500"
                }`}
              >
                Confirmer le mot de passe
              </label>
              <button
                type="button"
                disabled={isLoading || isRedirecting}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => setShowConfirmPassword((v) => !v)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isRedirecting}
              className="w-full bg-purple-600 text-white py-4 px-6 rounded-xl font-normal hover:bg-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
            >
              {isLoading || isRedirecting ? (
                <Loader
                  className="h-5 w-5 text-white"
                  style={{
                    animation: "spin 1s linear infinite",
                    transformOrigin: "center",
                  }}
                />
              ) : (
                "Valider"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
