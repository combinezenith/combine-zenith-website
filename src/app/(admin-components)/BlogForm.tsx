"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
  Timestamp, // ✅ Import this for proper typing
} from "firebase/firestore";
import { db } from "../config/firebase";
import { motion } from "framer-motion";

interface Blog {
  id?: string;
  title?: string;
  author?: string;
  status?: "published" | "draft";
  date?: string;
  imageUrl?: string;
  description?: string;
  createdAt?: Timestamp; // ✅ Fixed type
}

interface BlogFormProps {
  onClose: () => void;
  onSuccess: (blog: Blog) => void;
  editBlog?: Blog;
}

export default function BlogForm({
  onClose,
  editBlog,
  onSuccess,
}: BlogFormProps) {
  const [formData, setFormData] = useState<Partial<Blog>>({
    title: editBlog?.title || "",
    author: editBlog?.author || "",
    status: editBlog?.status || "draft",
    date: editBlog?.date || new Date().toISOString().split("T")[0],
    imageUrl: editBlog?.imageUrl || "",
    description: editBlog?.description || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editBlog && editBlog.id) {
        // ✅ Update existing blog
        const docRef = doc(db, "blogs", editBlog.id);
        await updateDoc(docRef, { ...formData });
        onSuccess({ ...editBlog, ...formData });
      } else {
        // ✅ Add new blog
        const docRef = await addDoc(collection(db, "blogs"), {
          ...formData,
          createdAt: serverTimestamp(),
        });
        onSuccess({ id: docRef.id, ...formData });
      }
    } catch (error) {
      console.error("Error saving blog:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#2a2250] rounded-xl p-6 w-[450px] shadow-lg text-white"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editBlog ? "Edit Blog" : "Add New Blog"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            placeholder="Blog Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
            required
          />
          <input
            name="author"
            placeholder="Author Name"
            value={formData.author}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

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
            placeholder="Image path (e.g. /blog-images/post1.jpg)"
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
