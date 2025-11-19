// app/(components)/SubscriptionIncludes.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/config/firebase';

interface SubscriptionFeature {
  id: string;
  title: string;
  description: string;
  order: number;
}

interface PricingPlan {
  id: string;
  name: string;
  subscriptionFeatures?: SubscriptionFeature[];
}

interface SubscriptionIncludesProps {
  planId: string;
}

export default function SubscriptionIncludes({ planId }: SubscriptionIncludesProps) {
  const [features, setFeatures] = useState<SubscriptionFeature[]>([]);
  const [planName, setPlanName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching subscription features for plan ID:', planId);

        // Get the specific plan document by ID
        const planDoc = await getDoc(doc(db, "pricingPlans", planId));
        
        if (!planDoc.exists()) {
          console.warn(`No plan found with ID: ${planId}`);
          setError(`Plan configuration not found`);
          setFeatures([]);
          return;
        }
        
        const planData = planDoc.data() as PricingPlan;
        console.log('Found plan data:', planData);
        
        if (planData.subscriptionFeatures && planData.subscriptionFeatures.length > 0) {
          setFeatures(planData.subscriptionFeatures);
          setPlanName(planData.name);
        } else {
          console.warn(`No subscription features found for plan: ${planId}`);
          setFeatures([]);
          setPlanName(planData.name);
        }
      } catch (err) {
        console.error('Error fetching subscription features:', err);
        setError('Failed to load subscription features');
        setFeatures([]);
      } finally {
        setLoading(false);
      }
    };

    if (planId) {
      fetchPlanData();
    } else {
      setError('Plan ID is required');
      setLoading(false);
    }
  }, [planId]);

  // Don't render anything if no features
  if (features.length === 0) {
    return null;
  }

  // Loading state
  if (loading) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-white text-2xl md:text-3xl font-bold text-center mb-8">
            Loading features...
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          A {planName} subscription includes
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