"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Package,
  FileText,
  Contact,
  DollarSign,
  BarChart2,
} from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Team Management", href: "/admin/team", icon: Users },
    { name: "User Management", href: "/admin/user", icon: Users },
    { name: "Portfolio", href: "/admin/portfolio", icon: FolderKanban },
    { name: "Services", href: "/admin/services", icon: Package },
    { name: "Stats", href: "/admin/stats", icon: BarChart2 },
    { name: "Blog Management", href: "/admin/blog", icon: FileText },
    { name: "Contact Messages", href: "/admin/contact", icon: Contact },
    { name: "Pricing", href: "/admin/pricing", icon: DollarSign },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/10 text-white backdrop-blur-sm"
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 md:w-60 
        bg-linear-to-b from-[#200053] to-[#000000]
        text-white font-(--font-montserrat)
        transform transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="p-6 border-b border-white/20">
          <h2 className="text-xl font-surgena font-semibold tracking-wide bg-linear-to-r from-purple-300 to-violet-500 bg-clip-text text-transparent">
            Admin Panel
          </h2>
        </div>

        <nav className="mt-6 flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-6 py-3 rounded-r-full transition-all duration-300 
                ${
                  isActive
                    ? "bg-white text-black shadow-md"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}