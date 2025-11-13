"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, setDoc, doc, writeBatch, deleteDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { Save, TrendingUp, Award, Users, Star, Plus, Heart, Target, Clock, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "@/app/(admin-components)/Sidebar";
import toast from "react-hot-toast";

interface Stat {
  id: string;
  icon: string;
  value: number;
  label: string;
  color: string;
  suffix: string;
  order: number;
}

const iconMap = {
  Star: Star,
  Award: Award,
  Users: Users,
  TrendingUp: TrendingUp,
  Heart: Heart,
  Target: Target,
  Clock: Clock,
};

const colorOptions = [
  { value: "text-yellow-400", label: "Yellow", bg: "bg-yellow-400" },
  { value: "text-green-400", label: "Green", bg: "bg-green-400" },
  { value: "text-blue-400", label: "Blue", bg: "bg-blue-400" },
  { value: "text-purple-400", label: "Purple", bg: "bg-purple-400" },
  { value: "text-red-400", label: "Red", bg: "bg-red-400" },
  { value: "text-pink-400", label: "Pink", bg: "bg-pink-400" },
  { value: "text-indigo-400", label: "Indigo", bg: "bg-indigo-400" },
  { value: "text-teal-400", label: "Teal", bg: "bg-teal-400" },
];

export default function StatsManagementPage() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const snapshot = await getDocs(collection(db, "stats"));
        if (snapshot.empty) {
          // Initialize default stats if none exist
          const defaultStats: Stat[] = [
            {
              id: "stat1",
              icon: "Star",
              value: 500,
              label: "Projects Completed",
              color: "text-yellow-400",
              suffix: "+",
              order: 1,
            },
            {
              id: "stat2",
              icon: "Award",
              value: 98,
              label: "Client Satisfaction",
              color: "text-green-400",
              suffix: "%",
              order: 2,
            },
            {
              id: "stat3",
              icon: "Users",
              value: 150,
              label: "Happy Clients",
              color: "text-blue-400",
              suffix: "+",
              order: 3,
            },
            {
              id: "stat4",
              icon: "TrendingUp",
              value: 300,
              label: "Average ROI",
              color: "text-purple-400",
              suffix: "%",
              order: 4,
            },
          ];
          
          // Save default stats to Firestore
          for (const stat of defaultStats) {
            await setDoc(doc(db, "stats", stat.id), stat);
          }
          setStats(defaultStats);
          toast.success("Default stats initialized!", { position: "top-center" });
        } else {
          const data: Stat[] = snapshot.docs
            .map((d) => ({ id: d.id, ...d.data() } as Stat))
            .sort((a, b) => a.order - b.order);
          setStats(data);
          toast.success("Stats loaded successfully!", { position: "top-center" });
        }
      } catch (error: unknown) {
        console.error("Error fetching stats:", error);
        
        const isPermissionError = error && typeof error === 'object' && 'code' in error && error.code === 'permission-denied';
        
        if (isPermissionError) {
          toast.error("Firebase permission denied. Please check security rules.", { 
            position: "top-center",
            duration: 5000 
          });
        } else {
          toast.error("Failed to fetch stats from database.", { 
            position: "top-center",
            duration: 4000 
          });
        }
        
        // Fallback to default stats (client-side only)
        setStats([
          {
            id: "stat1",
            icon: "Star",
            value: 500,
            label: "Projects Completed",
            color: "text-yellow-400",
            suffix: "+",
            order: 1,
          },
          {
            id: "stat2",
            icon: "Award",
            value: 98,
            label: "Client Satisfaction",
            color: "text-green-400",
            suffix: "%",
            order: 2,
          },
          {
            id: "stat3",
            icon: "Users",
            value: 150,
            label: "Happy Clients",
            color: "text-blue-400",
            suffix: "+",
            order: 3,
          },
          {
            id: "stat4",
            icon: "TrendingUp",
            value: 300,
            label: "Average ROI",
            color: "text-purple-400",
            suffix: "%",
            order: 4,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const validateStats = (stats: Stat[]): boolean => {
    const isValid = stats.every(stat => 
      stat.value >= 0 && 
      stat.label.trim() !== '' && 
      stat.id && 
      stat.order > 0
    );
    
    if (!isValid) {
      toast.error("Please fix validation errors before saving. Ensure all labels are filled and values are positive.", { 
        position: "top-center",
        duration: 5000
      });
    }
    
    return isValid;
  };

  const handleStatChange = (id: string, field: keyof Stat, value: string | number) => {
    setStats((prevStats) =>
      prevStats.map((stat) =>
        stat.id === id ? { ...stat, [field]: value } : stat
      )
    );
  };

  const handleSaveAll = async () => {
    if (!validateStats(stats)) {
      return;
    }
    
    setSaving(true);
    try {
      const batch = writeBatch(db);
      stats.forEach(stat => {
        const statRef = doc(db, "stats", stat.id);
        batch.set(statRef, stat);
      });
      await batch.commit();
      
      toast.success("All stats saved successfully!", {
        duration: 3000,
        position: "top-center",
        style: {
          background: '#10B981',
          color: 'white',
        },
      });
    } catch (error: unknown) {
      console.error("Error saving stats:", error);
      
      const isPermissionError = error && typeof error === 'object' && 'code' in error && error.code === 'permission-denied';
      
      if (isPermissionError) {
        toast.error("Save failed: Firebase permission denied. Check security rules.", {
          duration: 5000,
          position: "top-center",
          style: {
            background: '#EF4444',
            color: 'white',
          },
        });
      } else {
        toast.error("Failed to save stats to database.", {
          duration: 4000,
          position: "top-center",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const moveStat = (id: string, direction: 'up' | 'down') => {
    setStats(prev => {
      const newStats = [...prev];
      const currentIndex = newStats.findIndex(stat => stat.id === id);
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      if (newIndex >= 0 && newIndex < newStats.length) {
        [newStats[currentIndex], newStats[newIndex]] = 
        [newStats[newIndex], newStats[currentIndex]];
        
        // Update orders
        return newStats.map((stat, index) => ({ ...stat, order: index + 1 }));
      }
      return newStats;
    });
  };

  const addNewStat = () => {
    const newStat: Stat = {
      id: `stat-${Date.now()}`,
      icon: "Star",
      value: 0,
      label: "New Statistic",
      color: "text-purple-400",
      suffix: "+",
      order: stats.length + 1,
    };
    setStats(prev => [...prev, newStat]);
    
    toast.success("New statistic added!", {
      position: "top-center",
      duration: 3000,
    });
  };

  const deleteStat = async (id: string) => {
    if (stats.length <= 1) {
      toast.error("You must have at least one statistic", { 
        position: "top-center",
        duration: 4000 
      });
      return;
    }
    
    if (window.confirm("Are you sure you want to delete this statistic? This action cannot be undone.")) {
      try {
        // Remove from Firestore
        await deleteDoc(doc(db, "stats", id));
        
        // Remove from local state and reorder
        setStats(prev => {
          const filtered = prev.filter(stat => stat.id !== id);
          return filtered.map((stat, index) => ({ ...stat, order: index + 1 }));
        });
        
        toast.success("Statistic deleted successfully", { 
          position: "top-center",
          duration: 3000 
        });
      } catch (error: unknown) {
        console.error("Error deleting stat:", error);
        
        const isPermissionError = error && typeof error === 'object' && 'code' in error && error.code === 'permission-denied';
        
        if (isPermissionError) {
          toast.error("Delete failed: Firebase permission denied.", {
            position: "top-center",
            duration: 5000
          });
        } else {
          // If Firestore delete fails, still remove from local state
          setStats(prev => {
            const filtered = prev.filter(stat => stat.id !== id);
            return filtered.map((stat, index) => ({ ...stat, order: index + 1 }));
          });
          toast.error("Statistic removed locally but couldn't delete from database.", {
            position: "top-center",
            duration: 5000
          });
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1e183a] text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Sidebar />

      <div className="md:ml-64 p-4 sm:p-6 lg:p-8 text-white min-h-screen bg-[#1e183a] transition-all duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
            Statistics Management
          </h1>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={addNewStat}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <Plus size={18} />
              Add Stat
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
            💡 <strong>Tip:</strong> Changes will be reflected on the Services page after saving.
            {stats.some(stat => stat.value === 0) && (
              <span className="block mt-1 text-yellow-200">
                ⚠️ Some values are set to 0. Make sure to set appropriate values.
              </span>
            )}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = iconMap[stat.icon as keyof typeof iconMap] || Star;
            
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
                className="bg-[#2a2250]/80 rounded-2xl p-6 shadow-md hover:shadow-lg transition border border-white/5 relative"
              >
                {/* Order Badge */}
                <div className="top-4 right-4 bg-purple-600/30 text-purple-200 text-sm px-2 py-1 rounded-full border border-purple-500/30">
                  Order: {stat.order}
                </div>

                {/* Preview Card */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-6">
                  <div className="flex items-center justify-center mb-4">
                    <IconComponent className={`w-10 h-10 ${stat.color}`} />
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                      {stat.value}{stat.suffix}
                    </div>
                    <div className="text-sm text-purple-200">{stat.label}</div>
                  </div>
                </div>

                {/* Edit Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Icon</label>
                    <select
                      value={stat.icon}
                      onChange={(e) => handleStatChange(stat.id, "icon", e.target.value)}
                      className="w-full bg-[#1e183a] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 border border-white/20"
                    >
                      {Object.keys(iconMap).map((key) => (
                        <option key={key} value={key}>
                          {key}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Value</label>
                    <input
                      type="number"
                      value={stat.value}
                      onChange={(e) => handleStatChange(stat.id, "value", parseInt(e.target.value) || 0)}
                      className="w-full bg-[#1e183a] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 border border-white/20"
                      placeholder="Enter value"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Label</label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => handleStatChange(stat.id, "label", e.target.value)}
                      className="w-full bg-[#1e183a] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 border border-white/20"
                      placeholder="Enter label"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Suffix</label>
                      <select
                        value={stat.suffix}
                        onChange={(e) => handleStatChange(stat.id, "suffix", e.target.value)}
                        className="w-full bg-[#1e183a] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 border border-white/20"
                      >
                        <option value="+">+</option>
                        <option value="%">%</option>
                        <option value="x">x</option>
                        <option value="k">k</option>
                        <option value="M">M</option>
                        <option value="">None</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Color</label>
                      <select
                        value={stat.color}
                        onChange={(e) => handleStatChange(stat.id, "color", e.target.value)}
                        className="w-full bg-[#1e183a] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 border border-white/20"
                      >
                        {colorOptions.map(color => (
                          <option key={color.value} value={color.value}>
                            {color.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
                    <button
                      onClick={() => moveStat(stat.id, 'up')}
                      disabled={stat.order === 1}
                      className={`flex items-center justify-center gap-1 p-2 rounded-lg transition-colors ${
                        stat.order === 1 
                          ? 'bg-gray-600/30 text-gray-400 cursor-not-allowed' 
                          : 'bg-blue-600/50 hover:bg-blue-600 text-white'
                      }`}
                    >
                      <ChevronUp size={16} />
                      Up
                    </button>
                    
                    <button
                      onClick={() => moveStat(stat.id, 'down')}
                      disabled={stat.order === stats.length}
                      className={`flex items-center justify-center gap-1 p-2 rounded-lg transition-colors ${
                        stat.order === stats.length 
                          ? 'bg-gray-600/30 text-gray-400 cursor-not-allowed' 
                          : 'bg-blue-600/50 hover:bg-blue-600 text-white'
                      }`}
                    >
                      <ChevronDown size={16} />
                      Down
                    </button>
                    
                    <button
                      onClick={() => deleteStat(stat.id)}
                      disabled={stats.length <= 1}
                      className={`flex items-center justify-center gap-1 p-2 rounded-lg transition-colors ${
                        stats.length <= 1 
                          ? 'bg-gray-600/30 text-gray-400 cursor-not-allowed' 
                          : 'bg-red-600/50 hover:bg-red-600 text-white'
                      }`}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {stats.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white/5 rounded-2xl p-8 max-w-md mx-auto">
              <Users className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Statistics</h3>
              <p className="text-purple-200 mb-6">Get started by adding your first statistic.</p>
              <button
                onClick={addNewStat}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 mx-auto transition-all hover:scale-105"
              >
                <Plus size={20} />
                Add Your First Statistic
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}