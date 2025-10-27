"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
  Timestamp, // ✅ Import this
} from "firebase/firestore";
import { db } from "../config/firebase";
import { motion } from "framer-motion";

// ✅ Strongly typed Portfolio interface
interface Portfolio {
  id?: string;
  title?: string;
  category?: string;
  description?: string;
  imageUrl?: string;
  createdAt?: Timestamp; // ✅ Replace 'any' with 'Timestamp'
}

interface PortfolioFormProps {
  onClose: () => void;
  onSuccess: (portfolio: Portfolio) => void;
  editPortfolio?: Portfolio;
}

export default function PortfolioForm({
  onClose,
  editPortfolio,
  onSuccess,
}: PortfolioFormProps) {
  const [formData, setFormData] = useState<Omit<Portfolio, "id" | "createdAt">>(
    {
      title: editPortfolio?.title || "",
      category: editPortfolio?.category || "",
      description: editPortfolio?.description || "",
      imageUrl: editPortfolio?.imageUrl || "",
    }
  );

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editPortfolio && editPortfolio.id) {
        // ✅ Update existing portfolio
        const docRef = doc(db, "portfolios", editPortfolio.id);
        await updateDoc(docRef, { ...formData });
        onSuccess({ ...editPortfolio, ...formData });
      } else {
        // ✅ Add new portfolio
        const docRef = await addDoc(collection(db, "portfolios"), {
          ...formData,
          createdAt: serverTimestamp(),
        });
        onSuccess({ id: docRef.id, ...formData });
      }
    } catch (error) {
      console.error("Error saving portfolio:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#2a2250] rounded-xl p-6 w-[400px] shadow-lg text-white"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editPortfolio ? "Edit Portfolio" : "Add New Portfolio"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            placeholder="Project Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
            required
          />

          <input
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
          />

          <textarea
            name="description"
            placeholder="Short Description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none resize-none"
          />

          <input
            name="imageUrl"
            placeholder="Image path (e.g. /portfolio-images/project1.jpg)"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
            required
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded bg-gray-600 hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
