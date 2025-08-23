"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, Users, MessageSquare } from "lucide-react";
import { Property } from "../../../core/types";
import { formatMoney } from "../../../core/utils";
import { bookingService } from "../../../core/services/implementations/BookingService";
import { toast } from "react-hot-toast";

const bookingSchema = z.object({
  checkInDate: z.string().min(1, "Check-in date is required"),
  checkOutDate: z.string().min(1, "Check-out date is required"),
  numberOfGuests: z
    .number()
    .min(1, "At least 1 guest required")
    .max(20, "Maximum 20 guests"),
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

  const watchCheckIn = watch("checkInDate");
  const watchCheckOut = watch("checkOutDate");

  // Calculate total nights and amount
  useEffect(() => {
    if (watchCheckIn && watchCheckOut) {
      const checkIn = new Date(watchCheckIn);
      const checkOut = new Date(watchCheckOut);
      const nights = Math.ceil(
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
      );

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

    toast.success("Booking created successfully!");
    router.push("/dashboard/bookings");
    setIsLoading(false);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Book This Property
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Check-in Date */}
        <div>
          <label
            htmlFor="checkInDate"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Check-in Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="checkInDate"
              type="date"
              min={today}
              {...register("checkInDate")}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          {errors.checkInDate && (
            <p className="mt-1 text-sm text-red-600">
              {errors.checkInDate.message}
            </p>
          )}
        </div>

        {/* Check-out Date */}
        <div>
          <label
            htmlFor="checkOutDate"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Check-out Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="checkOutDate"
              type="date"
              min={watchCheckIn || today}
              {...register("checkOutDate")}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          {errors.checkOutDate && (
            <p className="mt-1 text-sm text-red-600">
              {errors.checkOutDate.message}
            </p>
          )}
        </div>

        {/* Number of Guests */}
        <div>
          <label
            htmlFor="numberOfGuests"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Number of Guests
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="numberOfGuests"
              type="number"
              min="1"
              max="20"
              {...register("numberOfGuests", { valueAsNumber: true })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          {errors.numberOfGuests && (
            <p className="mt-1 text-sm text-red-600">
              {errors.numberOfGuests.message}
            </p>
          )}
        </div>

        {/* Special Requests */}
        <div>
          <label
            htmlFor="specialRequests"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Special Requests
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <textarea
              id="specialRequests"
              rows={4}
              {...register("specialRequests")}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
              placeholder="Any special requests or requirements..."
            />
          </div>
          {errors.specialRequests && (
            <p className="mt-1 text-sm text-red-600">
              {errors.specialRequests.message}
            </p>
          )}
        </div>

        {/* Price Summary */}
        {totalNights > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Price Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {formatMoney(
                    property.pricePerNight.amount,
                    property.pricePerNight.currency,
                  )}{" "}
                  × {totalNights} nights
                </span>
                <span className="font-medium">
                  {formatMoney(totalAmount, property.pricePerNight.currency)}
                </span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="text-lg font-semibold text-gray-900">
                    {formatMoney(totalAmount, property.pricePerNight.currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            "Book Now"
          )}
        </button>
      </form>
    </div>
  );
}
