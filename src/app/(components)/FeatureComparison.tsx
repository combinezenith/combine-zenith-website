"use client";

import React, { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/app/config/firebase';

interface Feature {
  id: string;
  name: string;
  starter: boolean | string;
  professional: boolean | string;
  organization: boolean | string;
  order: number;
}

export default function FeatureComparisonTable() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'featureComparison'));
        const data: Feature[] = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as Feature))
          .sort((a, b) => a.order - b.order);
        
        setFeatures(data);
      } catch (error) {
        console.error('Error fetching features:', error);
        // Fallback to default features if fetch fails
        setFeatures([
          {
            id: '1',
            name: 'AI Video Production',
            starter: true,
            professional: true,
            organization: true,
            order: 1
          },
          {
            id: '2',
            name: 'Print Productions',
            starter: true,
            professional: true,
            organization: true,
            order: 2
          },
          {
            id: '3',
            name: 'SEO Optimization',
            starter: 'Basic',
            professional: 'Advanced',
            organization: 'Premium',
            order: 3
          },
          {
            id: '4',
            name: 'Web Development',
            starter: false,
            professional: 'Basic pages',
            organization: 'Full Stack',
            order: 4
          },
          {
            id: '5',
            name: 'Video Editing Hours',
            starter: '5 hours',
            professional: '20 hours',
            organization: 'Unlimited',
            order: 5
          },
          {
            id: '6',
            name: 'Graphic Design',
            starter: false,
            professional: true,
            organization: true,
            order: 6
          },
          {
            id: '7',
            name: 'Content Writing',
            starter: '5 articles/month',
            professional: '20 articles/month',
            organization: 'Unlimited',
            order: 7
          },
          {
            id: '8',
            name: 'Influencer Marketing',
            starter: false,
            professional: 'Tier 2 Access',
            organization: 'Tier 1 Access',
            order: 8
          },
          {
            id: '9',
            name: 'Social Media Management',
            starter: '1 platform',
            professional: '5 platforms',
            organization: '5+ platforms',
            order: 9
          },
          {
            id: '10',
            name: 'Email Marketing Campaigns',
            starter: 'Basic setup',
            professional: 'Automated flows',
            organization: 'Advanced Segmentation',
            order: 10
          },
          {
            id: '11',
            name: 'Dedicated Account Manager',
            starter: false,
            professional: false,
            organization: true,
            order: 11
          },
          {
            id: '12',
            name: 'Priority Support',
            starter: false,
            professional: true,
            organization: true,
            order: 12
          },
          {
            id: '13',
            name: 'Performance Reporting',
            starter: 'Monthly',
            professional: 'Weekly',
            organization: 'Real-time Dashboards',
            order: 13
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  const renderCell = (value: boolean | string) => {
    if (value === true) {
      return (
        <div className="flex justify-center">
          <Check className="w-6 h-6 text-white" />
        </div>
      );
    }
    if (value === false) {
      return (
        <div className="flex justify-center">
          <X className="w-6 h-6 text-white opacity-50" />
        </div>
      );
    }
    return (
      <div className="text-center text-white font-medium">
        {value}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-purple-200">Loading feature comparison...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-5xl font-bold text-white text-center mb-12">
          Detailed Feature Comparison
        </h1>

        {/* Comparison Table */}
        <div className="rounded-3xl overflow-hidden shadow-2xl">
          {/* Table Header */}
          <div className="grid grid-cols-4 gap-px bg-purple-400 bg-opacity-40">
            <div className="p-6">
              <h3 className="text-white font-bold text-lg">Feature</h3>
            </div>
            <div className="p-6 text-center">
              <h3 className="text-white font-bold text-lg">Starter</h3>
            </div>
            <div className="p-6 text-center">
              <h3 className="text-white font-bold text-lg">Professional</h3>
            </div>
            <div className="p-6 text-center">
              <h3 className="text-white font-bold text-lg">Organization</h3>
            </div>
          </div>

          {/* Table Rows */}
          {features.map((feature) => (
            <div
              key={feature.id}
              className="grid grid-cols-4 gap-px bg-purple-400 bg-opacity-20"
            >
              <div className="bg-purple-500 bg-opacity-40 p-6">
                <p className="text-white font-medium">{feature.name}</p>
              </div>
              <div className="bg-purple-500 bg-opacity-40 p-6">
                {renderCell(feature.starter)}
              </div>
              <div className="bg-purple-500 bg-opacity-40 p-6">
                {renderCell(feature.professional)}
              </div>
              <div className="bg-purple-500 bg-opacity-40 p-6">
                {renderCell(feature.organization)}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {features.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="bg-white/5 rounded-2xl p-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-white mb-2">No Features Available</h3>
              <p className="text-purple-200">Please check back later or contact us for more information.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}