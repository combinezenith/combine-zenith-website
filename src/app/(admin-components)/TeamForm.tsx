"use client";
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import { Add } from "@mui/icons-material";

export default function TeamForm({ onAdded }: { onAdded: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    role: "",
    bio: "",
    linkedin: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "teamMembers"), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      onAdded();
      setFormData({ name: "", image: "", role: "", bio: "", linkedin: "" });
    } catch (error) {
      console.error("Error adding team member: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#3D2F68] p-5 rounded-xl shadow-md text-white space-y-4"
    >
      <h2 className="text-lg font-semibold mb-2">Add New Team Member</h2>
      <input
        type="text"
        name="name"
        placeholder="Member Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 bg-[#2E2058] rounded-md outline-none"
      />
      <input
        type="text"
        name="image"
        placeholder="Image URL"
        value={formData.image}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 bg-[#2E2058] rounded-md outline-none"
      />
      <input
        type="text"
        name="role"
        placeholder="Role (e.g., Admin, Editor, Viewer)"
        value={formData.role}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 bg-[#2E2058] rounded-md outline-none"
      />
      <textarea
        name="bio"
        placeholder="Bio"
        value={formData.bio}
        onChange={handleChange}
        required
        rows={3}
        className="w-full px-3 py-2 bg-[#2E2058] rounded-md outline-none resize-none"
      />
      <input
        type="url"
        name="linkedin"
        placeholder="LinkedIn Link"
        value={formData.linkedin}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 bg-[#2E2058] rounded-md outline-none"
      />
      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium transition w-full"
      >
        <Add fontSize="small" />
        {loading ? "Adding..." : "Add Member"}
      </button>
    </form>
  );
}
