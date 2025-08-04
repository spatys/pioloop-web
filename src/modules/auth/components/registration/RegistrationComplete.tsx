'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/hooks/useAuth';
import { useAuth as useAuthContext } from '@/context/AuthContext';
import { CompleteRegistrationForm } from '@/core/types/Forms';
import { Eye, EyeOff, Loader } from 'lucide-react';

// Schema de validation
const schema = yup.object({
  firstName: yup
    .string()
    .required('Le prénom est requis')
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères'),
  lastName: yup
    .string()
    .required('Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  password: yup
    .string()
    .required('Le mot de passe est requis')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'
    ),
  confirmPassword: yup
    .string()
    .required('La confirmation du mot de passe est requise')
    .oneOf([yup.ref('password')], 'Les mots de passe ne correspondent pas')
});

export const RegistrationComplete: React.FC = () => {
  const router = useRouter();
  const { registrationComplete, isLoading, error, success, clearError, clearSuccess } = useAuth();
  const { registrationEmail } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CompleteRegistrationForm>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const onSubmit = async (data: CompleteRegistrationForm) => {
    if (!registrationEmail) {
      console.error('Aucun email en cours de vérification');
      return;
    }

    const response = await registrationComplete({
      email: registrationEmail,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
      confirmPassword: data.confirmPassword
    });

    if (response.success) {
      // Nettoyer le message de succès pour ne pas l'afficher
      clearSuccess();
      
      console.log('Inscription complétée avec succès');
      setIsRedirecting(true);
      
      // Timeout de 2 secondes avant la redirection
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } else {
      console.error('Erreur lors de la complétion de l\'inscription:', response.message);
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
          <h2 className="text-2xl font-semibold mb-4 text-center">Mes informations</h2>
          <p className="text-gray-600 text-center mb-6 max-w-md mx-auto">
            Complétez votre profil pour finaliser votre inscription
          </p>
          
          <form className="w-full max-w-md space-y-6 mx-auto" onSubmit={handleSubmit(onSubmit)}>
            {/* Last Name Input */}
            <div>
              <input
                id="lastName"
                type="text"
                placeholder="Nom"
                autoComplete="off"
                {...register("lastName")}
                className={`w-full px-4 py-3 border-2 rounded-lg transition-colors ${
                  errors.lastName ? 'border-red-300 focus:border-red-500' : 'border-gray-300 hover:border-gray-400'
                }`}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>

            {/* First Name Input */}
            <div>
              <input
                id="firstName"
                type="text"
                placeholder="Prénom"
                autoComplete="off"
                {...register("firstName")}
                className={`w-full px-4 py-3 border-2 rounded-lg transition-colors ${
                  errors.firstName ? 'border-red-300 focus:border-red-500' : 'border-gray-300 hover:border-gray-400'
                }`}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                autoComplete="off"
                {...register("password")}
                className={`w-full px-4 py-3 pr-10 border-2 rounded-lg transition-colors ${
                  errors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-300 hover:border-gray-400'
                }`}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
                onClick={() => setShowPassword(v => !v)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmer le mot de passe"
                autoComplete="off"
                {...register("confirmPassword")}
                className={`w-full px-4 py-3 pr-10 border-2 rounded-lg transition-colors ${
                  errors.confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-gray-300 hover:border-gray-400'
                }`}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
                onClick={() => setShowConfirmPassword(v => !v)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}

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
                'Envoyer'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Colonne droite : illustration */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-violet-50">
        <img src="/images/register.png" alt="Illustration" className="w-full h-full" />
      </div>
    </div>
  );
}; 