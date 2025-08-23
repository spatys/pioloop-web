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
import { Loader } from 'lucide-react';

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

export const RegisterVerifyEmail: React.FC = () => {
  const router = useRouter();
  const { registerVerifyEmailCode, resendRegisterEmailVerification, isLoading, error, fieldErrors, success, clearError, clearSuccess, clearFieldErrors } = useAuth();
  const { registerEmail } = useAuthContext();

  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const [isRedirecting, setIsRedirecting] = useState(false);
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

    // Auto-submit when all 6 digits are entered
    // if (fullCode.length === 6) {
    //   // Submit immediately when all 6 digits are entered
    //   onSubmit({ code: fullCode });
    // }
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
    if (!registerEmail) {
      return;
    }

    // Afficher le loader de redirection immédiatement
    setIsRedirecting(true);

    const response = await registerVerifyEmailCode(registerEmail, data.code);
    //const response = { success: true, message: 'Code vérifié avec succès' };

    if (response.success) {
      // Nettoyer le message de succès pour ne pas l'afficher
      clearSuccess();
      
      // Attendre 2 secondes avant la redirection pour laisser le temps de voir le succès
      setTimeout(() => {
        router.push('/register-complete');
      }, 1500);
    } else {
      // Masquer le loader en cas d'erreur
      setIsRedirecting(false);
      console.error('Erreur lors de la vérification du code:', response.message);
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Erreur</h1>
          <p className="text-gray-600">Aucun email en cours de vérification. Veuillez retourner à la page d'inscription.</p>
          <Link href="/register-email" className="text-purple-600 hover:text-purple-500 font-medium mt-4 inline-block">
            Retour à l'inscription
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Colonne gauche : formulaire */}
      <div className="flex-1 flex flex-col items-center bg-white">
        {/* Logo avec padding */}
        <div className="px-8 w-full pt-8">
          <div className="mb-6">
            <Logo className="justify-center" href="/" />
          </div>
        </div>
        
        {/* Separator - pleine largeur */}
        <div className="border-t border-gray-200 mb-6 w-full" />
        
        {/* Contenu avec padding */}
        <div className="px-8 w-full">
          <h2 className="text-2xl font-semibold mb-4 text-center">Confirmation Email</h2>
          <p className="text-gray-600 text-center mb-6 max-w-md mx-auto">
            Saisissez le code que vous avez reçu par mail à l'adresse {' '}
            <span className="font-medium text-purple-600">{registerEmail}</span>
          </p>
          
          <div className="w-full max-w-md space-y-6 mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                    className={`w-12 h-12 text-center text-2xl font-mono border-2 rounded-lg transition-colors outline-none ${
                      errors.code || fieldErrors?.code ? 'border-red-300 focus:border-red-500' : 'border-gray-300 hover:border-gray-400 focus:border-purple-500'
                    }`}
                    autoComplete="off"
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                ))}
              </div>
              

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || isRedirecting}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading || isRedirecting ? (
                  <Loader 
                    className="h-5 w-5 text-white" 
                    style={{ 
                      animation: 'spin 1s linear infinite',
                      transformOrigin: 'center'
                    }} 
                  />
                ) : (
                  'Vérifier le code'
                )}
              </button>

              {fieldErrors?.code && (
                <p className="mt-1 text-sm text-red-600 text-center">{fieldErrors.code}</p>
              )}
              {!fieldErrors?.code && errors.code && (
                <p className="mt-1 text-sm text-red-600 text-center">{errors.code.message}</p>
              )}
              {!fieldErrors?.code && !errors.code && error && (
                <p className="mt-1 text-sm text-red-600 text-center">{error}</p>
              )}


            </form>

                         {/* Resend Code Section */}
             <div className="text-center">
               <button
                 onClick={handleResendCode}
                 className="text-purple-600 hover:text-purple-500 font-medium"
               >
                 Renvoyer le code
               </button>
             </div>

            {/* Back to Register */}
            <div className="text-center">
              <Link href="/register-email" className="text-purple-600 hover:text-purple-500 font-medium">
                ← Retour à l'inscription
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Colonne droite : illustration */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-violet-50">
        <img src="/images/register.png" alt="Illustration" className="w-full h-full" />
      </div>
    </div>
  );
}; 