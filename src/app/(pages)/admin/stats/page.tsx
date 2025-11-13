"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { Save, TrendingUp, Award, Users, Star } from "lucide-react";
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
};

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
      } catch (error: any) {
        console.error("Error fetching stats:", error);
        
        if (error.code === 'permission-denied') {
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

  const handleStatChange = (id: string, field: keyof Stat, value: string | number) => {
    setStats((prevStats) =>
      prevStats.map((stat) =>
        stat.id === id ? { ...stat, [field]: value } : stat
      )
    );
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      for (const stat of stats) {
        await setDoc(doc(db, "stats", stat.id), stat);
      }
      toast.success("All stats saved successfully!", {
        duration: 3000,
        position: "top-center",
        style: {
          background: '#10B981',
          color: 'white',
        },
      });
    } catch (error: any) {
      console.error("Error saving stats:", error);
      
      if (error.code === 'permission-denied') {
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

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base transition-all ${
              saving ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
            }`}
          >
            <Save size={18} />
            {saving ? "Saving..." : "Save All Changes"}
          </button>
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
                className="bg-[#2a2250]/80 rounded-2xl p-6 shadow-md hover:shadow-lg transition"
              >
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
                      <option value="Star">⭐ Star</option>
                      <option value="Award">🏆 Award</option>
                      <option value="Users">👥 Users</option>
                      <option value="TrendingUp">📈 Trending Up</option>
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
                        <option value="text-yellow-400">🟡 Yellow</option>
                        <option value="text-green-400">🟢 Green</option>
                        <option value="text-blue-400">🔵 Blue</option>
                        <option value="text-purple-400">🟣 Purple</option>
                        <option value="text-red-400">🔴 Red</option>
                        <option value="text-pink-400">🩷 Pink</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
}