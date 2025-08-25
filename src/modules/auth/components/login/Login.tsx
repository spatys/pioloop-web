"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, Loader } from "lucide-react";

// Validation schema
const loginSchema = yup.object({
  email: yup
    .string()
    .required("L'email est requis")
    .email("Veuillez entrer un email valide"),
  password: yup
    .string()
    .required("Le mot de passe est requis")
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

type LoginFormData = {
  email: string;
  password: string;
};

export const Login: React.FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const {
    login,
    isLoading,
    error,
    fieldErrors,
    globalErrors,
    success,
    clearError,
    clearSuccess,
    clearFieldErrors,
    clearGlobalErrors,
    clearAllErrors,
  } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: "onChange", // Validation en temps réel
  });

  const watchedEmail = watch("email");
  const watchedPassword = watch("password");

  const onSubmit = async (data: LoginFormData) => {
    clearAllErrors();
    const response = await login(data);
    if (response.success) {
      // Nettoyer le message de succès pour ne pas l'afficher
      clearSuccess();
      console.log(response);

      router.push("/");
    } else {
      console.error("Erreur lors de la connexion:", response.message);
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
              Se connecter
            </h1>
          </div>

          {/* Formulaire */}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Erreurs globales */}
            {globalErrors && globalErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                {globalErrors.map((error, index) => (
                  <p key={index} className="text-red-600 text-sm">
                    {error}
                  </p>
                ))}
              </div>
            )}

            {/* Email Input avec floating label */}
            <div className="relative">
              <input
                id="email"
                type="email"
                autoComplete="email"
                disabled={isLoading}
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
            </div>

            {/* Password Input avec floating label */}
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                disabled={isLoading}
                {...register("password")}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-4 pr-12 border rounded-xl transition-all duration-200 ${
                  errors.password || fieldErrors?.password
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : focusedField === "password" && (!watchedPassword || watchedPassword.trim() === "")
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : "border-gray-200 hover:border-gray-300 focus:border-purple-500 focus:ring-purple-100"
                }`}
              />
              <label
                htmlFor="password"
                className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                  focusedField === "password" || watchedPassword
                    ? "top-2 text-xs text-purple-600 px-2"
                    : "top-4 text-sm text-gray-500"
                }`}
              >
                Mot de passe
              </label>
              <button
                type="button"
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {fieldErrors?.password && (
                <p className="mt-2 text-sm text-red-600">
                  {fieldErrors.password}
                </p>
              )}
              {!fieldErrors?.password && errors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-4 px-6 rounded-xl font-normal hover:bg-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl"
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
                "Se connecter"
              )}
            </button>

            {/* S'inscrire Button */}
            <button
              type="button"
              onClick={() => router.push("/register-email")}
              className="w-full bg-white text-purple-600 py-4 px-6 rounded-xl font-normal border border-purple-300 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 flex items-center justify-center"
            >
              S'inscrire
            </button>
          </form>

          {/* Liens mot de passe oublié */}
          <div className="flex justify-end mt-6 text-sm">
            <Link
              href="/forgot-password"
              className="text-purple-600 hover:text-purple-700 transition-colors"
            >
              Mot de passe oublié ?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
