"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
  Timestamp, // ✅ Import Firestore Timestamp
} from "firebase/firestore";
import { db } from "../config/firebase";
import { motion } from "framer-motion";

// ✅ Define a strongly typed Service interface
interface Service {
  id?: string;
  title?: string;
  description?: string;
  status?: "Active" | "Inactive";
  createdAt?: Timestamp; // ✅ Replaced 'any' with Firestore Timestamp
}

// ✅ Define props for this form
interface ServiceFormProps {
  onClose: () => void;
  onSuccess: (service: Service) => void;
  editService?: Service;
}

export default function ServiceForm({
  onClose,
  editService,
  onSuccess,
}: ServiceFormProps) {
  // ✅ Only editable fields tracked in form state
  const [formData, setFormData] = useState<Omit<Service, "id" | "createdAt">>({
    title: editService?.title || "",
    description: editService?.description || "",
    status: editService?.status || "Active",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editService?.id) {
        // ✅ Updating existing service
        const docRef = doc(db, "services", editService.id);
        await updateDoc(docRef, { ...formData });
        onSuccess({ ...editService, ...formData });
      } else {
        // ✅ Adding new service
        const docRef = await addDoc(collection(db, "services"), {
          ...formData,
          createdAt: serverTimestamp(),
        });
        onSuccess({ id: docRef.id, ...formData });
      }
    } catch (error) {
      console.error("Error saving service:", error);
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
          {editService ? "Edit Service" : "Add New Service"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            placeholder="Service Title"
            value={formData.title}
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

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

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
