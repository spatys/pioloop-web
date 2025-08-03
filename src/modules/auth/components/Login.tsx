'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Logo } from '@/components/ui/Logo';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

// Validation schema
const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
});

type LoginFormData = {
  email: string;
  password: string;
};

export const Login: React.FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading: authLoading, error: authError, success, clearError, clearSuccess } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    try {
      const response = await login(data);
      if (response.success) {
        // Nettoyer le message de succès pour ne pas l'afficher
        clearSuccess();
        
        router.push('/');
      } else {
        console.error('Erreur lors de la connexion:', response.message);
        // L'erreur sera automatiquement affichée par le hook useAuth
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ display: 'flex', height: '100vh' }}>
      {/* Left side - Login Form (50%) */}
      <div className="bg-white flex flex-col" style={{ width: '50%', backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
        {/* Logo - Full width */}
        <div className="text-center mb-4 mt-8">
          <Logo className="justify-center" />
        </div>

        {/* Separator - Full width */}
        <div className="border-t border-gray-200 mb-8 w-full" />

        {/* Welcome Text */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-normal text-gray-700 mb-2">Bienvenue</h1>
          <p className="text-gray-600">Connectez vous à votre compte</p>
        </div>

        {/* Form Container - Centered */}
        <div className="flex justify-center px-8">
          <div className="w-full max-w-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Input */}
              <div>
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  autoComplete="off"
                  {...register("email")}
                  className={`w-full px-4 py-3 border rounded-lg transition-colors outline-none ${
                    errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 hover:border-gray-400 focus:border-purple-500'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
                {authError && !errors.email && (
                  <p className="mt-1 text-sm text-red-600">{authError}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mot de passe"
                    autoComplete="off"
                    {...register("password")}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg transition-colors outline-none ${
                      errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 hover:border-gray-400 focus:border-purple-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* Continue Button */}
                              <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {authLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Valider'
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

        {/* Register Link */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Pas encore de compte ?{' '}
            <Link href="/registration-email" className="text-purple-600 hover:text-purple-500 font-medium">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="bg-gray-100" style={{ width: '50%', backgroundColor: '#f0f2f5' }}>
        <img
          src="http://localhost:3000/images/register.png"
          alt="Login"
          className="w-full h-full object-cover block"
        />
      </div>
    </div>
  );
}; 