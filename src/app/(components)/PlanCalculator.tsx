"use client";
import React, { useState } from 'react';
import { Plus, X, RotateCcw } from 'lucide-react';

interface PlanForm {
  id: number;
  service: string;
  businessType: string;
  features: string;
  budget: string;
  timeline: string;
  description: string;
}

interface CalculationResult {
  planId: number;
  planName: string;
  service: string;
  businessType: string;
  features: string;
  budget: string;
  timeline: string;
  description: string;
  estimatedCost: string;
  monthlyPayment: string;
  totalUpfront: string;
}

export default function PlanCalculator() {
  const [plans, setPlans] = useState<PlanForm[]>([
    {
      id: 1,
      service: '',
      businessType: '',
      features: '',
      budget: '',
      timeline: '',
      description: ''
    }
  ]);
  
  const [results, setResults] = useState<CalculationResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleChange = (planId: number, field: string, value: string) => {
    setPlans(plans.map(plan => 
      plan.id === planId ? { ...plan, [field]: value } : plan
    ));
  };

  const calculatePrice = (plan: PlanForm) => {
    // Price calculation logic based on selections
    let basePrice = 0;
    
    // Service pricing
    const servicePrices: Record<string, number> = {
      'seo': 500,
      'content': 300,
      'social': 400,
      'ppc': 600,
      'web': 1000
    };
    
    // Features multiplier
    const featuresMultiplier: Record<string, number> = {
      'basic': 1,
      'standard': 1.5,
      'premium': 2,
      'custom': 2.5
    };
    
    // Timeline multiplier
    const timelineMonths: Record<string, number> = {
      '1month': 1,
      '3months': 3,
      '6months': 6,
      '12months': 12
    };
    
    basePrice = servicePrices[plan.service] || 0;
    const multiplier = featuresMultiplier[plan.features] || 1;
    const months = timelineMonths[plan.timeline] || 1;
    
    const totalCost = basePrice * multiplier * months;
    const monthlyPayment = totalCost / months;
    const upfrontPayment = totalCost * 0.3; // 30% upfront
    
    return {
      estimatedCost: `$${totalCost.toLocaleString()}`,
      monthlyPayment: `$${monthlyPayment.toLocaleString()}`,
      totalUpfront: `$${upfrontPayment.toLocaleString()}`
    };
  };

  const handleCalculate = (planId: number) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;
    
    // Validate required fields
    if (!plan.service || !plan.businessType || !plan.features || !plan.budget || !plan.timeline) {
      alert('Please fill in all required fields before calculating.');
      return;
    }
    
    const pricing = calculatePrice(plan);
    
    const result: CalculationResult = {
      planId: plan.id,
      planName: `Option ${plan.id}`,
      service: plan.service,
      businessType: plan.businessType,
      features: plan.features,
      budget: plan.budget,
      timeline: plan.timeline,
      description: plan.description,
      ...pricing
    };
    
    // Update or add result
    setResults(prevResults => {
      const existingIndex = prevResults.findIndex(r => r.planId === planId);
      if (existingIndex >= 0) {
        const newResults = [...prevResults];
        newResults[existingIndex] = result;
        return newResults;
      }
      return [...prevResults, result];
    });
    
    setShowResults(true);
  };

  const addNewPlan = () => {
    const newPlan: PlanForm = {
      id: plans.length + 1,
      service: '',
      businessType: '',
      features: '',
      budget: '',
      timeline: '',
      description: ''
    };
    setPlans([...plans, newPlan]);
  };

  const removePlan = (planId: number) => {
    if (plans.length > 1) {
      setPlans(plans.filter(plan => plan.id !== planId));
      setResults(results.filter(r => r.planId !== planId));
    }
  };
  
  const resetCalculator = () => {
    setShowResults(false);
    setResults([]);
  };

  if (showResults && results.length > 0) {
    return (
      <div className="bg-gradient-to-br from-indigo-950 via-purple-900 to-purple-950 min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-white text-3xl md:text-4xl font-bold text-center mb-12">
            Calculation Results
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {results.map((result) => (
              <div key={result.planId} className="bg-white rounded-2xl p-6 shadow-2xl">
                <h2 className="text-purple-900 text-2xl font-bold mb-6">{result.planName}</h2>
                
                {/* Service Details */}
                <div className="mb-6">
                  <h3 className="text-purple-700 font-semibold text-sm uppercase mb-3">Service Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service:</span>
                      <span className="text-gray-900 font-medium capitalize">{result.service}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Business Type:</span>
                      <span className="text-gray-900 font-medium capitalize">{result.businessType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Package:</span>
                      <span className="text-gray-900 font-medium capitalize">{result.features}</span>
                    </div>
                  </div>
                </div>
                
                {/* Pricing */}
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <h3 className="text-purple-700 font-semibold text-sm uppercase mb-3">Estimated Cost</h3>
                  <div className="text-3xl font-bold text-purple-900 mb-2">
                    {result.estimatedCost}
                  </div>
                  <p className="text-gray-500 text-xs">Total project cost</p>
                </div>
                
                {/* Upfront Payment */}
                <div className="bg-purple-50 rounded-lg p-4 mb-4">
                  <h3 className="text-purple-700 font-semibold text-sm uppercase mb-3">Upfront Payment</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Security Deposit (30%):</span>
                      <span className="text-gray-900 font-semibold">{result.totalUpfront}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Processing Fee:</span>
                      <span className="text-gray-900 font-semibold">$100</span>
                    </div>
                    <div className="border-t border-purple-200 pt-2 mt-2 flex justify-between">
                      <span className="text-gray-900 font-bold">Total Upfront:</span>
                      <span className="text-purple-900 font-bold">{result.totalUpfront}</span>
                    </div>
                  </div>
                </div>
                
                {/* Monthly Payment */}
                <div className="bg-indigo-50 rounded-lg p-4 mb-4">
                  <h3 className="text-indigo-700 font-semibold text-sm uppercase mb-3">Monthly Payment</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="text-gray-900 font-medium capitalize">{result.timeline.replace('months', ' Months').replace('month', ' Month')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment per month:</span>
                      <span className="text-indigo-900 font-bold text-lg">{result.monthlyPayment}</span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs mt-2">Calculation includes all services and support</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Redo Button */}
          <div className="text-center">
            <button
              onClick={resetCalculator}
              className="bg-white text-purple-900 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-200 shadow-lg inline-flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Redo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-950 via-purple-900 to-purple-950 min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-white text-3xl md:text-4xl font-bold text-center mb-12">
          Customize your Plan
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-fr">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-2xl p-8 shadow-2xl relative">
              {plans.length > 1 && (
                <button
                  onClick={() => removePlan(plan.id)}
                  className="absolute top-4 right-4 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              <h2 className="text-purple-900 text-xl font-bold mb-6">Plan {plan.id}</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Choose Service <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={plan.service}
                    onChange={(e) => handleChange(plan.id, 'service', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-700"
                  >
                    <option value="">Select a service</option>
                    <option value="seo">SEO Services</option>
                    <option value="content">Content Marketing</option>
                    <option value="social">Social Media Management</option>
                    <option value="ppc">PPC Advertising</option>
                    <option value="web">Web Development</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Business Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={plan.businessType}
                    onChange={(e) => handleChange(plan.id, 'businessType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-700"
                  >
                    <option value="">Select business type</option>
                    <option value="startup">Startup</option>
                    <option value="smallbusiness">Small Business</option>
                    <option value="enterprise">Enterprise</option>
                    <option value="ecommerce">E-commerce</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Select features you need <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={plan.features}
                    onChange={(e) => handleChange(plan.id, 'features', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-700"
                  >
                    <option value="">Select features</option>
                    <option value="basic">Basic Package</option>
                    <option value="standard">Standard Package</option>
                    <option value="premium">Premium Package</option>
                    <option value="custom">Custom Package</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Select your budget <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={plan.budget}
                    onChange={(e) => handleChange(plan.id, 'budget', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-700"
                  >
                    <option value="">Select budget range</option>
                    <option value="0-500">$0 - $500</option>
                    <option value="500-1000">$500 - $1,000</option>
                    <option value="1000-5000">$1,000 - $5,000</option>
                    <option value="5000+">$5,000+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Choose timeline <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={plan.timeline}
                    onChange={(e) => handleChange(plan.id, 'timeline', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-700"
                  >
                    <option value="">Select timeline</option>
                    <option value="1month">1 Month</option>
                    <option value="3months">3 Months</option>
                    <option value="6months">6 Months</option>
                    <option value="12months">12 Months</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Describe your project
                  </label>
                  <textarea
                    value={plan.description}
                    onChange={(e) => handleChange(plan.id, 'description', e.target.value)}
                    placeholder="Describe your project, technical skills, style preferences, stages required, and any special requests."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-700 resize-none"
                    rows={4}
                  />
                </div>

                <button
                  onClick={() => handleCalculate(plan.id)}
                  className="w-full bg-gradient-to-r from-purple-900 to-purple-800 hover:from-purple-800 hover:to-purple-700 text-white font-semibold py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  type="button"
                >
                  Calculate
                </button>
              </div>
            </div>
          ))}

          {plans.length < 6 && (
            <div className="bg-purple-400/30 backdrop-blur-sm border-2 border-purple-300/50 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[500px]">
              <div className="text-center">
                <p className="text-white text-lg font-semibold mb-6">
                  Add Calculator
                </p>
                <button 
                  onClick={addNewPlan}
                  className="w-16 h-16 bg-white/30 backdrop-blur-sm border-2 border-white/50 rounded-full flex items-center justify-center hover:bg-white/40 transition-all duration-200 cursor-pointer"
                  type="button"
                >
                  <Plus className="w-8 h-8 text-white" strokeWidth={3} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}