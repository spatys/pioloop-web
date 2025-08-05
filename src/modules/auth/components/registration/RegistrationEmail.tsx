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
import { Loader } from 'lucide-react';

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
    
    if (response.success && response.data) {
      // Nettoyer le message de succès pour ne pas l'afficher
      clearSuccess();
      
      // Stocker l'email et l'expiration dans le contexte
      setRegistrationEmail(data.email);
      setRegistrationExpirationMinutes(response.data.expirationMinutes);
      
      // Redirection directe vers la page de vérification
      router.push('/registration-verify-email');
    } else {
      console.error('Erreur lors de l\'inscription par email:', response.message);
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
          <h2 className="text-2xl font-semibold mb-4 text-center">Bienvenue</h2>
          <p className="text-gray-600 text-center mb-6 max-w-md mx-auto">
            Créez votre compte en quelques étapes simples
          </p>

            <form className="w-full max-w-md space-y-6 mx-auto" onSubmit={handleSubmit(onSubmit)}>
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
                <Loader 
                  className="h-5 w-5 text-white" 
                  style={{ 
                    animation: 'spin 1s linear infinite',
                    transformOrigin: 'center'
                  }} 
                />
              ) : (
                'Continuer'
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
          
          <div className="mt-8 text-center">
            <span className="text-gray-600">Déjà un compte ? </span>
            <Link href="/login" className="text-purple-600 underline hover:text-purple-500 transition-colors">
              Se connecter
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