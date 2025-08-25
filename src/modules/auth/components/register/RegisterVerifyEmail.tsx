"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "@/hooks/useAuth";
import { useAuth as useAuthContext } from "@/context/AuthContext";
import { Loader, Mail } from "lucide-react";

// Schema for code validation
const schema = yup.object({
  code: yup
    .string()
    .required("Le code est requis")
    .matches(/^\d{6}$/, "Le code doit contenir 6 chiffres"),
});

type VerifyCodeFormData = {
  code: string;
};

export const RegisterVerifyEmail: React.FC = () => {
  const router = useRouter();
  const {
    registerVerifyEmailCode,
    resendRegisterEmailVerification,
    isLoading,
    error,
    fieldErrors,
    success,
    clearError,
    clearSuccess,
    clearFieldErrors,
  } = useAuth();
  const { registerEmail } = useAuthContext();

  const [codeDigits, setCodeDigits] = useState(["", "", "", "", "", ""]);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VerifyCodeFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  // Handle digit input
  const handleDigitChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;
    if (value.length > 1) return; // Only allow single digit

    const newDigits = [...codeDigits];
    newDigits[index] = value;
    setCodeDigits(newDigits);

    // Update form value
    const fullCode = newDigits.join("");
    setValue("code", fullCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !codeDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text/plain")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (pastedData.length === 6) {
      const digits = pastedData.split("");
      setCodeDigits(digits);
      setValue("code", pastedData);

      // Focus last input
      inputRefs.current[5]?.focus();
    }
  };

  const onSubmit = async (data: VerifyCodeFormData) => {
    if (!registerEmail) {
      return;
    }

    // Afficher le loader de redirection immédiatement
    setIsRedirecting(true);

    const response = await registerVerifyEmailCode(registerEmail, data.code);

    if (response.success) {
      // Nettoyer le message de succès pour ne pas l'afficher
      clearSuccess();

      // Redirection immédiate vers la page de complétion
      router.push("/register-complete");
    } else {
      // Masquer le loader en cas d'erreur
      setIsRedirecting(false);
      console.error(
        "Erreur lors de la vérification du code:",
        response.message,
      );
      // L'erreur sera automatiquement affichée par le hook useAuth
    }
  };

  const handleResendCode = async () => {
    if (!registerEmail) return;

    await resendRegisterEmailVerification(registerEmail);
  };

  // Si pas d'email dans le contexte, afficher une erreur
  if (!registerEmail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
            <h1 className="text-2xl font-normal text-gray-700 mb-2">Erreur</h1>
            <p className="text-gray-600 mb-6">
              Aucun email en cours de vérification. Veuillez retourner à la page
              d'inscription.
            </p>
            <Link
              href="/register-email"
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              Retour à l'inscription
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-2xl font-normal text-gray-700 mb-2">
              Vérifiez votre email
            </h1>
            <p className="text-gray-600">
              Saisissez le code que vous avez reçu par mail à l'adresse{" "}
              <span className="font-normal text-purple-600">{registerEmail}</span>
            </p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Hidden input for form validation */}
            <input type="hidden" {...register("code")} />

            {/* 6-digit input */}
            <div className="flex justify-center space-x-3">
              {codeDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className={`w-14 h-14 text-center text-2xl font-mono border-2 rounded-xl transition-all duration-200 ${
                    errors.code || fieldErrors?.code
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-200 hover:border-gray-300 focus:border-purple-500 focus:ring-purple-100"
                  }`}
                  autoComplete="off"
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              ))}
            </div>

            {/* Error messages */}
            {fieldErrors?.code && (
              <p className="text-sm text-red-600 text-center">
                {fieldErrors.code}
              </p>
            )}
            {!fieldErrors?.code && errors.code && (
              <p className="text-sm text-red-600 text-center">
                {errors.code.message}
              </p>
            )}
            {!fieldErrors?.code && !errors.code && error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isRedirecting}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
                "Vérifier le code"
              )}
            </button>
          </form>

          {/* Resend Code Section */}
          <div className="mt-6 text-center">
            <button
              onClick={handleResendCode}
              className="text-purple-600 hover:text-purple-700 font-normal transition-colors"
            >
              Renvoyer le code
            </button>
          </div>

          {/* Back to Register */}
          <div className="mt-6 text-center">
            <Link
              href="/register-email"
              className="text-gray-600 hover:text-gray-700 font-medium transition-colors"
            >
              ← Retour à l'inscription
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
