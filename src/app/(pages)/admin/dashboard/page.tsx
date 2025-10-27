"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { event } from "../../../lib/ga"; // Optional GA event logging
import Sidebar from "@/app/(admin-components)/Sidebar";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  console.log(session);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  if (status === "loading") return <p>Loading...</p>;

  const handleLogout = async () => {
    // Track logout event
    event({
      action: "logout",
      category: "User",
      label: "Admin Logout",
    });

    await signOut({ callbackUrl: "/admin/login" });
  };

  return (
    <>
      <Sidebar />
      <div className="p-10 flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-[#1a0033] to-[#4b0082] text-white font-montserrat">
        <h1 className="text-4xl font-bold mb-8 tracking-wide">
          Welcome, Admin!
        </h1>

        <button
          onClick={handleLogout}
          className="px-6 py-3 rounded-2xl bg-linear-to-r from-indigo-500 to-purple-600 hover:from-purple-500 hover:to-indigo-600 transition-all duration-300 shadow-lg font-semibold text-lg"
        >
          Logout
        </button>
      </div>
    </>
  );
}
