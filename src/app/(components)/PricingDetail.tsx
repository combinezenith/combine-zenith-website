"use client";
import React from 'react';
import { Check, Circle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Define types
type PlanId = 'starter' | 'professional' | 'organization';

interface PlanData {
  id: PlanId;
  name: string;
  badge?: string;
  tagline: string;
  title: string;
  description: string;
  price: string;
  period: string;
  discount: string;
  features: string[];
  isProfessional: boolean;
}

// Pricing plans data matching your main pricing page
const pricingPlans: Record<PlanId, PlanData> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    tagline: 'Essential Marketing Solutions for New Businesses',
    title: 'Launch Your Brand Successfully',
    description: 'Essential services for new businesses.',
    price: '$99',
    period: 'month',
    discount: 'Billed annually for a 15% discount',
    features: [
      'Basic SEO Audit',
      '5 Articles Content Writing',
      '1 Social Media Platform',
      'Monthly Performance Reports'
    ],
    isProfessional: false
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    badge: 'MOST POPULAR',
    tagline: 'Comprehensive Solutions for Growing Brands',
    title: 'Scale Your Brand\'s Growth',
    description: 'Comprehensive solutions for growing brands.',
    price: '$249',
    period: 'month',
    discount: 'Billed annually for a 20% discount',
    features: [
      'Advanced SEO Strategy',
      '20 Articles Content Writing',
      '5 Social Media Platforms',
      'Weekly Performance Reports',
      'Basic Web Development (Landing Page)',
      'Tier 2 Influencer Access',
      '24/7 Support'
    ],
    isProfessional: true
  },
  organization: {
    id: 'organization',
    name: 'Organization',
    tagline: 'Enterprise-Level Solutions for Established Brands',
    title: 'Dominate Your Market',
    description: 'Comprehensive solutions for growing brands.',
    price: '$599',
    period: 'month',
    discount: 'Billed annually for a 25% discount',
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
    isProfessional: false
  }
};

export default function PricingDetailPage() {
  // In real implementation, you'd get this from the URL params
  const [selectedPlan, setSelectedPlan] = React.useState<PlanId>('professional');
  const plan = pricingPlans[selectedPlan];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header with back button */}
        <div className="mb-8">
          <button className="flex items-center text-purple-200 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="text-sm">Back to Pricing</span>
          </button>
          
          {/* Plan selector for demo */}
          <div className="flex gap-4 mb-6 flex-wrap">
            {(Object.keys(pricingPlans) as PlanId[]).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedPlan(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedPlan === key
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-900/50 text-purple-200 hover:bg-purple-800/50'
                }`}
              >
                {pricingPlans[key].name}
                {pricingPlans[key].badge && (
                  <span className="ml-2 text-xs bg-purple-500 px-2 py-0.5 rounded">
                    {pricingPlans[key].badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left column - Plan details */}
          <div className="space-y-6">
            <div>
              {plan.badge && (
                <span className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full mb-3">
                  {plan.badge}
                </span>
              )}
              <p className="text-purple-200 text-sm mb-3">{plan.tagline}</p>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                {plan.title}
              </h1>
              <p className="text-purple-100 text-lg">
                {plan.description}
              </p>
            </div>

            {/* Features list */}
            <div className="space-y-4">
              {plan.features.map((feature: string, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1">
                    {plan.isProfessional ? (
                      <Check className="w-5 h-5 text-purple-300 flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-purple-300 flex-shrink-0" fill="currentColor" />
                    )}
                  </div>
                  <p className="text-purple-100 leading-relaxed">{feature}</p>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="pt-6">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-bold">{plan.price}</span>
                <span className="text-purple-200 text-lg">/ {plan.period}</span>
              </div>
              <p className="text-purple-300 text-sm">{plan.discount}</p>
            </div>

            {/* CTA Button */}
            <button className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white py-4 px-6 rounded-lg hover:bg-white/20 transition-all duration-300 font-medium">
              <Link href="/contact" className="flex items-center justify-center gap-2">
              Contact our team
              </Link>
            </button>
          </div>

          {/* Right column - Visual element */}
          <div className="relative">
            <div className="bg-gradient-to-br from-purple-800/30 to-indigo-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12 min-h-[500px] flex items-center justify-center">
              {/* Decorative circles */}
              <div className="absolute top-10 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 left-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
              
              {/* Center content */}
              <div className="relative z-10 text-center">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-500/30 to-indigo-500/30 rounded-full flex items-center justify-center border border-white/20">
                  <div className="text-6xl">
                    {plan.id === 'starter' && '🚀'}
                    {plan.id === 'professional' && '⭐'}
                    {plan.id === 'organization' && '👑'}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3">Ready to Get Started?</h3>
                <p className="text-purple-200">
                  Join {plan.id === 'starter' ? 'hundreds' : plan.id === 'professional' ? 'thousands' : 'leading'} of businesses growing with our {plan.name} plan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}