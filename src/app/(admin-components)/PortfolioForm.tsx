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
  slug?: string;
  name?: string;
  description?: string;
  overview?: string;
  image?: string;
  creativeApproach?: string;
  challenges?: string;
  clientWords?: string;
  client?: {
    name?: string;
    industry?: string;
    location?: string;
  };
  highlights?: string[]; // Array of strings
  technologies?: string[]; // Array of strings
  metrics?: {
    efficiency?: string;
    satisfaction?: string;
    rating?: string;
  };
  createdAt?: Timestamp;
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
      slug: editPortfolio?.slug || "",
      name: editPortfolio?.name || "",
      description: editPortfolio?.description || "",
      overview: editPortfolio?.overview || "",
      image: editPortfolio?.image || "",
      creativeApproach: editPortfolio?.creativeApproach || "",
      challenges: editPortfolio?.challenges || "",
      clientWords: editPortfolio?.clientWords || "",
      client: {
        name: editPortfolio?.client?.name || "",
        industry: editPortfolio?.client?.industry || "",
        location: editPortfolio?.client?.location || "",
      },
      highlights: editPortfolio?.highlights || [],
      technologies: editPortfolio?.technologies || [],
      metrics: {
        efficiency: editPortfolio?.metrics?.efficiency || "",
        satisfaction: editPortfolio?.metrics?.satisfaction || "",
        rating: editPortfolio?.metrics?.rating || "",
      },
    }
  );

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    setFormData((prev) => {
      if (keys.length === 1) {
        return { ...prev, [name]: value };
      } else if (keys.length === 2) {
        const [parent, child] = keys;
        return {
          ...prev,
          [parent]: {
            ...(prev as Record<string, unknown>)[parent] as Record<string, unknown>,
            [child]: value,
          },
        };
      }
      return prev;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSave = {
        ...formData,
        highlights: formData.highlights?.length ? formData.highlights : undefined,
        technologies: formData.technologies?.length ? formData.technologies : undefined,
      };

      if (editPortfolio && editPortfolio.id) {
        // ✅ Update existing portfolio
        const docRef = doc(db, "portfolios", editPortfolio.id);
        await updateDoc(docRef, dataToSave);
        onSuccess({ ...editPortfolio, ...dataToSave });
      } else {
        // ✅ Add new portfolio
        const docRef = await addDoc(collection(db, "portfolios"), {
          ...dataToSave,
          createdAt: serverTimestamp(),
        });
        onSuccess({ id: docRef.id, ...dataToSave });
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
        className="bg-[#2a2250] rounded-xl p-6 w-[500px] max-h-[80vh] overflow-y-auto shadow-lg text-white"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editPortfolio ? "Edit Portfolio" : "Add New Portfolio"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="slug"
            placeholder="Project Slug"
            value={formData.slug}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
            required
          />

          <input
            name="name"
            placeholder="Project Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none resize-none"
          />

          <textarea
            name="overview"
            placeholder="Overview"
            value={formData.overview}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none resize-none"
          />

          <textarea
            name="creativeApproach"
            placeholder="Creative Approach"
            value={formData.creativeApproach}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none resize-none"
          />

          <textarea
            name="challenges"
            placeholder="Challenges"
            value={formData.challenges}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none resize-none"
          />

          <textarea
            name="clientWords"
            placeholder="Client Words"
            value={formData.clientWords}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none resize-none"
          />

          <input
            name="image"
            placeholder="Image path (e.g. /logo.jpg)"
            value={formData.image}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
            required
          />

          <input
            name="client.name"
            placeholder="Client Name"
            value={formData.client?.name}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
          />

          <input
            name="client.industry"
            placeholder="Client Industry"
            value={formData.client?.industry}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
          />

          <input
            name="client.location"
            placeholder="Client Location"
            value={formData.client?.location}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
          />

          <textarea
            name="highlights"
            placeholder="Highlights (comma-separated)"
            value={formData.highlights?.join(', ')}
            onChange={(e) => {
              const value = e.target.value;
              setFormData((prev) => ({
                ...prev,
                highlights: value ? value.split(',').map(s => s.trim()) : [],
              }));
            }}
            rows={2}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none resize-none"
          />

          <textarea
            name="technologies"
            placeholder="Technologies (comma-separated)"
            value={formData.technologies?.join(', ')}
            onChange={(e) => {
              const value = e.target.value;
              setFormData((prev) => ({
                ...prev,
                technologies: value ? value.split(',').map(s => s.trim()) : [],
              }));
            }}
            rows={2}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none resize-none"
          />

          <input
            name="metrics.efficiency"
            placeholder="Efficiency Metric (e.g. 85%)"
            value={formData.metrics?.efficiency}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
          />

          <input
            name="metrics.satisfaction"
            placeholder="Satisfaction Metric (e.g. 25%)"
            value={formData.metrics?.satisfaction}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
          />

          <input
            name="metrics.rating"
            placeholder="Rating (e.g. 4.7/5)"
            value={formData.metrics?.rating}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
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
