'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/hooks/useAuth';
import { useAuth as useAuthContext } from '@/context/AuthContext';

// Schéma de validation
const schema = yup.object({
  email: yup
    .string()
    .required('L\'email est requis')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'L\'email invalide'
    )
});

type RegisterFormData = {
  email: string;
};

export const RegistrationEmail: React.FC = () => {
  const router = useRouter();
  const { registrationEmail, isLoading, error, success, clearError, clearSuccess } = useAuth();
  const { setRegistrationEmail, setRegistrationExpirationMinutes } = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange' // Validation en temps réel
  });

  const onSubmit = async (data: RegisterFormData) => {
    const response = await registrationEmail(data.email);

    console.log(response)
    
    if (response.success && response.data) {
      // console.log('Inscription par email réussie:', response.data.message);
      // Stocker l'email et l'expiration dans le contexte
      setRegistrationEmail(data.email);
      setRegistrationExpirationMinutes(response.data.expirationMinutes);
      // Redirection vers la page de vérification (sans email dans l'URL)
      router.push('/registration-verify-code');
    } else {
      console.error('Erreur lors de l\'inscription par email:', response.message);
      // L'erreur sera automatiquement affichée par le hook useAuth
    }
  };

  return (
    <>
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
            <h1 className="text-3xl font-semibold text-gray-700 mb-2">Bienvenue</h1>
            <p className="text-gray-600">Créez votre compte en quelques étapes simples</p>
          </div>

          {/* Form Container - Centered */}
          <div className="flex justify-center">
            <div className="w-full max-w-sm">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email Input */}
                <div>
                  <input
                    id="email"
                    type="email"
                    placeholder="E-mail"
                    autoComplete="off"
                    {...register("email")}
                    className={`w-full px-4 py-3 border rounded-lg transition-colors outline-none ${
                      errors.email || error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 hover:border-gray-400 focus:border-purple-500'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                  {error && !errors.email && (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                  )}
                </div>

                {/* Success Message */}
                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-600">{success}</p>
                  </div>
                )}

                {/* Continue Button */}
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
                    </>
                  ) : (
                    'Continuer'
                  )}
                </button>
              </form>

              {/* Separator */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">ou continuer avec</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="flex justify-center space-x-4">
                {/* Google Button */}
                <button className="w-12 h-12 bg-white border border-gray-200 rounded-lg transition-all duration-200 flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </button>

                {/* Facebook Button */}
                <button className="w-12 h-12 bg-blue-600 rounded-lg transition-all duration-200 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Déjà un compte ?{' '}
              <Link href="/login" className="text-purple-600 hover:text-purple-500 font-medium">
                Se connecter
              </Link>
            </p>
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
    </>
  );
}; 