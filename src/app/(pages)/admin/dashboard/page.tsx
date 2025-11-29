// 🔥 REWRITTEN NEXT.JS ANALYTICS DASHBOARD UI (REAL DATA, NO DUMMY JSON)
// This file fully replaces your previous dashboard.tsx

"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/app/(admin-components)/Sidebar";
import {
  Users,
  Activity,
  Zap,
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

type GADataPoint = {
  date: string;
  totalUsers: number;
  newUsers: number;
  sessions: number;
  pageViews: number;
  engagedSessions: number;
};

type TrafficSource = {
  name: string;
  value: number;
};

type TopPage = {
  path: string;
  views: number;
};

type GeoData = {
  country: string;
  users: number;
};

type DeviceData = {
  device: string;
  users: number;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [range, setRange] = useState("7days");
  const [ga, setGa] = useState<GADataPoint[]>([]);
  const [active, setActive] = useState(0);
  const [sources, setSources] = useState<TrafficSource[]>([]);
  const [pages, setPages] = useState<TopPage[]>([]);
  const [geo, setGeo] = useState<GeoData[]>([]);
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [loading, setLoading] = useState(true);

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (status === "unauthenticated" || session?.user.role !== "admin") {
      router.replace("/admin/login");
    }
  }, [status, session, router]);

  // Fetch full dataset
  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/analytics?range=${range}`);
      const json = await res.json();
      if (json.success) {
        setGa(json.historicalData || []);
        setActive(Number(json.realtimeActiveUsers || 0));
        setSources(json.trafficSources || []);
        setPages(json.topPages || []);
        setGeo(json.geo || []);
        setDevices(json.devices || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [range, fetchAll]);

  // Poll realtime
  useEffect(() => {
    const poll = async () => {
      const res = await fetch(`/api/analytics?range=${range}`);
      const j = await res.json();
      if (j.success) setActive(j.realtimeActiveUsers || 0);
    };

    poll();
    intervalRef.current = window.setInterval(poll, 15000) as unknown as number;
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [range]);

  // Metrics
  const totalUsers = ga.reduce((a, b) => a + (b.totalUsers || 0), 0);
  const newUsers = ga.reduce((a, b) => a + (b.newUsers || 0), 0);

  const metrics = [
    {
      title: "Total Visitors",
      value: loading ? "..." : totalUsers.toLocaleString(),
      icon: Users,
    },
    {
      title: "New Users",
      value: loading ? "..." : newUsers.toLocaleString(),
      icon: Activity,
    },
    {
      title: "Real-Time Active Users",
      value: loading ? "..." : active,
      icon: Zap,
    },
  ];

  const COLORS = [
    "#FFB703",
    "#8ECAE6",
    "#219EBC",
    "#FB8500",
    "#F72585",
    "#7209B7",
  ];

  return (
    <>
      <Sidebar />

      <div className="md:ml-64 p-6 min-h-screen text-white font-montserrat">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <div className="flex gap-3">
            {[
              { label: "Today", value: "today" },
              { label: "7 Days", value: "7days" },
              { label: "30 Days", value: "30days" },
            ].map((r) => (
              <button
                key={r.value}
                onClick={() => setRange(r.value)}
                className={`px-4 py-2 rounded-lg text-sm transition ${
                  range === r.value ? "bg-blue-600" : "bg-[#2a2250]"
                }`}
              >
                {r.label}
              </button>
            ))}

            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {metrics.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#2a2250]/80 p-6 rounded-2xl shadow-lg"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-400 text-sm">{m.title}</p>
                  <h2 className="text-3xl font-bold mt-1">{m.value}</h2>
                </div>
                <m.icon className="w-8 h-8 text-gray-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <Card title="Users Over Time">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={ga}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3b2e65" />
                <XAxis dataKey="date" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Line type="monotone" dataKey="totalUsers" stroke="#8ECAE6" />
                <Line type="monotone" dataKey="newUsers" stroke="#FB8500" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Traffic Sources">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={sources}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                >
                  {sources.map((s, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Top Pages">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={pages}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3b2e65" />
                <XAxis dataKey="path" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Bar dataKey="views" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card title="User Geography">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={geo}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3b2e65" />
                <XAxis dataKey="country" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Bar dataKey="users" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Device Category">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={devices}
                  dataKey="users"
                  nameKey="device"
                  innerRadius={50}
                  outerRadius={80}
                >
                  {devices.map((d, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#2a2250]/80 p-6 rounded-2xl shadow-lg">
      <p className="text-sm text-gray-400 mb-3">{title}</p>
      {children}
    </div>
  );
}
