"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../../config/firebase";
import { Edit, Trash2, Plus, Search } from "lucide-react";
import UserForm from "../../../(admin-components)/UserForm";
import { motion } from "framer-motion";
import Sidebar from "@/app/(admin-components)/Sidebar";
import toast from "react-hot-toast";
import SkeletonLoader from "../../../(components)/SkeletonLoader";

// ✅ Define a proper type for User
export interface User {
  id?: string;
  name?: string;
  email?: string;
  role?: "Admin" | "Editor" | "Viewer";
  status?: "Active" | "Inactive" | "Pending";
  lastLogin?: string;
  createdAt?: Timestamp;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState<User | undefined>(undefined);

  // Search, Filter & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  const { data: session, status } = useSession();
  const router = useRouter();

  console.log(session);

  // ✅ Route protection: redirect unauthenticated users
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  // ✅ Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData: User[] = querySnapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<User, "id">),
        }));
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // ✅ Filter & search
  const filteredUsers = useMemo(() => {
    return users
      .filter((user) => {
        const matchesSearch =
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === "All" || user.role === filterRole;
        const matchesStatus =
          filterStatus === "All" || user.status === filterStatus;
        return matchesSearch && matchesRole && matchesStatus;
      })
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }, [users, searchTerm, filterRole, filterStatus]);

  // ✅ Delete user
  const handleDelete = async (id: string) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2 text-sm text-white">
          <span>Are you sure you want to delete this user?</span>
          <div className="flex gap-3 justify-end">
            <button
              onClick={async () => {
                await deleteDoc(doc(db, "users", id));
                setUsers((prev) => prev.filter((u) => u.id !== id));
                toast.dismiss(t.id);
                toast.success("User deleted successfully!");
              }}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white"
            >
              Yes
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
        style: {
          background: "#2a2250",
          color: "#fff",
          borderRadius: "10px",
          padding: "12px 16px",
        },
      }
    );
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
    setShowForm(true);
  };

  // ✅ Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );
  const handlePageChange = (page: number) => setCurrentPage(page);

  // ✅ Conditional rendering only AFTER hooks
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#392C6A] text-white">
        Checking authentication...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (loading)
    return (
      <>
        <Sidebar />
        <div className="md:ml-64 p-4 sm:p-6 lg:p-8 text-white bg-[#1c1833] min-h-screen transition-all duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonLoader count={6} className="h-64" />
          </div>
        </div>
      </>
    );

  // ✅ Main UI
  return (
    <>
      <Sidebar />
      <div className="md:ml-64 p-4 sm:p-6 lg:p-8 text-white bg-[#1c1833] min-h-screen transition-all duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-center sm:text-left">
            User Management
          </h1>

          <button
            onClick={() => {
              setEditUser(undefined);
              setShowForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={18} /> Add User
          </button>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
          <div className="relative w-full md:w-1/3">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#2a2250]/70 pl-10 pr-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-[#2a2250]/70 px-3 py-2 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Editor">Editor</option>
              <option value="Viewer">Viewer</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#2a2250]/70 px-3 py-2 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        {/* User Cards */}
        {paginatedUsers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedUsers.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-[#2a2250]/80 rounded-2xl shadow-lg p-5 hover:bg-[#3b2e65]/70 transition"
              >
                <h2 className="text-xl font-semibold mb-1">{user.name}</h2>
                <p className="text-gray-400 text-sm mb-2">{user.email}</p>

                <div className="flex justify-between items-center mb-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.role === "Admin"
                        ? "bg-blue-600"
                        : user.role === "Editor"
                        ? "bg-gray-700"
                        : "bg-green-700"
                    }`}
                  >
                    {user.role}
                  </span>

                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.status === "Active"
                        ? "bg-blue-500"
                        : user.status === "Inactive"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {user.status}
                  </span>
                </div>

                <p className="text-sm text-gray-400">
                  Last Login: {user.lastLogin || "—"}
                </p>

                <div className="flex justify-end gap-3 mt-4">
                  <button onClick={() => handleEdit(user)}>
                    <Edit
                      size={18}
                      className="text-blue-400 hover:text-blue-300"
                    />
                  </button>
                  <button onClick={() => user.id && handleDelete(user.id)}>
                    <Trash2
                      size={18}
                      className="text-red-400 hover:text-red-300"
                    />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-10">No users found.</p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-[#2a2250]/70 text-gray-300 hover:bg-[#3b2e65]"
                } transition`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <UserForm
            onClose={() => setShowForm(false)}
            editUser={editUser}
            onSuccess={(newUser) => {
              setUsers((prev) =>
                editUser
                  ? prev.map((u) => (u.id === newUser.id ? newUser : u))
                  : [...prev, newUser]
              );
              setShowForm(false);
            }}
          />
        )}
      </div>
    </>
  );
}
