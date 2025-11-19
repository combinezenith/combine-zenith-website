"use client";

import React, { useEffect, useState } from 'react';
import { Check, Circle } from 'lucide-react';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/app/config/firebase';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  isProfessional: boolean;
  badge?: string;
  slug: string;
  order: number;
}

export default function PricingPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'pricingPlans'));
        const data: PricingPlan[] = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as PricingPlan))
          .sort((a, b) => a.order - b.order);
        
        setPlans(data);
      } catch (error) {
        console.error('Error fetching pricing plans:', error);
        // Fallback to default plans if fetch fails
        setPlans([
          {
            id: 'plan-starter',
            name: 'Starter',
            description: 'Essential services for new businesses.',
            price: '$99',
            period: '/month',
            features: [
              'Basic SEO Audit',
              '5 Articles Content Writing',
              '1 Social Media Platform',
              'Monthly Performance Reports'
            ],
            buttonText: 'Get Started',
            isProfessional: false,
            slug: 'starter',
            order: 1
          },
          {
            id: 'plan-professional',
            name: 'Professional',
            badge: 'MOST POPULAR',
            description: 'Comprehensive solutions for growing brands.',
            price: '$249',
            period: '/month',
            features: [
              'Advanced SEO Strategy',
              '20 Articles Content Writing',
              '5 Social Media Platforms',
              'Weekly Performance Reports',
              'Basic Web Development (Landing Page)',
              'Tier 2 Influencer Access',
              '24/7 Support'
            ],
            buttonText: 'Choose Plan',
            isProfessional: true,
            slug: 'professional',
            order: 2
          },
          {
            id: 'plan-organization',
            name: 'Organization',
            description: 'Comprehensive solutions for growing brands.',
            price: '$599',
            period: '/month',
            features: [
              'Custom 4k Video Production',
              'Unlimited Print Production Assets',
              'Advanced SEO & Analytics',
              'Custom Web Development (Unlimited Pages)',
              'Dedicated Video Editing Team',
              'Unlimited Graphic Design Concepts',
              'Content Writing (Unlimited)',
              'Influencer Marketing (Full Campaign)',
              'Social Media Marketing (Full Management)',
              'Email Marketing (Advanced Campaigns)'
            ],
            buttonText: 'Choose Organization',
            isProfessional: false,
            slug: 'organization',
            order: 3
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="py-16 px-4 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-purple-200">Loading pricing plans...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            Flexible Plans for Every Business
          </h1>
          <p className="text-purple-200 text-lg max-w-2xl mx-auto">
            Tailored marketing solutions designed to scale with your growth. Find the perfect package to elevate your brand.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl p-8 shadow-2xl relative flex flex-col h-full ${
                plan.isProfessional ? 'transform md:scale-105 md:-translate-y-2' : ''
              }`}
            >
              {/* Most Popular Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {plan.name}
              </h3>
              
              {/* Description */}
              <p className="text-gray-500 text-sm mb-6">
                {plan.description}
              </p>

              {/* Price */}
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">
                  {plan.price}
                </span>
                <span className="text-gray-500 text-lg">
                  {plan.period}
                </span>
              </div>

              {/* Features List */}
              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    {plan.isProfessional ? (
                      <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" />
                    )}
                    <span className="text-gray-700 text-sm leading-relaxed">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button with Link */}
              <Link href={`/pricing/${plan.slug}`}>
                <button className="w-full bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 text-white font-semibold py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                  {plan.buttonText}
                </button>
              </Link>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {plans.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="bg-white/5 rounded-2xl p-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-white mb-2">No Pricing Plans Available</h3>
              <p className="text-purple-200">Please check back later or contact us for more information.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}