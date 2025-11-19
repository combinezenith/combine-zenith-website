"use client";
import React, { useEffect, useState } from 'react';
import { Check, Circle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/app/config/firebase';

// Define types
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
  tagline?: string;
  title?: string;
  discount?: string;
}

interface PricingDetailProps {
  slug?: string;
  id?: string;
}

export default function PricingDetail({ slug, id }: PricingDetailProps) {
  // Use id if provided, otherwise use slug
  const planIdentifier = id || slug;
  const [plan, setPlan] = useState<PricingPlan | null>(null);
  const [allPlans, setAllPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      console.log('Fetching plans for identifier:', planIdentifier);
      try {
        setLoading(true);
        
        // Fetch all plans
        const snapshot = await getDocs(collection(db, 'pricingPlans'));
        console.log('Snapshot docs count:', snapshot.docs.length);
        
        if (snapshot.empty) {
          console.log('No plans in database, using defaults');
          // Use fallback plans
          const defaultPlans = getDefaultPlans();
          const defaultPlan = defaultPlans.find(p => p.slug === planIdentifier);
          setPlan(defaultPlan || defaultPlans[1]);
          setAllPlans(defaultPlans);
        } else {
          const plans: PricingPlan[] = snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() } as PricingPlan))
            .sort((a, b) => a.order - b.order);
          
          console.log('Fetched plans:', plans);
          setAllPlans(plans);

          // Find the plan matching the slug
          const currentPlan = plans.find(p => p.slug === planIdentifier);
          console.log('Current plan found:', currentPlan);
          
          if (currentPlan) {
            setPlan(currentPlan);
          } else {
            // Fallback to default plans
            const defaultPlans = getDefaultPlans();
            const defaultPlan = defaultPlans.find(p => p.slug === planIdentifier);
            setPlan(defaultPlan || defaultPlans[1]); // Default to professional
            setAllPlans(defaultPlans);
          }
        }
      } catch (error) {
        console.error('Error fetching pricing plans:', error);
        // Use fallback plans
        const defaultPlans = getDefaultPlans();
        const defaultPlan = defaultPlans.find(p => p.slug === planIdentifier);
        setPlan(defaultPlan || defaultPlans[1]);
        setAllPlans(defaultPlans);
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };

    if (planIdentifier) {
      console.log('Plan identifier exists, fetching plans');
      fetchPlans();
    } else {
      console.log('No plan identifier provided');
      setLoading(false);
    }
  }, [planIdentifier]);

  const getDefaultPlans = (): PricingPlan[] => [
    {
      id: 'plan-starter',
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
      buttonText: 'Get Started',
      isProfessional: false,
      slug: 'starter',
      order: 1
    },
    {
      id: 'plan-professional',
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
      buttonText: 'Choose Plan',
      isProfessional: true,
      slug: 'professional',
      order: 2
    },
    {
      id: 'plan-organization',
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
      buttonText: 'Choose Organization',
      isProfessional: false,
      slug: 'organization',
      order: 3
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen mt-20 text-white p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[500px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-300 mx-auto mb-4"></div>
              <p className="text-purple-200">Loading plan details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen mt-20 text-white p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Plan Not Found</h2>
            <p className="text-purple-200 mb-6">The pricing plan you're looking for doesn't exist.</p>
            <Link href="/pricing">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors">
                Back to Pricing
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get emoji based on plan name
  const getEmoji = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes('starter')) return '🚀';
    if (name.includes('professional')) return '⭐';
    if (name.includes('organization')) return '👑';
    return '💼';
  };

  return (
    <div className="min-h-screen mt-20 text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header with back button */}
        <div className="mb-8">
          <Link href="/pricing">
            <button className="flex items-center text-purple-200 hover:text-white transition-colors mb-6">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="text-sm">Back to Pricing</span>
            </button>
          </Link>
          
          {/* Plan selector */}
          <div className="flex gap-4 mb-6 flex-wrap">
            {allPlans.map((p) => (
              <Link key={p.id} href={`/pricing/${p.slug}`}>
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    p.slug === planIdentifier
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-900/50 text-purple-200 hover:bg-purple-800/50'
                  }`}
                >
                  {p.name}
                  {p.badge && (
                    <span className="ml-2 text-xs bg-purple-500 px-2 py-0.5 rounded">
                      {p.badge}
                    </span>
                  )}
                </button>
              </Link>
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
              <p className="text-purple-200 text-sm mb-3">
                {plan.tagline || `${plan.name} Plan - ${plan.description}`}
              </p>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                {plan.title || `${plan.name} Plan`}
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
              {plan.discount && (
                <p className="text-purple-300 text-sm">{plan.discount}</p>
              )}
            </div>

            {/* CTA Button */}
            <Link href="/contact" className="block">
              <button className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white py-4 px-6 rounded-lg hover:bg-white/20 transition-all duration-300 font-medium">
                Contact our team
              </button>
            </Link>
          </div>

          {/* Right column - Visual element */}
          <div className="relative hidden md:block">
            <div className="bg-gradient-to-br from-purple-800/30 to-indigo-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12 min-h-[500px] flex items-center justify-center">
              {/* Decorative circles */}
              <div className="absolute top-10 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 left-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
              
              {/* Center content */}
              <div className="relative z-10 text-center">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-500/30 to-indigo-500/30 rounded-full flex items-center justify-center border border-white/20">
                  <div className="text-6xl">
                    {getEmoji(plan.name)}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3">Ready to Get Started?</h3>
                <p className="text-purple-200">
                  Join businesses growing with our {plan.name} plan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}