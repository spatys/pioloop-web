'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Logo } from '@/components/ui/Logo';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, Send, Loader } from "lucide-react";

// Validation schema
const loginSchema = yup.object({
  email: yup
    .string()
    .required('L\'email est requis')
    .email('Veuillez entrer un email valide'),
  password: yup
    .string()
    .required('Le mot de passe est requis')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
});

type LoginFormData = {
  email: string;
  password: string;
};

export const Login: React.FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, fieldErrors, globalErrors, success, clearError, clearSuccess, clearFieldErrors, clearGlobalErrors, clearAllErrors } = useAuth();



  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    clearAllErrors();
    const response = await login(data);
    if (response.success) {
      // Nettoyer le message de succès pour ne pas l'afficher
      clearSuccess();
      console.log(response);
      
      router.push('/');
    } else {
      console.error('Erreur lors de la connexion:', response.message);
      // L'erreur sera automatiquement affichée par le hook useAuth
    }
  };

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
          <h2 className="text-2xl font-semibold mb-4 text-center">Se connecter</h2>
          <p className="text-gray-600 text-center mb-6 max-w-md mx-auto">
            Accédez à votre espace personnel et gérez vos réservations en toute simplicité.
          </p>
          
          <form className="w-full max-w-md space-y-6 mx-auto" onSubmit={handleSubmit(onSubmit)}>
            {/* Erreurs globales */}
            {globalErrors && globalErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                {globalErrors.map((error, index) => (
                  <p key={index} className="text-red-600 text-sm">{error}</p>
                ))}
              </div>
            )}

            {/* Erreur générale */}
            {/* {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )} */}

            {/* Email Input */}
                 <div>
                   <input
                     id="email"
                     type="email"
                     placeholder="Email"
                     autoComplete="off"
                    disabled={isLoading}
                     {...register("email")}
                className={`w-full px-4 py-3 border-2 rounded-lg transition-colors ${
                  errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-300 hover:border-gray-400'
                } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                   />
                   {fieldErrors?.email && (
                     <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
                   )}
                   {!fieldErrors?.email && errors.email && (
                     <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                   )}
                 </div>

                 {/* Password Input */}
                   <div className="relative">
                     <input
                       id="password"
                       type={showPassword ? "text" : "password"}
                       placeholder="Mot de passe"
                       autoComplete="off"
                disabled={isLoading}
                       {...register("password")}
                className={`w-full px-4 py-3 pr-10 border-2 rounded-lg transition-colors ${
                  errors.password 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-300 hover:border-gray-400'
                } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                     />
                    <button
                      type="button"
                disabled={isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => setShowPassword(v => !v)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  {fieldErrors?.password && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
                  )}
                  {!fieldErrors?.password && errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

            {/* Submit Button */}
                  <button
                    type="submit"
              disabled={isLoading}
                    className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed flex items-center justify-center"
                  >
              {isLoading ? (
                <Loader 
                  className="h-5 w-5 text-white" 
                  style={{ 
                    animation: 'spin 1s linear infinite',
                    transformOrigin: 'center'
                  }} 
                />
                   ) : (
                     'Valider'
                   )}
                 </button>
              </form>

          {/* Séparateur */}
          <div className="mt-8 mb-6 flex items-center max-w-sm mx-auto">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">ou continuer avec</span>
            <div className="flex-1 border-t border-gray-300"></div>
              </div>

          {/* Boutons sociaux */}
          <div className="flex gap-4 justify-center">
            <button
              type="button"
              className="w-12 h-12 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center justify-center"
            >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </button>

            <button
              type="button"
              className="w-12 h-12 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center justify-center"
            >
              <span className="text-blue-600 font-bold text-xl">f</span>
                </button>
          </div>

          {/* Lien d'inscription */}
          <div className="mt-8 text-center">
            <span className="text-gray-600">Vous n'avez pas encore de compte ? </span>
            <Link 
              href="/register-email" 
              className="text-purple-700 underline hover:text-purple-600 transition-colors"
            >
              Inscrivez-vous dès maintenant
              </Link>
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