"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { db } from "../config/firebase";
import { addDoc, updateDoc, collection, doc } from "firebase/firestore";

// ✅ Strongly typed user data structure
interface UserData {
  id?: string;
  name?: string;
  email?: string;
  role?: "Admin" | "Editor" | "Viewer";
  status?: "Active" | "Inactive" | "Pending";
  lastLogin?: string;
}

// ✅ Props definition
interface UserFormProps {
  onClose: () => void;
  editUser?: UserData;
  onSuccess: (user: UserData) => void;
}

export default function UserForm({
  onClose,
  editUser,
  onSuccess,
}: UserFormProps) {
  const [form, setForm] = useState<Omit<UserData, "id">>({
    name: editUser?.name || "",
    email: editUser?.email || "",
    role: editUser?.role || "Viewer",
    status: editUser?.status || "Active",
    lastLogin: editUser?.lastLogin || "",
  });

  // ✅ Handle input changes with strong typing
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (editUser?.id) {
        const docRef = doc(db, "users", editUser.id);
        await updateDoc(docRef, form); // ✅ Removed 'as any'
        onSuccess({ ...form, id: editUser.id });
      } else {
        const docRef = await addDoc(collection(db, "users"), form);
        onSuccess({ ...form, id: docRef.id });
      }
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#2a2250] p-6 rounded-xl w-[400px] space-y-4"
      >
        <h2 className="text-xl font-semibold text-white">
          {editUser ? "Edit User" : "Add New User"}
        </h2>

        <input
          name="name"
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 rounded bg-[#3b2e65] border border-gray-600 text-white"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 rounded bg-[#3b2e65] border border-gray-600 text-white"
          required
        />

        <input
          name="lastLogin"
          type="text"
          placeholder="Last Login"
          value={form.lastLogin}
          onChange={handleChange}
          className="w-full p-2 rounded bg-[#3b2e65] border border-gray-600 text-white"
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full p-2 rounded bg-[#3b2e65] border border-gray-600 text-white"
        >
          <option value="Admin">Admin</option>
          <option value="Editor">Editor</option>
          <option value="Viewer">Viewer</option>
        </select>

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full p-2 rounded bg-[#3b2e65] border border-gray-600 text-white"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Pending">Pending</option>
        </select>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
