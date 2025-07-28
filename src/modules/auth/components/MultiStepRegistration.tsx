'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Mail, User, Lock } from 'lucide-react';
import EmailStep from './registration/EmailStep';
import VerificationStep from './registration/VerificationStep';
import ProfileStep from './registration/ProfileStep';
import { toast } from 'react-hot-toast';

export type RegistrationData = {
  email: string;
  verificationCode: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
};

export type RegistrationStep = 'email' | 'verification' | 'profile';

export default function MultiStepRegistration() {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('email');
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    email: '',
    verificationCode: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const updateRegistrationData = (data: Partial<RegistrationData>) => {
    setRegistrationData(prev => ({ ...prev, ...data }));
  };

  const handleEmailSubmit = async (email: string) => {
    setIsLoading(true);
    try {
      // Call API to initiate registration
      const response = await fetch('/api/auth/initiate-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send verification code');
      }

      updateRegistrationData({ email });
      setCurrentStep('verification');
      toast.success('Verification code sent to your email!');
    } catch (error) {
      toast.error('Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async (code: string) => {
    setIsLoading(true);
    try {
      // Call API to verify code
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: registrationData.email, 
          code 
        }),
      });

      if (!response.ok) {
        throw new Error('Invalid verification code');
      }

      updateRegistrationData({ verificationCode: code });
      setCurrentStep('profile');
      toast.success('Email verified successfully!');
    } catch (error) {
      toast.error('Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (profileData: {
    firstName: string;
    lastName: string;
    password: string;
    confirmPassword: string;
    phoneNumber?: string;
  }) => {
    setIsLoading(true);
    try {
      // Call API to complete registration
      const response = await fetch('/api/auth/complete-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registrationData.email,
          ...profileData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete registration');
      }

      const userData = await response.json();
      toast.success('Registration completed successfully!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Failed to complete registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    {
      id: 'email',
      title: 'Email Address',
      description: 'Enter your email to get started',
      icon: Mail,
      completed: currentStep !== 'email' && registrationData.email,
    },
    {
      id: 'verification',
      title: 'Verify Email',
      description: 'Enter the 6-digit code sent to your email',
      icon: CheckCircle,
      completed: currentStep !== 'verification' && registrationData.verificationCode,
    },
    {
      id: 'profile',
      title: 'Profile Details',
      description: 'Complete your profile information',
      icon: User,
      completed: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join Pioloop and start your rental journey
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = step.completed;
              const isAccessible = index === 0 || steps[index - 1].completed;

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                      isCompleted
                        ? 'bg-green-500 border-green-500 text-white'
                        : isActive
                        ? 'bg-primary-600 border-primary-600 text-white'
                        : isAccessible
                        ? 'border-gray-300 text-gray-500'
                        : 'border-gray-200 text-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {currentStep === 'email' && (
            <EmailStep
              onSubmit={handleEmailSubmit}
              isLoading={isLoading}
              email={registrationData.email}
            />
          )}

          {currentStep === 'verification' && (
            <VerificationStep
              onSubmit={handleVerificationSubmit}
              isLoading={isLoading}
              email={registrationData.email}
              onBack={() => setCurrentStep('email')}
            />
          )}

          {currentStep === 'profile' && (
            <ProfileStep
              onSubmit={handleProfileSubmit}
              isLoading={isLoading}
              onBack={() => setCurrentStep('verification')}
            />
          )}
        </div>
      </div>
    </div>
  );
} 