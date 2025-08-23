"use client";

import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Home,
  Calendar,
  DollarSign,
} from "lucide-react";
import { DashboardStats as DashboardStatsType } from "../../../core/types";
import { formatMoney } from "../../../core/utils";

interface DashboardStatsProps {
  stats: DashboardStatsType;
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: "Total Properties",
      value: stats.totalProperties,
      icon: Home,
      color: "bg-blue-500",
      change: "+12%",
      changeType: "increase" as const,
    },
    {
      title: "Total Reservations",
      value: stats.totalReservations,
      icon: Calendar,
      color: "bg-green-500",
      change: "+8%",
      changeType: "increase" as const,
    },
    {
      title: "Total Revenue",
      value: formatMoney(stats.totalRevenue),
      icon: DollarSign,
      color: "bg-yellow-500",
      change: "+15%",
      changeType: "increase" as const,
    },
    {
      title: "Active Bookings",
      value: stats.activeBookings,
      icon: Users,
      color: "bg-purple-500",
      change: "+5%",
      changeType: "increase" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {card.value}
              </p>
            </div>
            <div className={`${card.color} rounded-lg p-3`}>
              <card.icon className="h-6 w-6 text-white" />
            </div>
          </div>

          <div className="flex items-center mt-4">
            {card.changeType === "increase" ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span
              className={`text-sm font-medium ${
                card.changeType === "increase"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {card.change}
            </span>
            <span className="text-sm text-gray-500 ml-1">from last month</span>
          </div>
        </div>
      ))}
    </div>
  );
}
