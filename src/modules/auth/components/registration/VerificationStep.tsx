'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../../../../ui/Button';
import { Input } from '../../../../ui/Input';

const verificationSchema = z.object({
  code: z.string().length(6, 'Please enter the 6-digit verification code'),
});

type VerificationFormData = z.infer<typeof verificationSchema>;

interface VerificationStepProps {
  onSubmit: (code: string) => Promise<void>;
  isLoading: boolean;
  email: string;
  onBack: () => void;
}

export default function VerificationStep({ 
  onSubmit, 
  isLoading, 
  email, 
  onBack 
}: VerificationStepProps) {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
  });

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleFormSubmit = async (data: VerificationFormData) => {
    await onSubmit(data.code);
  };

  const handleResendCode = async () => {
    try {
      const response = await fetch('/api/auth/initiate-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setTimeLeft(600);
        setCanResend(false);
      }
    } catch (error) {
      console.error('Failed to resend code:', error);
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">Verify your email</h3>
        <p className="mt-2 text-sm text-gray-600">
          We sent a 6-digit code to <strong>{email}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
            Verification Code
          </label>
          <Input
            id="code"
            type="text"
            placeholder="Enter 6-digit code"
            maxLength={6}
            className="text-center text-lg tracking-widest"
            {...register('code')}
          />
          {errors.code && (
            <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Code expires in{' '}
            <span className="font-mono font-medium text-red-600">
              {formatTime(timeLeft)}
            </span>
          </p>
        </div>

        <div className="flex space-x-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Verifying...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                Verify
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            )}
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Didn't receive the code?{' '}
          {canResend ? (
            <button
              onClick={handleResendCode}
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Resend code
            </button>
          ) : (
            <span className="text-gray-400">
              Resend code in {formatTime(timeLeft)}
            </span>
          )}
        </p>
      </div>
    </div>
  );
} 