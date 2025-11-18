"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, setDoc, doc, writeBatch, deleteDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { Save, DollarSign, Plus, Trash2, ChevronUp, ChevronDown, Check, Circle, X } from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "@/app/(admin-components)/Sidebar";
import toast from "react-hot-toast";

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

interface Feature {
  id: string;
  name: string;
  starter: boolean | string;
  professional: boolean | string;
  organization: boolean | string;
  order: number;
}

export default function PricingManagementPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'plans' | 'features'>('plans');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Pricing Plans
        const plansSnapshot = await getDocs(collection(db, "pricingPlans"));
        if (plansSnapshot.empty) {
          const defaultPlans: PricingPlan[] = [
            {
              id: "plan-starter",
              name: "Starter",
              description: "Essential services for new businesses.",
              price: "$99",
              period: "/month",
              features: [
                "Basic SEO Audit",
                "5 Articles Content Writing",
                "1 Social Media Platform",
                "Monthly Performance Reports"
              ],
              buttonText: "Get Started",
              isProfessional: false,
              slug: "starter",
              order: 1,
              tagline: "Essential Marketing Solutions for New Businesses",
              title: "Launch Your Brand Successfully",
              discount: "Billed annually for a 15% discount"
            },
            {
              id: "plan-professional",
              name: "Professional",
              badge: "MOST POPULAR",
              description: "Comprehensive solutions for growing brands.",
              price: "$249",
              period: "/month",
              features: [
                "Advanced SEO Strategy",
                "20 Articles Content Writing",
                "5 Social Media Platforms",
                "Weekly Performance Reports",
                "Basic Web Development (Landing Page)",
                "Tier 2 Influencer Access",
                "24/7 Support"
              ],
              buttonText: "Choose Plan",
              isProfessional: true,
              slug: "professional",
              order: 2,
              tagline: "Comprehensive Solutions for Growing Brands",
              title: "Scale Your Brand's Growth",
              discount: "Billed annually for a 20% discount"
            },
            {
              id: "plan-organization",
              name: "Organization",
              description: "Comprehensive solutions for growing brands.",
              price: "$599",
              period: "/month",
              features: [
                "Custom 4k Video Production",
                "Unlimited Print Production Assets",
                "Advanced SEO & Analytics",
                "Custom Web Development (Unlimited Pages)",
                "Dedicated Video Editing Team",
                "Unlimited Graphic Design Concepts",
                "Content Writing (Unlimited)",
                "Influencer Marketing (Full Campaign)",
                "Social Media Marketing (Full Management)",
                "Email Marketing (Advanced Campaigns)"
              ],
              buttonText: "Choose Organization",
              isProfessional: false,
              slug: "organization",
              order: 3,
              tagline: "Enterprise-Level Solutions for Established Brands",
              title: "Dominate Your Market",
              discount: "Billed annually for a 25% discount"
            }
          ];
          
          for (const plan of defaultPlans) {
            await setDoc(doc(db, "pricingPlans", plan.id), plan);
          }
          setPlans(defaultPlans);
        } else {
          const data: PricingPlan[] = plansSnapshot.docs
            .map((d) => ({ id: d.id, ...d.data() } as PricingPlan))
            .sort((a, b) => a.order - b.order);
          setPlans(data);
        }

        // Fetch Feature Comparison
        const featuresSnapshot = await getDocs(collection(db, "featureComparison"));
        if (featuresSnapshot.empty) {
          const defaultFeatures: Feature[] = [
            {
              id: "feature-1",
              name: "AI Video Production",
              starter: true,
              professional: true,
              organization: true,
              order: 1
            },
            {
              id: "feature-2",
              name: "Print Productions",
              starter: true,
              professional: true,
              organization: true,
              order: 2
            },
            {
              id: "feature-3",
              name: "SEO Optimization",
              starter: "Basic",
              professional: "Advanced",
              organization: "Premium",
              order: 3
            }
          ];
          
          for (const feature of defaultFeatures) {
            await setDoc(doc(db, "featureComparison", feature.id), feature);
          }
          setFeatures(defaultFeatures);
        } else {
          const data: Feature[] = featuresSnapshot.docs
            .map((d) => ({ id: d.id, ...d.data() } as Feature))
            .sort((a, b) => a.order - b.order);
          setFeatures(data);
        }

        toast.success("Data loaded successfully!", { position: "top-center" });
      } catch (error: unknown) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data from database.", { 
          position: "top-center",
          duration: 4000 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const validatePlans = (plans: PricingPlan[]): boolean => {
    const isValid = plans.every(plan => 
      plan.name.trim() !== '' && 
      plan.price.trim() !== '' && 
      plan.slug.trim() !== '' &&
      plan.features.length > 0 &&
      plan.order > 0
    );
    
    if (!isValid) {
      toast.error("Please fix validation errors. Ensure all plans have name, price, slug and at least one feature.", { 
        position: "top-center",
        duration: 5000
      });
    }
    
    return isValid;
  };

  const validateFeatures = (features: Feature[]): boolean => {
    const isValid = features.every(feature => 
      feature.name.trim() !== '' && 
      feature.order > 0
    );
    
    if (!isValid) {
      toast.error("Please fix validation errors. Ensure all features have a name.", { 
        position: "top-center",
        duration: 5000
      });
    }
    
    return isValid;
  };

  const handlePlanChange = (id: string, field: keyof PricingPlan, value: string | boolean | number) => {
    setPlans((prevPlans) =>
      prevPlans.map((plan) =>
        plan.id === id ? { ...plan, [field]: value } : plan
      )
    );
  };

  const handleFeatureChange = (planId: string, index: number, value: string) => {
    setPlans((prevPlans) =>
      prevPlans.map((plan) => {
        if (plan.id === planId) {
          const newFeatures = [...plan.features];
          newFeatures[index] = value;
          return { ...plan, features: newFeatures };
        }
        return plan;
      })
    );
  };

  const addFeature = (planId: string) => {
    setPlans((prevPlans) =>
      prevPlans.map((plan) => {
        if (plan.id === planId) {
          return { ...plan, features: [...plan.features, "New Feature"] };
        }
        return plan;
      })
    );
  };

  const removeFeature = (planId: string, index: number) => {
    setPlans((prevPlans) =>
      prevPlans.map((plan) => {
        if (plan.id === planId && plan.features.length > 1) {
          const newFeatures = plan.features.filter((_, i) => i !== index);
          return { ...plan, features: newFeatures };
        }
        return plan;
      })
    );
  };

  const handleSaveAll = async () => {
    if (activeTab === 'plans') {
      if (!validatePlans(plans)) return;
      
      setSaving(true);
      try {
        const batch = writeBatch(db);
        plans.forEach(plan => {
          const planRef = doc(db, "pricingPlans", plan.id);
          batch.set(planRef, plan);
        });
        await batch.commit();
        
        toast.success("All pricing plans saved successfully!", {
          duration: 3000,
          position: "top-center",
          style: { background: '#10B981', color: 'white' },
        });
      } catch (error: unknown) {
        console.error("Error saving pricing plans:", error);
        toast.error("Failed to save pricing plans to database.", {
          duration: 4000,
          position: "top-center",
        });
      } finally {
        setSaving(false);
      }
    } else {
      if (!validateFeatures(features)) return;
      
      setSaving(true);
      try {
        const batch = writeBatch(db);
        features.forEach(feature => {
          const featureRef = doc(db, "featureComparison", feature.id);
          batch.set(featureRef, feature);
        });
        await batch.commit();
        
        toast.success("All features saved successfully!", {
          duration: 3000,
          position: "top-center",
          style: { background: '#10B981', color: 'white' },
        });
      } catch (error: unknown) {
        console.error("Error saving features:", error);
        toast.error("Failed to save features to database.", {
          duration: 4000,
          position: "top-center",
        });
      } finally {
        setSaving(false);
      }
    }
  };

  const movePlan = (id: string, direction: 'up' | 'down') => {
    setPlans(prev => {
      const newPlans = [...prev];
      const currentIndex = newPlans.findIndex(plan => plan.id === id);
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      if (newIndex >= 0 && newIndex < newPlans.length) {
        [newPlans[currentIndex], newPlans[newIndex]] = 
        [newPlans[newIndex], newPlans[currentIndex]];
        
        return newPlans.map((plan, index) => ({ ...plan, order: index + 1 }));
      }
      return newPlans;
    });
  };

  const addNewPlan = () => {
    const newPlan: PricingPlan = {
      id: `plan-${Date.now()}`,
      name: "New Plan",
      description: "Plan description",
      price: "$0",
      period: "/month",
      features: ["Feature 1"],
      buttonText: "Get Started",
      isProfessional: false,
      slug: `plan-${Date.now()}`,
      order: plans.length + 1,
    };
    setPlans(prev => [...prev, newPlan]);
    toast.success("New plan added!", { position: "top-center", duration: 3000 });
  };

  const deletePlan = async (id: string) => {
    if (plans.length <= 1) {
      toast.error("You must have at least one pricing plan", { 
        position: "top-center",
        duration: 4000 
      });
      return;
    }
    
    if (window.confirm("Are you sure you want to delete this pricing plan? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, "pricingPlans", id));
        setPlans(prev => {
          const filtered = prev.filter(plan => plan.id !== id);
          return filtered.map((plan, index) => ({ ...plan, order: index + 1 }));
        });
        toast.success("Pricing plan deleted successfully", { position: "top-center", duration: 3000 });
      } catch (error: unknown) {
        console.error("Error deleting plan:", error);
        toast.error("Failed to delete pricing plan", { position: "top-center", duration: 4000 });
      }
    }
  };

  // Feature Comparison Functions
  const handleFeatureFieldChange = (id: string, field: keyof Feature, value: string | boolean | number) => {
    setFeatures((prevFeatures) =>
      prevFeatures.map((feature) =>
        feature.id === id ? { ...feature, [field]: value } : feature
      )
    );
  };

  const handlePlanValueChange = (id: string, plan: 'starter' | 'professional' | 'organization', value: string, isBoolean: boolean) => {
    setFeatures((prevFeatures) =>
      prevFeatures.map((feature) => {
        if (feature.id === id) {
          if (isBoolean) {
            return { ...feature, [plan]: value === 'true' };
          } else {
            return { ...feature, [plan]: value };
          }
        }
        return feature;
      })
    );
  };

  const moveFeature = (id: string, direction: 'up' | 'down') => {
    setFeatures(prev => {
      const newFeatures = [...prev];
      const currentIndex = newFeatures.findIndex(feature => feature.id === id);
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      if (newIndex >= 0 && newIndex < newFeatures.length) {
        [newFeatures[currentIndex], newFeatures[newIndex]] = 
        [newFeatures[newIndex], newFeatures[currentIndex]];
        
        return newFeatures.map((feature, index) => ({ ...feature, order: index + 1 }));
      }
      return newFeatures;
    });
  };

  const addNewFeature = () => {
    const newFeature: Feature = {
      id: `feature-${Date.now()}`,
      name: "New Feature",
      starter: false,
      professional: false,
      organization: false,
      order: features.length + 1,
    };
    setFeatures(prev => [...prev, newFeature]);
    toast.success("New feature added!", { position: "top-center", duration: 3000 });
  };

  const deleteFeature = async (id: string) => {
    if (features.length <= 1) {
      toast.error("You must have at least one feature", { position: "top-center", duration: 4000 });
      return;
    }
    
    if (window.confirm("Are you sure you want to delete this feature? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, "featureComparison", id));
        setFeatures(prev => {
          const filtered = prev.filter(feature => feature.id !== id);
          return filtered.map((feature, index) => ({ ...feature, order: index + 1 }));
        });
        toast.success("Feature deleted successfully", { position: "top-center", duration: 3000 });
      } catch (error: unknown) {
        console.error("Error deleting feature:", error);
        toast.error("Failed to delete feature", { position: "top-center", duration: 4000 });
      }
    }
  };

  const renderCellPreview = (value: boolean | string) => {
    if (value === true) {
      return <Check className="w-5 h-5 text-green-500" />;
    }
    if (value === false) {
      return <X className="w-5 h-5 text-red-400 opacity-50" />;
    }
    return <span className="text-sm font-medium text-gray-700">{value}</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1e183a] text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Sidebar />

      <div className="md:ml-64 p-4 sm:p-6 lg:p-8 text-white min-h-screen bg-[#1e183a] transition-all duration-300">
        {/* Header with Tabs */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left mb-3">
              Pricing Management
            </h1>
            {/* Tabs */}
            <div className="flex gap-2 bg-[#2a2250]/80 p-1 rounded-lg w-fit">
              <button
                onClick={() => setActiveTab('plans')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'plans'
                    ? 'bg-purple-600 text-white'
                    : 'text-purple-300 hover:bg-purple-600/30'
                }`}
              >
                Pricing Plans
              </button>
              <button
                onClick={() => setActiveTab('features')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'features'
                    ? 'bg-purple-600 text-white'
                    : 'text-purple-300 hover:bg-purple-600/30'
                }`}
              >
                Feature Comparison
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={activeTab === 'plans' ? addNewPlan : addNewFeature}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <Plus size={18} />
              {activeTab === 'plans' ? 'Add Plan' : 'Add Feature'}
            </button>
            
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                saving ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
              }`}
            >
              <Save size={18} />
              {saving ? "Saving..." : "Save All Changes"}
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-200">
            💡 <strong>Tip:</strong> {activeTab === 'plans' 
              ? 'Changes will be reflected on the Pricing page after saving.' 
              : 'Use boolean (true/false) for checkmarks/X marks, or text values for custom descriptions.'}
          </p>
        </div>

        {/* Pricing Plans Tab */}
        {activeTab === 'plans' && (
          <div className="grid grid-cols-1 gap-6">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
                className="bg-[#2a2250]/80 rounded-2xl p-6 shadow-md hover:shadow-lg transition border border-white/5"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Preview Card */}
                  <div className="lg:col-span-1">
                    <h3 className="text-lg font-semibold mb-4 text-purple-300">Preview</h3>
                    <div className={`bg-white rounded-2xl p-6 shadow-xl ${plan.isProfessional ? 'ring-2 ring-purple-500' : ''}`}>
                      {plan.badge && (
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
                          {plan.badge}
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                      <p className="text-gray-500 text-sm mb-4">{plan.description}</p>
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                        <span className="text-gray-500">{plan.period}</span>
                      </div>
                      <ul className="space-y-2 mb-4">
                        {plan.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            {plan.isProfessional ? (
                              <Check className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                            ) : (
                              <Circle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" />
                            )}
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                        {plan.features.length > 3 && (
                          <li className="text-xs text-gray-500">+{plan.features.length - 3} more features</li>
                        )}
                      </ul>
                      <button className="w-full bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-2 rounded-lg text-sm">
                        {plan.buttonText}
                      </button>
                    </div>
                  </div>

                  {/* Edit Form */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-purple-300">Edit Plan</h3>
                      <div className="bg-purple-600/30 text-purple-200 text-sm px-3 py-1 rounded-full border border-purple-500/30">
                        Order: {plan.order}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Plan Name *</label>
                        <input
                          type="text"
                          value={plan.name}
                          onChange={(e) => handlePlanChange(plan.id, "name", e.target.value)}
                          className="w-full bg-[#1e183a] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 border border-white/20"
                          placeholder="e.g., Starter"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Slug *</label>
                        <input
                          type="text"
                          value={plan.slug}
                          onChange={(e) => handlePlanChange(plan.id, "slug", e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                          className="w-full bg-[#1e183a] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 border border-white/20"
                          placeholder="e.g., starter"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Price *</label>
                        <input
                          type="text"
                          value={plan.price}
                          onChange={(e) => handlePlanChange(plan.id, "price", e.target.value)}
                          className="w-full bg-[#1e183a] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 border border-white/20"
                          placeholder="e.g., $99"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Period</label>
                        <input
                          type="text"
                          value={plan.period}
                          onChange={(e) => handlePlanChange(plan.id, "period", e.target.value)}
                          className="w-full bg-[#1e183a] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 border border-white/20"
                          placeholder="e.g., /month"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Button Text</label>
                        <input
                          type="text"
                          value={plan.buttonText}
                          onChange={(e) => handlePlanChange(plan.id, "buttonText", e.target.value)}
                          className="w-full bg-[#1e183a] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 border border-white/20"
                          placeholder="e.g., Get Started"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Badge (Optional)</label>
                        <input
                          type="text"
                          value={plan.badge || ''}
                          onChange={(e) => handlePlanChange(plan.id, "badge", e.target.value)}
                          className="w-full bg-[#1e183a] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 border border-white/20"
                          placeholder="e.g., MOST POPULAR"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <textarea
                        value={plan.description}
                        onChange={(e) => handlePlanChange(plan.id, "description", e.target.value)}
                        className="w-full bg-[#1e183a] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 border border-white/20"
                        rows={2}
                        placeholder="Plan description"
                      />
                    </div>

                    {/* New Detail Page Fields */}
                    <div className="border-t border-white/10 pt-4">
                      <h4 className="text-sm font-semibold text-purple-300 mb-3">Detail Page Settings (Optional)</h4>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Tagline</label>
                          <input
                            type="text"
                            value={plan.tagline || ''}
                            onChange={(e) => handlePlanChange(plan.id, "tagline", e.target.value)}
                            className="w-full bg-[#1e183a] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 border border-white/20"
                            placeholder="e.g., Essential Marketing Solutions for New Businesses"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Hero Title</label>
                          <input
                            type="text"
                            value={plan.title || ''}
                            onChange={(e) => handlePlanChange(plan.id, "title", e.target.value)}
                            className="w-full bg-[#1e183a] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 border border-white/20"
                            placeholder="e.g., Launch Your Brand Successfully"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Discount Text</label>
                          <input
                            type="text"
                            value={plan.discount || ''}
                            onChange={(e) => handlePlanChange(plan.id, "discount", e.target.value)}
                            className="w-full bg-[#1e183a] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 border border-white/20"
                            placeholder="e.g., Billed annually for a 15% discount"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={plan.isProfessional}
                          onChange={(e) => handlePlanChange(plan.id, "isProfessional", e.target.checked)}
                          className="w-5 h-5 rounded border-white/20 bg-[#1e183a] checked:bg-purple-600"
                        />
                        <span className="text-sm">Professional Plan (uses check icons)</span>
                      </label>
                    </div>

                    {/* Features */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium">Features *</label>
                        <button
                          onClick={() => addFeature(plan.id)}
                          className="text-xs bg-purple-600/50 hover:bg-purple-600 px-3 py-1 rounded flex items-center gap-1"
                        >
                          <Plus size={14} />
                          Add Feature
                        </button>
                      </div>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input
                              type="text"
                              value={feature}
                              onChange={(e) => handleFeatureChange(plan.id, idx, e.target.value)}
                              className="flex-1 bg-[#1e183a] text-white p-2 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 border border-white/20 text-sm"
                              placeholder={`Feature ${idx + 1}`}
                            />
                            {plan.features.length > 1 && (
                              <button
                                onClick={() => removeFeature(plan.id, idx)}
                                className="bg-red-600/50 hover:bg-red-600 p-2 rounded-lg"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
                      <button
                        onClick={() => movePlan(plan.id, 'up')}
                        disabled={plan.order === 1}
                        className={`flex items-center justify-center gap-1 p-2 rounded-lg transition-colors ${
                          plan.order === 1 
                            ? 'bg-gray-600/30 text-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600/50 hover:bg-blue-600 text-white'
                        }`}
                      >
                        <ChevronUp size={16} />
                        Move Up
                      </button>
                      
                      <button
                        onClick={() => movePlan(plan.id, 'down')}
                        disabled={plan.order === plans.length}
                        className={`flex items-center justify-center gap-1 p-2 rounded-lg transition-colors ${
                          plan.order === plans.length 
                            ? 'bg-gray-600/30 text-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600/50 hover:bg-blue-600 text-white'
                        }`}
                      >
                        <ChevronDown size={16} />
                        Move Down
                      </button>
                      
                      <button
                        onClick={() => deletePlan(plan.id)}
                        disabled={plans.length <= 1}
                        className={`flex items-center justify-center gap-1 p-2 rounded-lg transition-colors ${
                          plans.length <= 1 
                            ? 'bg-gray-600/30 text-gray-400 cursor-not-allowed' 
                            : 'bg-red-600/50 hover:bg-red-600 text-white'
                        }`}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Empty State for Plans */}
            {plans.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-white/5 rounded-2xl p-8 max-w-md mx-auto">
                  <DollarSign className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No Pricing Plans</h3>
                  <p className="text-purple-200 mb-6">Get started by adding your first pricing plan.</p>
                  <button
                    onClick={addNewPlan}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 mx-auto transition-all hover:scale-105"
                  >
                    <Plus size={20} />
                    Add Your First Plan
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Feature Comparison Tab */}
        {activeTab === 'features' && (
          <div className="grid grid-cols-1 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="bg-[#2a2250]/80 rounded-2xl p-6 shadow-md hover:shadow-lg transition border border-white/5"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Preview Card */}
                  <div className="lg:col-span-1">
                    <h3 className="text-lg font-semibold mb-4 text-purple-300">Preview</h3>
                    <div className="bg-white rounded-xl p-4 shadow-lg">
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="col-span-4 bg-purple-100 p-2 rounded-lg mb-2">
                          <p className="text-sm font-semibold text-gray-800">{feature.name}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-xs text-gray-500 mb-1">Starter</p>
                          <div className="flex justify-center items-center h-6">
                            {renderCellPreview(feature.starter)}
                          </div>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-xs text-gray-500 mb-1">Professional</p>
                          <div className="flex justify-center items-center h-6">
                            {renderCellPreview(feature.professional)}
                          </div>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-xs text-gray-500 mb-1">Organization</p>
                          <div className="flex justify-center items-center h-6">
                            {renderCellPreview(feature.organization)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Edit Form */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-purple-300">Edit Feature</h3>
                      <div className="bg-purple-600/30 text-purple-200 text-sm px-3 py-1 rounded-full border border-purple-500/30">
                        Order: {feature.order}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Feature Name *</label>
                      <input
                        type="text"
                        value={feature.name}
                        onChange={(e) => handleFeatureFieldChange(feature.id, "name", e.target.value)}
                        className="w-full bg-[#1e183a] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 border border-white/20"
                        placeholder="e.g., AI Video Production"
                      />
                    </div>

                    {/* Starter Plan */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Starter Plan</label>
                      <div className="flex gap-3">
                        <select
                          value={typeof feature.starter === 'boolean' ? 'boolean' : 'text'}
                          onChange={(e) => {
                            const isBoolean = e.target.value === 'boolean';
                            handlePlanValueChange(feature.id, 'starter', isBoolean ? 'false' : '', isBoolean);
                          }}
                          className="bg-[#1e183a] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 border border-white/20"
                        >
                          <option value="boolean">Boolean (✓/✗)</option>
                          <option value="text">Text Value</option>
                        </select>
                        
                        {typeof feature.starter === 'boolean' ? (
                          <select
                            value={feature.starter.toString()}
                            onChange={(e) => handlePlanValueChange(feature.id, 'starter', e.target.value, true)}
                            className="flex-1 bg-[#1e183a] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 border border-white/20"
                          >
                            <option value="true">✓ Included</option>
                            <option value="false">✗ Not Included</option>
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={feature.starter as string}
                            onChange={(e) => handlePlanValueChange(feature.id, 'starter', e.target.value, false)}
                            className="flex-1 bg-[#1e183a] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 border border-white/20"
                            placeholder="e.g., Basic, 5 hours, etc."
                          />
                        )}
                      </div>
                    </div>

                    {/* Professional Plan */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Professional Plan</label>
                      <div className="flex gap-3">
                        <select
                          value={typeof feature.professional === 'boolean' ? 'boolean' : 'text'}
                          onChange={(e) => {
                            const isBoolean = e.target.value === 'boolean';
                            handlePlanValueChange(feature.id, 'professional', isBoolean ? 'false' : '', isBoolean);
                          }}
                          className="bg-[#1e183a] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 border border-white/20"
                        >
                          <option value="boolean">Boolean (✓/✗)</option>
                          <option value="text">Text Value</option>
                        </select>
                        
                        {typeof feature.professional === 'boolean' ? (
                          <select
                            value={feature.professional.toString()}
                            onChange={(e) => handlePlanValueChange(feature.id, 'professional', e.target.value, true)}
                            className="flex-1 bg-[#1e183a] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 border border-white/20"
                          >
                            <option value="true">✓ Included</option>
                            <option value="false">✗ Not Included</option>
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={feature.professional as string}
                            onChange={(e) => handlePlanValueChange(feature.id, 'professional', e.target.value, false)}
                            className="flex-1 bg-[#1e183a] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 border border-white/20"
                            placeholder="e.g., Advanced, 20 hours, etc."
                          />
                        )}
                      </div>
                    </div>

                    {/* Organization Plan */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Organization Plan</label>
                      <div className="flex gap-3">
                        <select
                          value={typeof feature.organization === 'boolean' ? 'boolean' : 'text'}
                          onChange={(e) => {
                            const isBoolean = e.target.value === 'boolean';
                            handlePlanValueChange(feature.id, 'organization', isBoolean ? 'false' : '', isBoolean);
                          }}
                          className="bg-[#1e183a] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 border border-white/20"
                        >
                          <option value="boolean">Boolean (✓/✗)</option>
                          <option value="text">Text Value</option>
                        </select>
                        
                        {typeof feature.organization === 'boolean' ? (
                          <select
                            value={feature.organization.toString()}
                            onChange={(e) => handlePlanValueChange(feature.id, 'organization', e.target.value, true)}
                            className="flex-1 bg-[#1e183a] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 border border-white/20"
                          >
                            <option value="true">✓ Included</option>
                            <option value="false">✗ Not Included</option>
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={feature.organization as string}
                            onChange={(e) => handlePlanValueChange(feature.id, 'organization', e.target.value, false)}
                            className="flex-1 bg-[#1e183a] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 border border-white/20"
                            placeholder="e.g., Premium, Unlimited, etc."
                          />
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
                      <button
                        onClick={() => moveFeature(feature.id, 'up')}
                        disabled={feature.order === 1}
                        className={`flex items-center justify-center gap-1 p-2 rounded-lg transition-colors ${
                          feature.order === 1 
                            ? 'bg-gray-600/30 text-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600/50 hover:bg-blue-600 text-white'
                        }`}
                      >
                        <ChevronUp size={16} />
                        Move Up
                      </button>
                      
                      <button
                        onClick={() => moveFeature(feature.id, 'down')}
                        disabled={feature.order === features.length}
                        className={`flex items-center justify-center gap-1 p-2 rounded-lg transition-colors ${
                          feature.order === features.length 
                            ? 'bg-gray-600/30 text-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600/50 hover:bg-blue-600 text-white'
                        }`}
                      >
                        <ChevronDown size={16} />
                        Move Down
                      </button>
                      
                      <button
                        onClick={() => deleteFeature(feature.id)}
                        disabled={features.length <= 1}
                        className={`flex items-center justify-center gap-1 p-2 rounded-lg transition-colors ${
                          features.length <= 1 
                            ? 'bg-gray-600/30 text-gray-400 cursor-not-allowed' 
                            : 'bg-red-600/50 hover:bg-red-600 text-white'
                        }`}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Empty State for Features */}
            {features.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-white/5 rounded-2xl p-8 max-w-md mx-auto">
                  <Check className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No Features</h3>
                  <p className="text-purple-200 mb-6">Get started by adding your first feature comparison.</p>
                  <button
                    onClick={addNewFeature}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 mx-auto transition-all hover:scale-105"
                  >
                    <Plus size={20} />
                    Add Your First Feature
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}