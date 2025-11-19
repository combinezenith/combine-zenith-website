"use client";

import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from "@/app/config/firebase";

interface SubscriptionFeature {
  id: string;
  title: string;
  description: string;
  order: number;
}

interface PricingPlan {
  id: string;
  name: string;
  slug: string;
  subscriptionFeatures?: SubscriptionFeature[];
}

interface SubscriptionIncludesProps {
  planSlug?: string; // Optional: if not provided, will use 'starter' as default
  planName?: string; // Optional: custom plan name for the title
}

export default function SubscriptionIncludes({ planSlug = 'starter', planName }: SubscriptionIncludesProps) {
  const [features, setFeatures] = useState<SubscriptionFeature[]>([]);
  const [planTitle, setPlanTitle] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Query the pricing plans collection for the specific plan slug
        const plansQuery = query(
          collection(db, "pricingPlans"), 
          where("slug", "==", planSlug)
        );
        
        const plansSnapshot = await getDocs(plansQuery);
        
        if (plansSnapshot.empty) {
          // Fallback to starter plan if no plan found
          const fallbackQuery = query(
            collection(db, "pricingPlans"), 
            where("slug", "==", "starter")
          );
          const fallbackSnapshot = await getDocs(fallbackQuery);
          
          if (fallbackSnapshot.empty) {
            setError("No pricing plans found");
            return;
          }
          
          const fallbackPlan = fallbackSnapshot.docs[0].data() as PricingPlan;
          setFeatures(fallbackPlan.subscriptionFeatures || []);
          setPlanTitle(planName || fallbackPlan.name);
        } else {
          const planData = plansSnapshot.docs[0].data() as PricingPlan;
          setFeatures(planData.subscriptionFeatures || []);
          setPlanTitle(planName || planData.name);
        }
      } catch (err) {
        console.error('Error fetching subscription features:', err);
        setError('Failed to load subscription features');
      } finally {
        setLoading(false);
      }
    };

    fetchPlanData();
  }, [planSlug, planName]);

  // Loading state
  if (loading) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-white text-2xl md:text-3xl font-bold text-center mb-8">
            Loading...
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white rounded-lg p-6 text-center animate-pulse"
              >
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-white text-xl mb-4">⚠️ {error}</div>
          <div className="text-purple-200">Please try refreshing the page</div>
        </div>
      </div>
    );
  }

  // Empty state
  if (features.length === 0) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-white text-xl mb-4">No features available</div>
          <div className="text-purple-200">Please check the admin panel configuration</div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h2 className="text-white text-2xl md:text-3xl font-bold text-center mb-8">
          A {planTitle} subscription includes
        </h2>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features
            .sort((a, b) => a.order - b.order)
            .map((feature) => (
              <div
                key={feature.id}
                className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-gray-900 font-bold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}