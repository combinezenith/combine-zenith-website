import React from 'react';
import { Check, X } from 'lucide-react';

export default function FeatureComparisonTable() {
  const features = [
    {
      name: 'AI Video Production',
      starter: true,
      professional: true,
      organization: true
    },
    {
      name: 'Print Productions',
      starter: true,
      professional: true,
      organization: true
    },
    {
      name: 'SEO Optimization',
      starter: 'Basic',
      professional: 'Advanced',
      organization: 'Premium'
    },
    {
      name: 'Web Development',
      starter: false,
      professional: 'Basic pages',
      organization: 'Full Stack'
    },
    {
      name: 'Video Editing Hours',
      starter: '5 hours',
      professional: '20 hours',
      organization: 'Unlimited'
    },
    {
      name: 'Graphic Design',
      starter: false,
      professional: true,
      organization: true
    },
    {
      name: 'Content Writing',
      starter: '5 articles/month',
      professional: '20 articles/month',
      organization: 'Unlimited'
    },
    {
      name: 'Influencer Marketing',
      starter: false,
      professional: 'Tier 2 Access',
      organization: 'Tier 1 Access'
    },
    {
      name: 'Social Media Management',
      starter: '1 platform',
      professional: '5 platforms',
      organization: '5+ platforms'
    },
    {
      name: 'Email Marketing Campaigns',
      starter: 'Basic setup',
      professional: 'Automated flows',
      organization: 'Advanced Segmentation'
    },
    {
      name: 'Dedicated Account Manager',
      starter: false,
      professional: false,
      organization: true
    },
    {
      name: 'Priority Support',
      starter: false,
      professional: true,
      organization: true
    },
    {
      name: 'Performance Reporting',
      starter: 'Monthly',
      professional: 'Weekly',
      organization: 'Real-time Dashboards'
    }
  ];

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
          {features.map((feature, index) => (
            <div
              key={index}
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
      </div>
    </div>
  );
}