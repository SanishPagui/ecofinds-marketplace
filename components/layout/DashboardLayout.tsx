/**
 * @deprecated This component is no longer used. 
 * All pages now use PremiumNavigation from the root layout.
 * This file is kept for reference but should not be imported.
 */

"use client"

// This component has been replaced by PremiumNavigation in the root layout
// All dashboard and marketplace pages now use direct content containers
// with consistent spacing: p-6 lg:p-8 max-w-7xl mx-auto

export function DashboardLayout() {
  throw new Error("DashboardLayout is deprecated. Use PremiumNavigation from root layout instead.")
}
