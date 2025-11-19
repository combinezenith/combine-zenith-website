"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/app/(admin-components)/Sidebar";
import {
  Users,
  Activity,
  Zap,
  Clock,
  Handshake,
  DollarSign,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

interface Metric {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down";
  icon: React.ElementType;
  subtitle?: string;
}

interface GADataPoint {
  date: string;
  totalUsers: number;
  newUsers: number;
  sessions: number;
  pageViews: number;
  engagedSessions: number;
  bounceRate: string;
  avgSessionDuration: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [selectedRange, setSelectedRange] = useState("7 Days");
  const [gaData, setGaData] = useState<GADataPoint[]>([]);
  const [realtimeActiveUsers, setRealtimeActiveUsers] = useState(0);
  const [loadingGA, setLoadingGA] = useState(true);

  // ✅ Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
  }, [status, router]);

  // Fetch GA data
  useEffect(() => {
    const fetchGA = async () => {
      try {
        const res = await fetch("/api/analytics");
        const json = await res.json();
        if (json.success) {
          setGaData(json.historicalData || []);
          setRealtimeActiveUsers(json.realtimeActiveUsers || 0);
        }
      } catch (err) {
        console.error("Failed to load GA data:", err);
      } finally {
        setLoadingGA(false);
      }
    };
    fetchGA();
  }, []);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/admin/login" });
  };

  // --- Metrics ---
  const totalVisitors = gaData.reduce((sum, d) => sum + d.totalUsers, 0);
  const newUsers = gaData.reduce((sum, d) => sum + d.newUsers, 0);

  const metrics: Metric[] = [
    {
      title: "Total Visitors (7 Days)",
      value: loadingGA ? "Loading..." : totalVisitors.toLocaleString(),
      change: "+12.5%",
      trend: "up",
      icon: Users,
    },
    {
      title: "New Users",
      value: loadingGA ? "Loading..." : newUsers.toLocaleString(),
      change: "+5.1%",
      trend: "up",
      icon: Activity,
    },
    {
      title: "Real-Time Active Users",
      value: loadingGA ? "Loading..." : realtimeActiveUsers,
      icon: Zap,
    },
    {
      title: "Average Session Duration",
      value: gaData.length ? gaData[gaData.length - 1].avgSessionDuration : "0",
      change: "+8.9%",
      trend: "up",
      icon: Clock,
    },
    {
      title: "Engagement Rate",
      value: "68.2%",
      change: "+4.7%",
      trend: "up",
      icon: Handshake,
    },
    {
      title: "Conversions",
      value: "124",
      change: "-1.8%",
      trend: "down",
      icon: DollarSign,
    },
  ];

  const COLORS = ["#FFB703", "#8ECAE6", "#219EBC", "#FB8500"];

  return (
    <>
      <Sidebar />
      <div className="md:ml-64 p-6 sm:p-8 min-h-screen text-white font-montserrat">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">Website Analytics Dashboard</h1>
          <div className="flex items-center gap-3">
            <div className="flex bg-[#2a2250] rounded-lg overflow-hidden border border-[#3b2e65]">
              {["Today", "7 Days", "30 Days"].map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedRange(range)}
                  className={`px-4 py-2 text-sm font-medium transition ${
                    selectedRange === range
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-[#3b2e65]"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 hover:from-purple-500 hover:to-indigo-600 transition-all duration-300 shadow-lg font-semibold text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#2a2250]/80 p-6 rounded-2xl shadow-lg hover:bg-[#3b2e65]/70 transition"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-400">{metric.title}</p>
                  <h2 className="text-3xl font-bold mt-1">{metric.value}</h2>
                  {metric.subtitle && (
                    <p className="text-sm font-medium">{metric.subtitle}</p>
                  )}
                </div>
                <metric.icon className="text-gray-300 w-8 h-8" />
              </div>
              {metric.trend && (
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    metric.trend === "up" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  <span>{metric.change}</span>
                  <span>{metric.trend === "up" ? "▲" : "▼"}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Line Chart: 7-day Active Users */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <ChartCard title="Active Users Over Last 7 Days">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={gaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3b2e65" />
                <XAxis dataKey="date" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Line type="monotone" dataKey="totalUsers" stroke="#8ECAE6" />
                <Line type="monotone" dataKey="newUsers" stroke="#FB8500" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Traffic Source Breakdown (Dummy)">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Organic", value: 400 },
                    { name: "Social", value: 300 },
                    { name: "Referral", value: 200 },
                    { name: "Email", value: 100 },
                  ]}
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {Array(4)
                    .fill(null)
                    .map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </>
  );
}

// Chart wrapper
function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#2a2250]/80 p-6 rounded-2xl shadow-lg hover:bg-[#3b2e65]/70 transition">
      <p className="text-sm text-gray-400 mb-3">{title}</p>
      {children}
    </div>
  );
}
