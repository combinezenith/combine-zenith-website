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
import BlogForm from "../../../(admin-components)/BlogForm";
import { motion } from "framer-motion";
import { Trash2, Edit, Eye, Plus } from "lucide-react";
import Sidebar from "@/app/(admin-components)/Sidebar";
import toast from "react-hot-toast";
import Image from "next/image";

// ✅ Define a proper TypeScript interface for blogs
interface Blog {
  id?: string;
  title?: string;
  description?: string;
  author?: {
    name?: string;
    role?: string;
    avatar?: string;
    updatedAt?: string;
  };
  date?: string;
  image?: string;
  status?: "draft" | "published";
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editBlog, setEditBlog] = useState<Blog | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "blogs"));
        setBlogs(
          querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as DocumentData),
          })) as Blog[]
        );
      } catch {
        toast.error("Failed to fetch blogs.", { position: "top-center" });
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // ✅ Delete with confirmation + toast
  const handleDelete = async (id: string) => {
    const blogToDelete = blogs.find((b) => b.id === id);
    if (!blogToDelete) return;

    const confirmToastId = toast.custom(
      () => (
        <div className="text-white p-3">
          <p>
            Delete <b>{blogToDelete.title}</b>?
          </p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={async () => {
                toast.dismiss(confirmToastId);
                try {
                  setDeletingId(id);
                  await deleteDoc(doc(db, "blogs", id));
                  setBlogs((prev) => prev.filter((b) => b.id !== id));
                  toast.success("Blog deleted successfully!", {
                    duration: 2500,
                    position: "top-center",
                  });
                } catch {
                  toast.error("Failed to delete blog.", {
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
              onClick={() => toast.dismiss(confirmToastId)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: 10000,
        position: "top-center",
        style: { background: "#2a2250", borderRadius: "8px" },
      }
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-300">
        Loading blogs...
      </div>
    );
  }

  return (
    <>
      <Sidebar />

      <div className="md:ml-64 p-4 sm:p-6 lg:p-8 text-white min-h-screen bg-[#1a1333] transition-all duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
            Blog Management
          </h1>
          <button
            onClick={() => {
              setEditBlog(undefined);
              setShowForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base transition-all"
          >
            <Plus size={18} /> Add New Blog
          </button>
        </div>

        {/* Blog Grid */}
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-[#2a2250]/80 rounded-2xl p-5 shadow-md hover:shadow-lg hover:bg-[#3b2e65]/70 transition flex flex-col justify-between"
              >
                <div>
                  <Image
                    src={blog.image || "/placeholder.jpg"}
                    alt={blog.title || "Blog image"}
                    width={400}
                    height={250}
                    className="w-full h-40 sm:h-48 object-cover rounded-xl mb-3"
                  />
                  <h2 className="text-lg sm:text-xl font-semibold mb-1 wrap-break-words">
                    {blog.title}
                  </h2>
                  <p className="text-gray-400 text-sm mb-2">
                    By {blog.author?.name || "Unknown"} on {blog.date || "No date"}
                  </p>
                  <p className="text-gray-300 text-sm line-clamp-3 mb-3">
                    {blog.description || "No description available."}
                  </p>
                  <span
                    className={`inline-block px-3 py-1 text-xs rounded-full ${
                      blog.status === "published"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {blog.status || "draft"}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-4 border-t border-gray-600 pt-3 text-sm">
                  <button className="flex items-center gap-1 text-gray-300 hover:text-blue-400">
                    <Eye size={16} /> View
                  </button>
                  <button
                    onClick={() => {
                      setEditBlog(blog);
                      setShowForm(true);
                    }}
                    className="flex items-center gap-1 text-gray-300 hover:text-yellow-400"
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    onClick={() => blog.id && handleDelete(blog.id)}
                    disabled={deletingId === blog.id || !blog.id}
                    className={`flex items-center gap-1 text-red-500 hover:text-red-400 ${
                      deletingId === blog.id
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {deletingId === blog.id ? (
                      "Deleting..."
                    ) : (
                      <>
                        <Trash2 size={16} /> Delete
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-10">
            No blog posts found.
          </p>
        )}

        {/* Modal Form */}
        {showForm && (
          <BlogForm
            onClose={() => {
              setShowForm(false);
              setEditBlog(undefined);
            }}
            editBlog={editBlog}
            onSuccess={(newBlog: Blog) => {
              if (editBlog) {
                setBlogs((prev) =>
                  prev.map((b) => (b.id === newBlog.id ? newBlog : b))
                );
                toast.success("Blog updated successfully!", {
                  duration: 2500,
                  position: "top-center",
                });
              } else {
                setBlogs((prev) => [...prev, newBlog]);
                toast.success("New blog added successfully!", {
                  duration: 2500,
                  position: "top-center",
                });
              }
              setShowForm(false);
              setEditBlog(undefined);
            }}
          />
        )}
      </div>
    </>
  );
}
