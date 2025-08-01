'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/hooks/useAuth';
import { useAuth as useAuthContext } from '@/context/AuthContext';

// Schema for code validation
const schema = yup.object({
  code: yup
    .string()
    .required('Le code est requis')
    .matches(/^\d{6}$/, 'Le code doit contenir 6 chiffres')
});

type VerifyCodeFormData = {
  code: string;
};

export const RegistrationVerifyEmail: React.FC = () => {
  const router = useRouter();
  const { registrationVerifyEmailCode, isLoading, error, success, clearError, clearSuccess } = useAuth();
  const { registrationEmail, registrationExpirationMinutes } = useAuthContext();
  const [timeLeft, setTimeLeft] = useState(registrationExpirationMinutes ? registrationExpirationMinutes * 60 : 60);
  const [canResend, setCanResend] = useState(false);
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<VerifyCodeFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  // Initialize timer when component mounts or expiration changes
  useEffect(() => {
    if (registrationExpirationMinutes) {
      setTimeLeft(registrationExpirationMinutes * 60);
      setCanResend(false);
    }
  }, [registrationExpirationMinutes]);

  // Countdown logic
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Time formatting
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle digit input
  const handleDigitChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;
    if (value.length > 1) return; // Only allow single digit
    
    const newDigits = [...codeDigits];
    newDigits[index] = value;
    setCodeDigits(newDigits);

    // Update form value
    const fullCode = newDigits.join('');
    setValue('code', fullCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, 6);
    
    if (pastedData.length === 6) {
      const digits = pastedData.split('');
      setCodeDigits(digits);
      setValue('code', pastedData);
      
      // Focus last input
      inputRefs.current[5]?.focus();
    }
  };

  const onSubmit = async (data: VerifyCodeFormData) => {
    if (!registrationEmail) {
      console.error('Aucun email en cours de vérification');
      return;
    }

    const response = await registrationVerifyEmailCode(registrationEmail, data.code);
    // const response = { success: true, message: 'Code vérifié avec succès' };

    if (response.success) {
      // Nettoyer le message de succès pour ne pas l'afficher
      clearSuccess();
      
      console.log('Code vérifié avec succès');
      router.push('/registration-complete');
    } else {
      console.error('Erreur lors de la vérification du code:', response.message);
      // L'erreur sera automatiquement affichée par le hook useAuth
    }
  };

  const handleResendCode = async () => {
    // TODO: Implement resend code function
    console.log('Renvoi du code...');
    const newExpiration = registrationExpirationMinutes ? registrationExpirationMinutes * 60 : 60;
    setTimeLeft(newExpiration); // Reset timer with current expiration
    setCanResend(false);
  };

  // Si pas d'email dans le contexte, afficher une erreur
  if (!registrationEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Erreur</h1>
          <p className="text-gray-600">Aucun email en cours de vérification. Veuillez retourner à la page d'inscription.</p>
          <Link href="/registration-email" className="text-purple-600 hover:text-purple-500 font-medium mt-4 inline-block">
            Retour à l'inscription
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Form */}
      <div className="flex-1 flex items-start justify-center bg-white">
        <div className="w-full pt-4">
          {/* Logo */}
          <div className="text-center mb-4">
            <Logo className="justify-center" />
          </div>

          {/* Separator */}
          <div className="border-t border-gray-200 mb-8" />

          {/* Welcome Text */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-700 mb-2">Confirmation Email</h1>
            <p className="text-gray-600">
              Saisissez le code que vous avez reçu par mail à l'adresse {' '}
              <span className="font-medium text-purple-600">{registrationEmail}</span>
            </p>
          </div>

          {/* Form Container - Centered */}
          <div className="flex justify-center">
            <div className="w-full max-w-sm">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Code Input */}
                <div>
                  {/* Hidden input for form validation */}
                  <input
                    type="hidden"
                    {...register("code")}
                  />
                  
                  {/* 6-digit input */}
                  <div className="flex justify-center space-x-2">
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
                        className={`w-12 h-12 text-center text-2xl font-mono border rounded-lg transition-colors outline-none ${
                          errors.code || error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 hover:border-gray-400 focus:border-purple-500'
                        }`}
                        autoComplete="off"
                        inputMode="numeric"
                        pattern="[0-9]*"
                      />
                    ))}
                  </div>
                  
                  {errors.code && (
                    <p className="mt-1 text-sm text-red-600 text-center">{errors.code.message}</p>
                  )}
                  {error && !errors.code && (
                    <p className="mt-1 text-sm text-red-600 text-center">{error}</p>
                  )}
                </div>

                {/* Success Message */}
                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-600">{success}</p>
                  </div>
                )}

                {/* Validate Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Vérification...
                    </>
                  ) : (
                    'Continuer'
                  )}
                </button>
              </form>

              {/* Resend Code Section */}
              <div className="text-center mt-8">
                {canResend ? (
                    <button
                      onClick={handleResendCode}
                      disabled={!canResend}
                      className="text-purple-600 hover:text-purple-500 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      {'Renvoyer le code'}
                    </button>
                ) : (
                  <>
                    <p className="text-gray-600 mb-2">
                      {`Vous n'avez pas reçu un code ? `}
                    </p>
                    <p className="text-gray-600 mb-2">
                      {`Renvoyer de nouveau dans ${formatTime(timeLeft)}`}
                    </p>
                  </>
                )}
              </div>

              {/* Back to Registration */}
              <div className="text-center mt-8">
                <p className="text-gray-600">
                  <Link href="/registration-email" className="text-purple-600 hover:text-purple-500 font-medium">
                    ← Retour
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="h-full flex items-center justify-center">
          <img
            src="/images/register.png"
            alt="Register"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}; 