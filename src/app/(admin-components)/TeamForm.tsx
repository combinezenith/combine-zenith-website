"use client";
import { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { Add } from "@mui/icons-material";

interface TeamMember {
  id: string;
  name: string;
  role: string;
}

export default function TeamForm({ onAdded }: { onAdded: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    role: "",
    bio: "",
    linkedin: "",
    parentRole: "",
  });
  const [loading, setLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  // Fetch existing team members for parent selection
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const snap = await getDocs(collection(db, "teamMembers"));
        const members = snap.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          role: doc.data().role,
        }));
        setTeamMembers(members);
      } catch (error) {
        console.error("Error fetching team members:", error);
      }
    };

    fetchTeamMembers();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "teamMembers"), {
        name: formData.name,
        image: formData.image,
        role: formData.role,
        bio: formData.bio,
        linkedin: formData.linkedin,
        parentRole: formData.parentRole || null, // Store parent role for hierarchy
        createdAt: serverTimestamp(),
      });
      onAdded();
      setFormData({ 
        name: "", 
        image: "", 
        role: "", 
        bio: "", 
        linkedin: "",
        parentRole: ""
      });
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
      
      <select
        name="parentRole"
        value={formData.parentRole}
        onChange={handleChange}
        className="w-full px-3 py-2 bg-[#2E2058] rounded-md outline-none text-white"
      >
        <option value="">Select Parent (Optional - for hierarchy)</option>
        <option value="Founder & Creative Director">Founder & Creative Director</option>
        <option value="Head of Marketing">Head of Marketing</option>
        <option value="Operations Lead">Operations Lead</option>
        <option value="Lead Developer">Lead Developer</option>
        {teamMembers.map((member) => (
          <option key={member.id} value={member.role}>
            {member.name} ({member.role})
          </option>
        ))}
      </select>
      
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