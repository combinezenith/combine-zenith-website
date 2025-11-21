"use client";

import React from 'react';
import Link from 'next/link';
import { Check, Circle } from 'lucide-react';

export interface PricingPackage {
  id: string;
  name: string;
  price: number;
  description?: string;
}

interface ServicePricingPackagesProps {
  pricingPackages: PricingPackage[] | { [key: string]: { price: number; description?: string } };
}

export default function ServicePricingPlan({ pricingPackages }: ServicePricingPackagesProps) {
  // Convert object to array if needed
  const packagesArray: PricingPackage[] = Array.isArray(pricingPackages)
    ? pricingPackages
    : Object.entries(pricingPackages || {}).map(([key, pkg]) => ({
        id: key,
        name: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize first letter
        price: pkg.price,
        description: pkg.description,
      }));

  if (packagesArray.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-white/5 rounded-2xl p-8 max-w-md mx-auto">
          <h3 className="text-xl font-semibold text-white mb-2">No pricing packages available.</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Choose Your Package
          </h2>
          <p className="text-purple-200 text-lg max-w-2xl mx-auto">
            Select the perfect pricing plan that fits your business needs and budget.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
          {packagesArray.map((pkg, index) => {
            const isProfessional = index === 1; // Make middle package "professional"
            return (
              <div
                key={pkg.id}
                className={`bg-white rounded-2xl p-8 shadow-2xl relative flex flex-col min-h-[500px] ${
                  isProfessional ? 'transform md:scale-105 md:-translate-y-2' : ''
                }`}
              >
                {/* Most Popular Badge */}
                {isProfessional && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {pkg.name}
                </h3>

                {/* Description */}
                {pkg.description && (
                  <p className="text-gray-500 text-sm mb-6">
                    {pkg.description}
                  </p>
                )}

                {/* Price */}
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">
                    ${pkg.price}
                  </span>
                  <span className="text-gray-500 text-lg">
                    /month
                  </span>
                </div>

                {/* Features List - Placeholder for now */}
                <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-start gap-3">
                    {isProfessional ? (
                      <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" />
                    )}
                    <span className="text-gray-700 text-sm leading-relaxed">
                      Professional consultation
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    {isProfessional ? (
                      <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" />
                    )}
                    <span className="text-gray-700 text-sm leading-relaxed">
                      Dedicated support team
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    {isProfessional ? (
                      <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" />
                    )}
                    <span className="text-gray-700 text-sm leading-relaxed">
                      Monthly progress reports
                    </span>
                  </li>
                  {isProfessional && (
                    <>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm leading-relaxed">
                          Priority support
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm leading-relaxed">
                          Advanced analytics
                        </span>
                      </li>
                    </>
                  )}
                </ul>

                {/* CTA Button */}
                <Link href="/contact">
                  <button className="w-full bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 text-white font-semibold py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                    {isProfessional ? 'Choose Plan' : 'Get Started'}
                  </button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
