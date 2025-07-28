'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Users, MessageSquare } from 'lucide-react';
import { Button } from '../../../ui/Button';
import { Input } from '../../../ui/Input';
import { Property } from '../../../core/types';
import { formatMoney } from '../../../core/utils';
import { bookingService } from '../../../core/services/implementations/BookingService';
import { toast } from 'react-hot-toast';

const bookingSchema = z.object({
  checkInDate: z.string().min(1, 'Check-in date is required'),
  checkOutDate: z.string().min(1, 'Check-out date is required'),
  numberOfGuests: z.number().min(1, 'At least 1 guest required').max(20, 'Maximum 20 guests'),
  specialRequests: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  property: Property;
}

export default function BookingForm({ property }: BookingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [totalNights, setTotalNights] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      numberOfGuests: 1,
    },
  });

  const watchCheckIn = watch('checkInDate');
  const watchCheckOut = watch('checkOutDate');

  // Calculate total nights and amount
  useEffect(() => {
    if (watchCheckIn && watchCheckOut) {
      const checkIn = new Date(watchCheckIn);
      const checkOut = new Date(watchCheckOut);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      
      if (nights > 0) {
        setTotalNights(nights);
        setTotalAmount(nights * property.pricePerNight.amount);
      } else {
        setTotalNights(0);
        setTotalAmount(0);
      }
    }
  }, [watchCheckIn, watchCheckOut, property.pricePerNight.amount]);

  const onSubmit = async (data: BookingFormData) => {
    setIsLoading(true);
    
    // Validate the booking
    const validation = await bookingService.validateReservation({
      propertyId: property.id,
      ...data,
    });

    if (!validation.isValid) {
      toast.error(validation.errors[0]);
      setIsLoading(false);
      return;
    }

    // Create the reservation
    await bookingService.createReservation({
      propertyId: property.id,
      ...data,
    });

    toast.success('Booking created successfully!');
    router.push('/dashboard/bookings');
    setIsLoading(false);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Book This Property</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Check-in Date */}
        <div>
          <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-700 mb-2">
            Check-in Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              id="checkInDate"
              type="date"
              min={today}
              className="pl-10"
              {...register('checkInDate')}
            />
          </div>
          {errors.checkInDate && (
            <p className="mt-1 text-sm text-red-600">{errors.checkInDate.message}</p>
          )}
        </div>

        {/* Check-out Date */}
        <div>
          <label htmlFor="checkOutDate" className="block text-sm font-medium text-gray-700 mb-2">
            Check-out Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              id="checkOutDate"
              type="date"
              min={watchCheckIn || today}
              className="pl-10"
              {...register('checkOutDate')}
            />
          </div>
          {errors.checkOutDate && (
            <p className="mt-1 text-sm text-red-600">{errors.checkOutDate.message}</p>
          )}
        </div>

        {/* Number of Guests */}
        <div>
          <label htmlFor="numberOfGuests" className="block text-sm font-medium text-gray-700 mb-2">
            Number of Guests
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              id="numberOfGuests"
              type="number"
              min="1"
              max={property.maxGuests}
              className="pl-10"
              {...register('numberOfGuests', { valueAsNumber: true })}
            />
          </div>
          {errors.numberOfGuests && (
            <p className="mt-1 text-sm text-red-600">{errors.numberOfGuests.message}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Maximum {property.maxGuests} guests allowed
          </p>
        </div>

        {/* Special Requests */}
        <div>
          <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
            Special Requests (Optional)
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
            <textarea
              id="specialRequests"
              rows={3}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              placeholder="Any special requests or requirements..."
              {...register('specialRequests')}
            />
          </div>
        </div>

        {/* Price Breakdown */}
        {totalNights > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Price Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {formatMoney(property.pricePerNight.amount, property.pricePerNight.currency)} × {totalNights} nights
                </span>
                <span className="font-medium">
                  {formatMoney(totalAmount, property.pricePerNight.currency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service fee</span>
                <span className="font-medium">
                  {formatMoney(totalAmount * 0.1, property.pricePerNight.currency)}
                </span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-semibold">
                    {formatMoney(totalAmount * 1.1, property.pricePerNight.currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || totalNights === 0}
        >
          {isLoading ? 'Creating Booking...' : 'Book Now'}
        </Button>

        {/* Cancellation Policy */}
        <div className="text-sm text-gray-600">
          <p className="font-medium mb-1">Cancellation Policy</p>
          <p>Free cancellation up to 24 hours before check-in. No refunds for cancellations within 24 hours of check-in.</p>
        </div>
      </form>
    </div>
  );
} 