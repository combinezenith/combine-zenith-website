"use client";
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import { Add } from "@mui/icons-material";

export default function TeamForm({ onAdded }: { onAdded: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    members: "",
    role: "",
    status: "Active",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "teamsCollection"), {
        ...formData,
        members: Number(formData.members),
        createdAt: serverTimestamp(),
      });
      onAdded();
      setFormData({ name: "", members: "", role: "", status: "Active" });
    } catch (error) {
      console.error("Error adding team: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#3D2F68] p-5 rounded-xl shadow-md text-white space-y-4"
    >
      <h2 className="text-lg font-semibold mb-2">Add New Team</h2>
      <input
        type="text"
        name="name"
        placeholder="Team Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 bg-[#2E2058] rounded-md outline-none"
      />
      <input
        type="number"
        name="members"
        placeholder="Members Count"
        value={formData.members}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 bg-[#2E2058] rounded-md outline-none"
      />
      <input
        type="text"
        name="role"
        placeholder="Role (Admin, Editor, Viewer)"
        value={formData.role}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 bg-[#2E2058] rounded-md outline-none"
      />
      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="w-full px-3 py-2 bg-[#2E2058] rounded-md outline-none"
      >
        <option>Active</option>
        <option>Inactive</option>
        <option>Pending</option>
      </select>
      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium transition w-full"
      >
        <Add fontSize="small" />
        {loading ? "Adding..." : "Add Team"}
      </button>
    </form>
  );
}
