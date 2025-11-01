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
import dynamic from "next/dynamic";

// Dynamically import the markdown editor to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface Blog {
  id?: string;
  slug?: string;
  tag?: string;
  image?: string;
  title?: string;
  description?: string;
  date?: string;
  readTime?: string;
  featured?: boolean;
  content?: {
    introduction?: string;
    sections?: { heading: string; content: string }[];
    quote?: { text: string; author: string };
    conclusion?: string;
  };
  author?: {
    name?: string;
    role?: string;
    avatar?: string;
    updatedAt?: string;
  };
  status?: "published" | "draft";
  createdAt?: Timestamp;
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
    slug: editBlog?.slug || "",
    tag: editBlog?.tag || "",
    image: editBlog?.image || "",
    description: editBlog?.description || "",
    date: editBlog?.date || new Date().toISOString().split("T")[0],
    readTime: editBlog?.readTime || "",
    featured: editBlog?.featured || false,
    content: editBlog?.content || { introduction: "", sections: [], quote: { text: "", author: "" }, conclusion: "" },
    author: editBlog?.author || { name: "", role: "", avatar: "", updatedAt: "" },
    status: editBlog?.status || "draft",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNestedChange = (field: keyof Blog, subField: string, value: string) => {
    setFormData((prev) => {
      const keys = subField.split('.');
      const updateNested = (obj: any, keys: string[], val: string): any => {
        if (keys.length === 1) {
          return { ...obj, [keys[0]]: val };
        }
        const [first, ...rest] = keys;
        return { ...obj, [first]: updateNested(obj[first] || {}, rest, val) };
      };
      return { ...prev, [field]: updateNested(prev[field] as any, keys, value) };
    });
  };

  const handleContentChange = (subField: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [subField]: value,
      },
    }));
  };

  const handleAuthorChange = (subField: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      author: {
        ...prev.author,
        [subField]: value,
      },
    }));
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

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
          <input
            name="title"
            placeholder="Blog Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
            required
          />
          <input
            name="slug"
            placeholder="Slug (e.g. mastering-digital-transformation)"
            value={formData.slug}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
            required
          />
          <input
            name="tag"
            placeholder="Tag (e.g. Featured Post)"
            value={formData.tag}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
          />
          <input
            name="image"
            placeholder="Image path (e.g. /logo.jpg)"
            value={formData.image}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
            required
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
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
          />
          <input
            name="readTime"
            placeholder="Read Time (e.g. 7 min read)"
            value={formData.readTime}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="rounded bg-[#3b2e65] text-white"
            />
            Featured Post
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          {/* Content Fields */}
          <h3 className="text-lg font-semibold">Content</h3>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Introduction (Markdown)</label>
            <MDEditor
              value={formData.content?.introduction || ""}
              onChange={(value) => handleContentChange("introduction", value || "")}
              preview="edit"
              hideToolbar={false}
              className="bg-[#3b2e65] rounded"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Quote Text (Markdown)</label>
            <MDEditor
              value={formData.content?.quote?.text || ""}
              onChange={(value) => handleNestedChange("content", "quote.text", value || "")}
              preview="edit"
              hideToolbar={false}
              className="bg-[#3b2e65] rounded"
            />
          </div>
          <input
            placeholder="Quote Author"
            value={formData.content?.quote?.author || ""}
            onChange={(e) => handleNestedChange("content", "quote.author", e.target.value)}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium">Conclusion (Markdown)</label>
            <MDEditor
              value={formData.content?.conclusion || ""}
              onChange={(value) => handleContentChange("conclusion", value || "")}
              preview="edit"
              hideToolbar={false}
              className="bg-[#3b2e65] rounded"
            />
          </div>

          {/* Author Fields */}
          <h3 className="text-lg font-semibold">Author</h3>
          <input
            placeholder="Author Name"
            value={formData.author?.name || ""}
            onChange={(e) => handleAuthorChange("name", e.target.value)}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
            required
          />
          <input
            placeholder="Author Role"
            value={formData.author?.role || ""}
            onChange={(e) => handleAuthorChange("role", e.target.value)}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
          />
          <input
            placeholder="Author Avatar (e.g. /logo.jpg)"
            value={formData.author?.avatar || ""}
            onChange={(e) => handleAuthorChange("avatar", e.target.value)}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
          />
          <input
            placeholder="Updated At (e.g. June 12, 2024 at 3:45 pm)"
            value={formData.author?.updatedAt || new Date().toLocaleString()}
            onChange={(e) => handleAuthorChange("updatedAt", e.target.value)}
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
