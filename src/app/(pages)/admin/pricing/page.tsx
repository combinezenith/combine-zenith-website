"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, setDoc, doc, writeBatch, deleteDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { Save, DollarSign, Plus, Trash2, ChevronUp, ChevronDown, Check, Circle, X, Calculator } from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "@/app/(admin-components)/Sidebar";
import toast from "react-hot-toast";

interface SubscriptionFeature {
  id: string;
  title: string;
  description: string;
  order: number;
}

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
  subscriptionFeatures?: SubscriptionFeature[];
}

interface Feature {
  id: string;
  name: string;
  starter: boolean | string;
  professional: boolean | string;
  organization: boolean | string;
  order: number;
}

interface CalculatorService {
  id: string;
  name: string;
  description: string;
  options: ServiceOption[];
  order: number;
}

interface ServiceOption {
  id: string;
  name: string;
  price: number;
  description: string;
  order: number;
}

interface PricingCalculator {
  id: string;
  title: string;
  description: string;
  basePrice: number;
  services: CalculatorService[];
  order: number;
}

export default function PricingManagementPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [calculator, setCalculator] = useState<PricingCalculator[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'plans' | 'features' | 'calculator'>('plans');

  useEffect(() => {
    const fetchData = async () => {
      try {
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
              discount: "Billed annually for a 15% discount",
              subscriptionFeatures: [
                {
                  id: "feature-1",
                  title: "Digital Strategy",
                  description: "Tailored plans for online presence and growth.",
                  order: 1
                },
                {
                  id: "feature-2",
                  title: "Content Hub",
                  description: "High-quality articles, blogs, and visual content.",
                  order: 2
                },
                {
                  id: "feature-3",
                  title: "Social Boost",
                  description: "Boost your presence across all social platforms.",
                  order: 3
                },
                {
                  id: "feature-4",
                  title: "Ad Campaigns",
                  description: "High-converting ads on Google, Meta, and more.",
                  order: 4
                }
              ]
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
              discount: "Billed annually for a 20% discount",
              subscriptionFeatures: [
                {
                  id: "feature-5",
                  title: "Advanced Strategy",
                  description: "Comprehensive digital marketing strategy.",
                  order: 1
                },
                {
                  id: "feature-6",
                  title: "Premium Content",
                  description: "Unlimited content creation and strategy.",
                  order: 2
                },
                {
                  id: "feature-7",
                  title: "Multi-Platform Management",
                  description: "Full management across all social platforms.",
                  order: 3
                },
                {
                  id: "feature-8",
                  title: "Advanced Analytics",
                  description: "Detailed performance tracking and reporting.",
                  order: 4
                }
              ]
            },
            {
              id: "plan-organization",
              name: "Organization",
              description: "Enterprise-level solutions for established brands.",
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
              discount: "Billed annually for a 25% discount",
              subscriptionFeatures: [
                {
                  id: "feature-9",
                  title: "Enterprise Strategy",
                  description: "Custom enterprise-level marketing strategy.",
                  order: 1
                },
                {
                  id: "feature-10",
                  title: "Dedicated Team",
                  description: "Your own dedicated marketing team.",
                  order: 2
                },
                {
                  id: "feature-11",
                  title: "Full Funnel Marketing",
                  description: "Complete marketing funnel management.",
                  order: 3
                },
                {
                  id: "feature-12",
                  title: "Premium Support",
                  description: "24/7 premium support and consulting.",
                  order: 4
                }
              ]
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

        const calculatorSnapshot = await getDocs(collection(db, "pricingCalculator"));
        if (calculatorSnapshot.empty) {
          const defaultCalculator: PricingCalculator[] = [
            {
              id: "calculator-1",
              title: "Custom Project Calculator",
              description: "Get an estimate for your custom project requirements",
              basePrice: 500,
              services: [
                {
                  id: "service-1",
                  name: "AI Video Production",
                  description: "Professional AI video production services",
                  order: 1,
                  options: [
                    { id: "opt-1", name: "Basic Package", price: 99, description: "Essential video production", order: 1 },
                    { id: "opt-2", name: "Premium Package", price: 220, description: "Enhanced video production", order: 2 },
                    { id: "opt-3", name: "Advanced Package", price: 440, description: "Full video production suite", order: 3 }
                  ]
                }
              ],
              order: 1
            }
          ];
          
          for (const calc of defaultCalculator) {
            await setDoc(doc(db, "pricingCalculator", calc.id), calc);
          }
          setCalculator(defaultCalculator);
        } else {
          const data: PricingCalculator[] = calculatorSnapshot.docs
            .map((d) => ({ id: d.id, ...d.data() } as PricingCalculator))
            .sort((a, b) => a.order - b.order);
          setCalculator(data);
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

  const validateCalculator = (calculator: PricingCalculator[]): boolean => {
    const isValid = calculator.every(calc => 
      calc.title.trim() !== '' && 
      calc.basePrice >= 0 &&
      calc.services.every(service => 
        service.name.trim() !== '' &&
        service.options.every(option => 
          option.name.trim() !== '' && 
          option.price >= 0
        )
      )
    );
    
    if (!isValid) {
      toast.error("Please fix validation errors. Ensure all calculators have title, valid base price, and services with valid options.", { 
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
    } else if (activeTab === 'features') {
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
    } else if (activeTab === 'calculator') {
      if (!validateCalculator(calculator)) return;
      
      setSaving(true);
      try {
        const batch = writeBatch(db);
        calculator.forEach(calc => {
          const calcRef = doc(db, "pricingCalculator", calc.id);
          batch.set(calcRef, calc);
        });
        await batch.commit();
        
        toast.success("All calculators saved successfully!", {
          duration: 3000,
          position: "top-center",
          style: { background: '#10B981', color: 'white' },
        });
      } catch (error: unknown) {
        console.error("Error saving calculators:", error);
        toast.error("Failed to save calculators to database.", {
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

  const handleCalculatorChange = (id: string, field: keyof PricingCalculator, value: string | number) => {
    setCalculator(prev => 
      prev.map(calc => 
        calc.id === id ? { ...calc, [field]: value } : calc
      )
    );
  };

  const handleServiceChange = (calculatorId: string, serviceId: string, field: keyof CalculatorService, value: string) => {
    setCalculator(prev =>
      prev.map(calc => {
        if (calc.id === calculatorId) {
          const updatedServices = calc.services.map(service =>
            service.id === serviceId ? { ...service, [field]: value } : service
          );
          return { ...calc, services: updatedServices };
        }
        return calc;
      })
    );
  };

  const handleOptionChange = (calculatorId: string, serviceId: string, optionId: string, field: keyof ServiceOption, value: string | number) => {
    setCalculator(prev =>
      prev.map(calc => {
        if (calc.id === calculatorId) {
          const updatedServices = calc.services.map(service => {
            if (service.id === serviceId) {
              const updatedOptions = service.options.map(option =>
                option.id === optionId ? { ...option, [field]: value } : option
              );
              return { ...service, options: updatedOptions };
            }
            return service;
          });
          return { ...calc, services: updatedServices };
        }
        return calc;
      })
    );
  };

  const addNewCalculator = () => {
    const newCalculator: PricingCalculator = {
      id: `calculator-${Date.now()}`,
      title: "New Pricing Calculator",
      description: "Customize your project and get an instant quote",
      basePrice: 500,
      services: [],
      order: calculator.length + 1
    };
    setCalculator(prev => [...prev, newCalculator]);
    toast.success("New calculator added!", { position: "top-center", duration: 3000 });
  };

  const addNewService = (calculatorId: string) => {
    setCalculator(prev =>
      prev.map(calc => {
        if (calc.id === calculatorId) {
          const newService: CalculatorService = {
            id: `service-${Date.now()}`,
            name: "New Service",
            description: "Service description",
            options: [],
            order: calc.services.length + 1
          };
          return { ...calc, services: [...calc.services, newService] };
        }
        return calc;
      })
    );
  };

  const addNewOption = (calculatorId: string, serviceId: string) => {
    setCalculator(prev =>
      prev.map(calc => {
        if (calc.id === calculatorId) {
          const updatedServices = calc.services.map(service => {
            if (service.id === serviceId) {
              const newOption: ServiceOption = {
                id: `option-${Date.now()}`,
                name: "New Option",
                price: 100,
                description: "Option description",
                order: service.options.length + 1
              };
              return { ...service, options: [...service.options, newOption] };
            }
            return service;
          });
          return { ...calc, services: updatedServices };
        }
        return calc;
      })
    );
  };

  const moveCalculator = (id: string, direction: 'up' | 'down') => {
    setCalculator(prev => {
      const newCalculators = [...prev];
      const currentIndex = newCalculators.findIndex(calc => calc.id === id);
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      if (newIndex >= 0 && newIndex < newCalculators.length) {
        [newCalculators[currentIndex], newCalculators[newIndex]] = 
        [newCalculators[newIndex], newCalculators[currentIndex]];
        
        return newCalculators.map((calc, index) => ({ ...calc, order: index + 1 }));
      }
      return newCalculators;
    });
  };

  const moveService = (calculatorId: string, serviceId: string, direction: 'up' | 'down') => {
    setCalculator(prev =>
      prev.map(calc => {
        if (calc.id === calculatorId) {
          const newServices = [...calc.services];
          const currentIndex = newServices.findIndex(service => service.id === serviceId);
          const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
          
          if (newIndex >= 0 && newIndex < newServices.length) {
            [newServices[currentIndex], newServices[newIndex]] = 
            [newServices[newIndex], newServices[currentIndex]];
            
            const updatedServices = newServices.map((service, index) => ({ ...service, order: index + 1 }));
            return { ...calc, services: updatedServices };
          }
        }
        return calc;
      })
    );
  };

  const moveOption = (calculatorId: string, serviceId: string, optionId: string, direction: 'up' | 'down') => {
    setCalculator(prev =>
      prev.map(calc => {
        if (calc.id === calculatorId) {
          const updatedServices = calc.services.map(service => {
            if (service.id === serviceId) {
              const newOptions = [...service.options];
              const currentIndex = newOptions.findIndex(option => option.id === optionId);
              const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
              
              if (newIndex >= 0 && newIndex < newOptions.length) {
                [newOptions[currentIndex], newOptions[newIndex]] = 
                [newOptions[newIndex], newOptions[currentIndex]];
                
                const updatedOptions = newOptions.map((option, index) => ({ ...option, order: index + 1 }));
                return { ...service, options: updatedOptions };
              }
            }
            return service;
          });
          return { ...calc, services: updatedServices };
        }
        return calc;
      })
    );
  };

  const deleteCalculator = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this calculator? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, "pricingCalculator", id));
        setCalculator(prev => {
          const filtered = prev.filter(calc => calc.id !== id);
          return filtered.map((calc, index) => ({ ...calc, order: index + 1 }));
        });
        toast.success("Calculator deleted successfully", { position: "top-center", duration: 3000 });
      } catch (error: unknown) {
        console.error("Error deleting calculator:", error);
        toast.error("Failed to delete calculator", { position: "top-center", duration: 4000 });
      }
    }
  };

  const deleteService = (calculatorId: string, serviceId: string) => {
    setCalculator(prev =>
      prev.map(calc => {
        if (calc.id === calculatorId) {
          const filteredServices = calc.services.filter(service => service.id !== serviceId);
          const updatedServices = filteredServices.map((service, index) => ({ ...service, order: index + 1 }));
          return { ...calc, services: updatedServices };
        }
        return calc;
      })
    );
  };

  const deleteOption = (calculatorId: string, serviceId: string, optionId: string) => {
    setCalculator(prev =>
      prev.map(calc => {
        if (calc.id === calculatorId) {
          const updatedServices = calc.services.map(service => {
            if (service.id === serviceId) {
              const filteredOptions = service.options.filter(option => option.id !== optionId);
              const updatedOptions = filteredOptions.map((option, index) => ({ ...option, order: index + 1 }));
              return { ...service, options: updatedOptions };
            }
            return service;
          });
          return { ...calc, services: updatedServices };
        }
        return calc;
      })
    );
  };

  const handleSubscriptionFeatureChange = (planId: string, featureId: string, field: keyof SubscriptionFeature, value: string) => {
    setPlans(prevPlans =>
      prevPlans.map(plan => {
        if (plan.id === planId && plan.subscriptionFeatures) {
          const updatedFeatures = plan.subscriptionFeatures.map(feature =>
            feature.id === featureId ? { ...feature, [field]: value } : feature
          );
          return { ...plan, subscriptionFeatures: updatedFeatures };
        }
        return plan;
      })
    );
  };

  const addSubscriptionFeature = (planId: string) => {
    setPlans(prevPlans =>
      prevPlans.map(plan => {
        if (plan.id === planId) {
          const newFeature: SubscriptionFeature = {
            id: `sub-feature-${Date.now()}`,
            title: "New Feature",
            description: "Feature description",
            order: (plan.subscriptionFeatures?.length || 0) + 1
          };
          return {
            ...plan,
            subscriptionFeatures: [...(plan.subscriptionFeatures || []), newFeature]
          };
        }
        return plan;
      })
    );
  };

  const removeSubscriptionFeature = (planId: string, featureId: string) => {
    setPlans(prevPlans =>
      prevPlans.map(plan => {
        if (plan.id === planId && plan.subscriptionFeatures) {
          const filteredFeatures = plan.subscriptionFeatures.filter(feature => feature.id !== featureId);
          const updatedFeatures = filteredFeatures.map((feature, index) => ({ ...feature, order: index + 1 }));
          return { ...plan, subscriptionFeatures: updatedFeatures };
        }
        return plan;
      })
    );
  };

  const moveSubscriptionFeature = (planId: string, featureId: string, direction: 'up' | 'down') => {
    setPlans(prevPlans =>
      prevPlans.map(plan => {
        if (plan.id === planId && plan.subscriptionFeatures) {
          const newFeatures = [...plan.subscriptionFeatures];
          const currentIndex = newFeatures.findIndex(feature => feature.id === featureId);
          const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
          
          if (newIndex >= 0 && newIndex < newFeatures.length) {
            [newFeatures[currentIndex], newFeatures[newIndex]] = 
            [newFeatures[newIndex], newFeatures[currentIndex]];
            
            const updatedFeatures = newFeatures.map((feature, index) => ({ ...feature, order: index + 1 }));
            return { ...plan, subscriptionFeatures: updatedFeatures };
          }
        }
        return plan;
      })
    );
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
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left mb-3">
              Pricing Management
            </h1>
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
              <button
                onClick={() => setActiveTab('calculator')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'calculator'
                    ? 'bg-purple-600 text-white'
                    : 'text-purple-300 hover:bg-purple-600/30'
                }`}
              >
                Pricing Calculator
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={activeTab === 'plans' ? addNewPlan : activeTab === 'features' ? addNewFeature : addNewCalculator}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <Plus size={18} />
              {activeTab === 'plans' ? 'Add Plan' : activeTab === 'features' ? 'Add Feature' : 'Add Calculator'}
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

        <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-200">
            💡 <strong>Tip:</strong> {activeTab === 'plans' 
              ? 'Changes will be reflected on the Pricing page after saving.' 
              : activeTab === 'features' 
              ? 'Use boolean (true/false) for checkmarks/X marks, or text values for custom descriptions.'
              : 'Configure interactive pricing calculator with services and options.'}
          </p>
        </div>

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

                    {plan.subscriptionFeatures && plan.subscriptionFeatures.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-4 text-purple-300">Subscription Features Preview</h3>
                        <div className="bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 rounded-2xl p-6">
                          <h4 className="text-white text-xl font-bold text-center mb-4">
                            A {plan.name} subscription includes
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {plan.subscriptionFeatures.slice(0, 4).map((feature, idx) => (
                              <div key={idx} className="bg-white rounded-lg p-4 text-center">
                                <h5 className="text-gray-900 font-bold text-sm mb-1">
                                  {feature.title}
                                </h5>
                                <p className="text-gray-600 text-xs leading-relaxed">
                                  {feature.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-2 space-y-6">
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

                    <div className="border-t border-white/10 pt-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold text-purple-300">Subscription Features</h4>
                        <button
                          onClick={() => addSubscriptionFeature(plan.id)}
                          className="text-xs bg-purple-600/50 hover:bg-purple-600 px-3 py-1 rounded flex items-center gap-1"
                        >
                          <Plus size={14} />
                          Add Feature
                        </button>
                      </div>

                      <div className="space-y-4">
                        {plan.subscriptionFeatures?.map((feature, featureIndex) => (
                          <div key={feature.id} className="bg-[#1e183a] rounded-lg p-4 border border-white/10">
                            <div className="flex gap-3 mb-3">
                              <div className="flex flex-col gap-1">
                                <button
                                  onClick={() => moveSubscriptionFeature(plan.id, feature.id, 'up')}
                                  disabled={feature.order === 1}
                                  className={`p-1 rounded ${
                                    feature.order === 1 
                                      ? 'text-gray-500 cursor-not-allowed' 
                                      : 'text-purple-300 hover:bg-purple-600/30'
                                  }`}
                                >
                                  <ChevronUp size={14} />
                                </button>
                                <button
                                  onClick={() => moveSubscriptionFeature(plan.id, feature.id, 'down')}
                                  disabled={feature.order === (plan.subscriptionFeatures?.length || 0)}
                                  className={`p-1 rounded ${
                                    feature.order === (plan.subscriptionFeatures?.length || 0)
                                      ? 'text-gray-500 cursor-not-allowed' 
                                      : 'text-purple-300 hover:bg-purple-600/30'
                                  }`}
                                >
                                  <ChevronDown size={14} />
                                </button>
                              </div>
                              <div className="flex-1 space-y-2">
                                <input
                                  type="text"
                                  value={feature.title}
                                  onChange={(e) => handleSubscriptionFeatureChange(plan.id, feature.id, 'title', e.target.value)}
                                  className="w-full bg-[#2a2250] text-white p-2 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 border border-white/20 text-sm"
                                  placeholder="Feature title"
                                />
                                <textarea
                                  value={feature.description}
                                  onChange={(e) => handleSubscriptionFeatureChange(plan.id, feature.id, 'description', e.target.value)}
                                  className="w-full bg-[#2a2250] text-white p-2 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 border border-white/20 text-sm"
                                  rows={2}
                                  placeholder="Feature description"
                                />
                              </div>
                              <button
                                onClick={() => removeSubscriptionFeature(plan.id, feature.id)}
                                className="p-2 text-red-400 hover:bg-red-600/30 rounded self-start"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            <div className="text-xs text-purple-300 ml-11">
                              Order: {feature.order}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

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

        {activeTab === 'calculator' && (
          <div className="space-y-6">
            {calculator.map((calc, calcIndex) => (
              <motion.div
                key={calc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: calcIndex * 0.1 }}
                className="bg-[#2a2250]/80 rounded-2xl p-6 shadow-md hover:shadow-lg transition border border-white/5"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="lg:col-span-1">
                    <h3 className="text-lg font-semibold mb-4 text-purple-300">Calculator Preview</h3>
                    <div className="bg-white rounded-2xl p-6 shadow-xl text-gray-800">
                      <h3 className="text-xl font-bold mb-2">{calc.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{calc.description}</p>
                      
                      <div className="space-y-4">
                        {calc.services.slice(0, 3).map((service, serviceIndex) => (
                          <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-semibold mb-2">{service.name}</h4>
                            <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                            <select className="w-full p-2 border border-gray-300 rounded text-sm">
                              <option>Select an option</option>
                              {service.options.slice(0, 2).map(option => (
                                <option key={option.id} value={option.id}>
                                  {option.name} - ${option.price}
                                </option>
                              ))}
                              {service.options.length > 2 && (
                                <option>+{service.options.length - 2} more options</option>
                              )}
                            </select>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Base Price:</span>
                          <span className="font-semibold">${calc.basePrice}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Selected Services:</span>
                          <span className="font-semibold">$0</span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between items-center">
                            <span className="font-bold">Total Estimate:</span>
                            <span className="font-bold text-lg">${calc.basePrice}</span>
                          </div>
                        </div>
                      </div>

                      <button className="w-full bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-3 rounded-lg font-semibold mt-4">
                        Get Detailed Quote
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-1 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-purple-300">Edit Calculator</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => moveCalculator(calc.id, 'up')}
                          disabled={calc.order === 1}
                          className={`p-2 rounded ${
                            calc.order === 1 
                              ? 'text-gray-500 cursor-not-allowed' 
                              : 'text-purple-300 hover:bg-purple-600/30'
                          }`}
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          onClick={() => moveCalculator(calc.id, 'down')}
                          disabled={calc.order === calculator.length}
                          className={`p-2 rounded ${
                            calc.order === calculator.length 
                              ? 'text-gray-500 cursor-not-allowed' 
                              : 'text-purple-300 hover:bg-purple-600/30'
                          }`}
                        >
                          <ChevronDown size={16} />
                        </button>
                        <button
                          onClick={() => deleteCalculator(calc.id)}
                          className="p-2 text-red-400 hover:bg-red-600/30 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Calculator Title *</label>
                      <input
                        type="text"
                        value={calc.title}
                        onChange={(e) => handleCalculatorChange(calc.id, 'title', e.target.value)}
                        className="w-full bg-[#1e183a] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 border border-white/20"
                        placeholder="e.g., Custom Project Calculator"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <textarea
                        value={calc.description}
                        onChange={(e) => handleCalculatorChange(calc.id, 'description', e.target.value)}
                        className="w-full bg-[#1e183a] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 border border-white/20"
                        rows={2}
                        placeholder="Calculator description"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Base Price ($) *</label>
                      <input
                        type="number"
                        value={calc.basePrice}
                        onChange={(e) => handleCalculatorChange(calc.id, 'basePrice', parseFloat(e.target.value) || 0)}
                        className="w-full bg-[#1e183a] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 border border-white/20"
                        placeholder="0"
                        min="0"
                        step="50"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <label className="block text-sm font-medium">Services</label>
                        <button
                          onClick={() => addNewService(calc.id)}
                          className="text-xs bg-purple-600/50 hover:bg-purple-600 px-3 py-1 rounded flex items-center gap-1"
                        >
                          <Plus size={14} />
                          Add Service
                        </button>
                      </div>

                      <div className="space-y-4">
                        {calc.services.map((service, serviceIndex) => (
                          <div key={service.id} className="bg-[#1e183a] rounded-lg p-4 border border-white/10">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={service.name}
                                  onChange={(e) => handleServiceChange(calc.id, service.id, 'name', e.target.value)}
                                  className="w-full bg-[#2a2250] text-white p-2 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 border border-white/20 text-sm mb-2"
                                  placeholder="Service name"
                                />
                                <textarea
                                  value={service.description}
                                  onChange={(e) => handleServiceChange(calc.id, service.id, 'description', e.target.value)}
                                  className="w-full bg-[#2a2250] text-white p-2 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 border border-white/20 text-sm"
                                  rows={2}
                                  placeholder="Service description"
                                />
                              </div>
                              <div className="flex gap-1 ml-2">
                                <button
                                  onClick={() => moveService(calc.id, service.id, 'up')}
                                  disabled={service.order === 1}
                                  className={`p-1 rounded ${
                                    service.order === 1 
                                      ? 'text-gray-500 cursor-not-allowed' 
                                      : 'text-purple-300 hover:bg-purple-600/30'
                                  }`}
                                >
                                  <ChevronUp size={14} />
                                </button>
                                <button
                                  onClick={() => moveService(calc.id, service.id, 'down')}
                                  disabled={service.order === calc.services.length}
                                  className={`p-1 rounded ${
                                    service.order === calc.services.length 
                                      ? 'text-gray-500 cursor-not-allowed' 
                                      : 'text-purple-300 hover:bg-purple-600/30'
                                  }`}
                                >
                                  <ChevronDown size={14} />
                                </button>
                                <button
                                  onClick={() => deleteService(calc.id, service.id)}
                                  className="p-1 text-red-400 hover:bg-red-600/30 rounded"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>

                            <div className="ml-4 space-y-2">
                              <div className="flex justify-between items-center mb-2">
                                <label className="block text-xs font-medium">Options</label>
                                <button
                                  onClick={() => addNewOption(calc.id, service.id)}
                                  className="text-xs bg-blue-600/50 hover:bg-blue-600 px-2 py-1 rounded flex items-center gap-1"
                                >
                                  <Plus size={12} />
                                  Add Option
                                </button>
                              </div>

                              {service.options.map((option, optionIndex) => (
                                <div key={option.id} className="flex gap-2 items-start">
                                  <div className="flex-1 grid grid-cols-2 gap-2">
                                    <input
                                      type="text"
                                      value={option.name}
                                      onChange={(e) => handleOptionChange(calc.id, service.id, option.id, 'name', e.target.value)}
                                      className="bg-[#2a2250] text-white p-2 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 border border-white/20 text-sm"
                                      placeholder="Option name"
                                    />
                                    <input
                                      type="number"
                                      value={option.price}
                                      onChange={(e) => handleOptionChange(calc.id, service.id, option.id, 'price', parseFloat(e.target.value) || 0)}
                                      className="bg-[#2a2250] text-white p-2 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 border border-white/20 text-sm"
                                      placeholder="Price"
                                      min="0"
                                      step="50"
                                    />
                                    <input
                                      type="text"
                                      value={option.description}
                                      onChange={(e) => handleOptionChange(calc.id, service.id, option.id, 'description', e.target.value)}
                                      className="bg-[#2a2250] text-white p-2 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 border border-white/20 text-sm col-span-2"
                                      placeholder="Option description"
                                    />
                                  </div>
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => moveOption(calc.id, service.id, option.id, 'up')}
                                      disabled={option.order === 1}
                                      className={`p-1 rounded ${
                                        option.order === 1 
                                          ? 'text-gray-500 cursor-not-allowed' 
                                          : 'text-purple-300 hover:bg-purple-600/30'
                                      }`}
                                    >
                                      <ChevronUp size={12} />
                                    </button>
                                    <button
                                      onClick={() => moveOption(calc.id, service.id, option.id, 'down')}
                                      disabled={option.order === service.options.length}
                                      className={`p-1 rounded ${
                                        option.order === service.options.length 
                                          ? 'text-gray-500 cursor-not-allowed' 
                                          : 'text-purple-300 hover:bg-purple-600/30'
                                      }`}
                                    >
                                      <ChevronDown size={12} />
                                    </button>
                                    <button
                                      onClick={() => deleteOption(calc.id, service.id, option.id)}
                                      className="p-1 text-red-400 hover:bg-red-600/30 rounded"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {calculator.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-white/5 rounded-2xl p-8 max-w-md mx-auto">
                  <Calculator className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No Pricing Calculators</h3>
                  <p className="text-purple-200 mb-6">Create an interactive pricing calculator for your customers.</p>
                  <button
                    onClick={addNewCalculator}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 mx-auto transition-all hover:scale-105"
                  >
                    <Plus size={20} />
                    Create Calculator
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