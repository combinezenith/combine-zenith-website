"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  DocumentData,
} from "firebase/firestore";
import { db } from "../../../config/firebase";
import { Plus, Edit, Trash2 } from "lucide-react";
import PortfolioForm from "../../../(admin-components)/PortfolioForm";
import { motion } from "framer-motion";
import Sidebar from "@/app/(admin-components)/Sidebar";
import toast from "react-hot-toast";
import Image from "next/image";

// ✅ Define a proper interface for portfolios
interface Portfolio {
  id?: string;
  title?: string;
  category?: string;
  description?: string;
  imageUrl?: string;
}

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editPortfolio, setEditPortfolio] = useState<Portfolio | undefined>(
    undefined
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ✅ Fetch portfolios
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const snapshot = await getDocs(collection(db, "portfolios"));
        const data = snapshot.docs.map(
          (d) => ({ id: d.id, ...(d.data() as DocumentData) } as Portfolio)
        );
        setPortfolios(data);
      } catch {
        toast.error("Failed to fetch portfolios.");
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolios();
  }, []);

  // ✅ Delete portfolio with confirmation
  const handleDelete = async (id: string) => {
    const portfolioToDelete = portfolios.find((p) => p.id === id);
    if (!portfolioToDelete) return;

    toast(
      (t) => (
        <div className="text-white">
          <p>
            Delete <b>{portfolioToDelete.title}</b>?
          </p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  setDeletingId(id);
                  await deleteDoc(doc(db, "portfolios", id));
                  setPortfolios((prev) => prev.filter((p) => p.id !== id));
                  toast.success("Portfolio deleted successfully!", {
                    duration: 2500,
                    position: "top-center",
                  });
                } catch {
                  toast.error("Failed to delete portfolio.", {
                    duration: 2500,
                    position: "top-center",
                  });
                } finally {
                  setDeletingId(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
            >
              Yes
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
        position: "top-center",
        style: { background: "#2a2250" },
      }
    );
  };

  const handleEdit = (portfolio: Portfolio) => {
    setEditPortfolio(portfolio);
    setShowForm(true);
  };

  if (loading)
    return <p className="text-center py-10 text-gray-300">Loading...</p>;

  return (
    <>
      <Sidebar />

      <div className="md:ml-64 p-4 sm:p-6 lg:p-8 text-white min-h-screen bg-[#1e183a] transition-all duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
            Portfolio Management
          </h1>

          <button
            onClick={() => {
              setEditPortfolio(undefined);
              setShowForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base transition-all"
          >
            <Plus size={18} /> Add New
          </button>
        </div>

        {/* Portfolio Grid */}
        {portfolios.length > 0 ? (
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
              gap-6
              place-items-stretch
            "
          >
            {portfolios.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="
                  bg-[#2a2250]/80 
                  rounded-2xl 
                  p-4 
                  shadow-md 
                  hover:shadow-lg 
                  hover:bg-[#3b2e65]/70 
                  transition 
                  flex 
                  flex-col
                "
              >
                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt={item.title || "Portfolio image"}
                    width={400}
                    height={300}
                    className="w-full h-44 sm:h-48 md:h-52 object-cover rounded-lg mb-4"
                  />
                )}

                <h3 className="text-lg sm:text-xl font-semibold mb-1 wrap-break-words">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-400 mb-2">
                  {item.category || "No category"}
                </p>

                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {item.description}
                </p>

                <div className="flex justify-between items-center mt-auto">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    onClick={() => item.id && handleDelete(item.id)}
                    disabled={deletingId === item.id || !item.id}
                    className={`flex items-center gap-1 text-red-400 hover:text-red-300 text-sm ${
                      deletingId === item.id
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <Trash2 size={16} />
                    {deletingId === item.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-10">
            No portfolio items found.
          </p>
        )}

        {/* Portfolio Form Modal */}
        {showForm && (
          <PortfolioForm
            onClose={() => setShowForm(false)}
            editPortfolio={editPortfolio}
            onSuccess={(newItem: Portfolio) => {
              if (editPortfolio) {
                setPortfolios(
                  portfolios.map((p) => (p.id === newItem.id ? newItem : p))
                );
                toast.success("Portfolio updated successfully!", {
                  duration: 2500,
                  position: "top-center",
                });
              } else {
                setPortfolios([...portfolios, newItem]);
                toast.success("New portfolio added!", {
                  duration: 2500,
                  position: "top-center",
                });
              }

              setShowForm(false);
            }}
          />
        )}
      </div>
    </>
  );
}
