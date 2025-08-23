"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Star, Bed, Bath, Users, Calendar } from "lucide-react";
import { Property } from "../../../core/types";
import { formatMoney } from "../../../core/utils";

interface PropertyCardProps {
  property: Property;
  showOwner?: boolean;
}

export default function PropertyCard({
  property,
  showOwner = false,
}: PropertyCardProps) {
  const primaryImage =
    property.images.find((img) => img.isPrimary) || property.images[0];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Property Image */}
      <div className="relative h-48 overflow-hidden">
        {primaryImage ? (
          <img
            src={primaryImage.imageUrl}
            alt={primaryImage.caption || property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              property.status === "Available"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {property.status}
          </span>
        </div>

        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-white/90 backdrop-blur-sm px-3 py-1 text-sm font-semibold text-gray-900 rounded-full">
            {formatMoney(
              property.pricePerNight.amount,
              property.pricePerNight.currency,
            )}
            /night
          </span>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-4">
        {/* Title and Rating */}
        <div className="flex items-start justify-between mb-2">
          <Link href={`/properties/${property.id}`} className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors">
              {property.title}
            </h3>
          </Link>
          <div className="flex items-center ml-2">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">4.8</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">
            {property.address.city}, {property.address.state}
          </span>
        </div>

        {/* Property Features */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span>{property.bedrooms} bed</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>{property.bathrooms} bath</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>{property.maxGuests} guests</span>
            </div>
          </div>
        </div>

        {/* Property Type and Square Footage */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500 capitalize">
            {property.propertyType.toLowerCase()}
          </span>
          {property.squareFootage && (
            <span className="text-sm text-gray-500">
              {property.squareFootage} sq ft
            </span>
          )}
        </div>

        {/* Owner Info (if requested) */}
        {showOwner && property.owner && (
          <div className="border-t pt-3 mb-4">
            <div className="flex items-center">
              {property.owner.profile?.profileImage ? (
                <img
                  src={property.owner.profile.profileImage}
                  alt={`${property.owner.profile.firstName} ${property.owner.profile.lastName}`}
                  className="w-8 h-8 rounded-full mr-3"
                />
              ) : (
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary-600 text-sm font-semibold">
                    {property.owner.profile?.firstName?.charAt(0) ||
                      property.owner.email.charAt(0)}
                    {property.owner.profile?.lastName?.charAt(0) || ""}
                  </span>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {property.owner.profile?.firstName &&
                  property.owner.profile?.lastName
                    ? `${property.owner.profile.firstName} ${property.owner.profile.lastName}`
                    : property.owner.email}
                </p>
                <p className="text-xs text-gray-500">Property Owner</p>
              </div>
            </div>
          </div>
        )}

        {/* Amenities Preview */}
        {property.amenities.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {property.amenities.slice(0, 3).map((amenity, index) => (
                <span
                  key={amenity.id}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {amenity.name}
                </span>
              ))}
              {property.amenities.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  +{property.amenities.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Link
            href={`/properties/${property.id}`}
            className="flex-1 bg-primary-600 text-white text-center py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            View Details
          </Link>
          <Link
            href={`/properties/${property.id}/book`}
            className="flex-1 bg-white border border-primary-600 text-primary-600 text-center py-2 px-4 rounded-lg hover:bg-primary-50 transition-colors text-sm font-medium"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
