"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { event } from "../../../lib/ga";
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
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

interface Metric {
  title: string;
  value: string | number;
  change: string;
  trend: "up" | "down";
  icon: React.ElementType;
  subtitle?: string;
}

interface GADataPoint {
  date: string;
  activeUsers: number;
  newUsers: number;
  [key: string]: string | number | undefined; // optional for any future metrics
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedRange, setSelectedRange] = useState("7 Days");
  const [gaData, setGaData] = useState<GADataPoint[]>([]);
  const [loadingGA, setLoadingGA] = useState(true);

  console.log(session);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
  }, [status, router]);

  useEffect(() => {
    const fetchGA = async () => {
      try {
        const res = await fetch("/api/analytics");
        const json = await res.json();
        if (json.success) {
          setGaData(json.data);
        }
      } catch (err) {
        console.error("Failed to load GA data:", err);
      } finally {
        setLoadingGA(false);
      }
    };
    fetchGA();
  }, []);

  if (status === "loading") return <p className="text-white">Loading...</p>;

  const handleLogout = async () => {
    event({
      action: "logout",
      category: "User",
      label: "Admin Logout",
    });
    await signOut({ callbackUrl: "/admin/login" });
  };

  // --- Metrics Cards (partly real GA data) ---
  const totalVisitors =
    gaData.reduce((sum, d) => sum + (d.activeUsers || 0), 0) || 0;
  const newUsers = gaData.reduce((sum, d) => sum + (d.newUsers || 0), 0) || 0;

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
      title: "New vs Returning Users",
      value: "70%",
      subtitle: "New",
      change: "-2.3%",
      trend: "down",
      icon: Zap,
    },
    {
      title: "Average Session Duration",
      value: "03:45",
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

  // Dummy charts remain until we expand GA integration
  const trafficData = [
    { name: "Organic", value: 400 },
    { name: "Social", value: 300 },
    { name: "Referral", value: 200 },
    { name: "Email", value: 100 },
  ];
  const topPages = [
    { name: "/dashboard", views: 1200 },
    { name: "/blog/post-1", views: 900 },
    { name: "/blog/post-2", views: 700 },
    { name: "/contact", views: 400 },
  ];
  const userGeo = [
    { region: "Asia", users: 950 },
    { region: "Europe", users: 650 },
    { region: "America", users: 500 },
    { region: "Africa", users: 300 },
  ];
  const deviceSplit = [
    { name: "Desktop", value: 600 },
    { name: "Mobile", value: 300 },
    { name: "Tablet", value: 150 },
  ];
  const conversionData = [
    { stage: "Visitors", value: 1000 },
    { stage: "Leads", value: 600 },
    { stage: "Qualified Leads", value: 350 },
    { stage: "Sales", value: 180 },
  ];

  return (
    <>
      <Sidebar />
      <div className="md:ml-64 p-6 sm:p-8 bg-[#1c1833] min-h-screen text-white font-montserrat">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Website Analytics Dashboard</h1>
            <p className="text-gray-400 text-sm">
              Integrated with Google Analytics (GA4) — real-time insights.
            </p>
          </div>

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

        {/* Metric Cards */}
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

              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  metric.trend === "up" ? "text-green-400" : "text-red-400"
                }`}
              >
                <span>{metric.change}</span>
                <span>{metric.trend === "up" ? "▲" : "▼"}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Users Over Time (REAL GA DATA) */}
          <ChartCard title="Active Users Over Time (GA4)">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={gaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3b2e65" />
                <XAxis dataKey="date" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="activeUsers"
                  stroke="#8ECAE6"
                  name="Active Users"
                />
                <Line
                  type="monotone"
                  dataKey="newUsers"
                  stroke="#FB8500"
                  name="New Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Traffic Source Breakdown */}
          <ChartCard title="Traffic Source Breakdown">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={trafficData}
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {trafficData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Top Pages by Views */}
          <ChartCard title="Top Pages by Views">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topPages}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3b2e65" />
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Bar dataKey="views" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* User Geography */}
          <ChartCard title="User Geography">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={userGeo}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3b2e65" />
                <XAxis dataKey="region" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Bar dataKey="users" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Device Category Split */}
          <ChartCard title="Device Category Split">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={deviceSplit}
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  startAngle={180}
                  endAngle={0}
                >
                  {deviceSplit.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Conversion Funnel */}
          <ChartCard title="Conversion Funnel">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                layout="vertical"
                data={conversionData}
                margin={{ left: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#3b2e65" />
                <XAxis type="number" stroke="#ccc" />
                <YAxis dataKey="stage" type="category" stroke="#ccc" />
                <Tooltip />
                <Bar dataKey="value" fill="#FBBF24" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </>
  );
}

// Chart container component
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
