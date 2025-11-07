"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../../config/firebase";
import TeamForm from "../../../(admin-components)/TeamForm";
import { Edit, Delete, FilterList, Close } from "@mui/icons-material";
import Sidebar from "@/app/(admin-components)/Sidebar";
import Image from "next/image";

// ✅ Team interface
interface Team {
  id: string;
  name: string;
  image: string;
  role: string;
  bio: string;
  linkedin: string;
  parentRole?: string | null;
  createdAt?: Timestamp;
}

export default function TeamPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  // ✅ Route protection: redirect unauthenticated users
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  // ✅ Fetch team data
  useEffect(() => {
    const fetchTeams = async () => {
      const querySnapshot = await getDocs(collection(db, "teamMembers"));
      const data: Team[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Team, "id">),
      }));
      setTeams(data);
    };

    if (status === "authenticated" && session) {
      fetchTeams();
    }
  }, [status, session, refresh]);

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "teamMembers", id));
    setRefresh(!refresh);
  };

  const handleEditSave = async (updatedTeam: Team) => {
    if (!updatedTeam.id) return;
    setLoading(true);
    try {
      const docRef = doc(db, "teamMembers", updatedTeam.id);
      await updateDoc(docRef, {
        name: updatedTeam.name,
        image: updatedTeam.image,
        role: updatedTeam.role,
        bio: updatedTeam.bio,
        linkedin: updatedTeam.linkedin,
        parentRole: updatedTeam.parentRole || null,
      });
      setEditingTeam(null);
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error updating team member:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle loading & unauthenticated state AFTER hooks
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#392C6A] text-white">
        Checking authentication...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Prevent flicker before redirect
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#392C6A]">
      {/* Sidebar */}
      <div className="md:fixed md:w-64 md:h-screen">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 text-white p-4 sm:p-6 md:pl-72 lg:pl-80">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Team Management</h1>
            <p className="text-gray-300 text-sm mt-1 max-w-md">
              Manage your organization's teams and their roles within Combine
              Zenith.
            </p>
          </div>
          <button className="p-2 bg-white/10 hover:bg-white/20 rounded-full self-start">
            <FilterList />
          </button>
        </div>

        {/* Add New Team Form */}
        <div className="mb-6">
          <TeamForm onAdded={() => setRefresh(!refresh)} />
        </div>

        {/* Teams Table */}
        <div className="overflow-x-auto bg-[#3D2F68] rounded-lg shadow-md">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#2E2058] text-gray-300">
                <th className="py-3 px-4 text-left font-medium">Member Name</th>
                <th className="py-3 px-4 text-left font-medium">Image</th>
                <th className="py-3 px-4 text-left font-medium">Role</th>
                <th className="py-3 px-4 text-left font-medium">Parent Role</th>
                <th className="py-3 px-4 text-left font-medium">Bio</th>
                <th className="py-3 px-4 text-left font-medium">LinkedIn</th>
                <th className="py-3 px-4 text-left font-medium">Created On</th>
                <th className="py-3 px-4 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr
                  key={team.id}
                  className="border-t border-[#4B3A80] hover:bg-[#4A3B80]/50 transition"
                >
                  <td className="py-3 px-4 font-medium">{team.name}</td>
                  <td className="py-3 px-4">
                    <Image
                      src={team.image || ""}
                      alt={team.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="py-3 px-4">{team.role}</td>
                  <td className="py-3 px-4 text-gray-400">
                    {team.parentRole || "Root"}
                  </td>
                  <td className="py-3 px-4 max-w-xs truncate">{team.bio}</td>
                  <td className="py-3 px-4">
                    <a
                      href={team.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      LinkedIn
                    </a>
                  </td>
                  <td className="py-3 px-4 text-gray-400 whitespace-nowrap">
                    {team.createdAt?.toDate
                      ? team.createdAt.toDate().toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2 sm:gap-3">
                      <button
                        className="p-1 rounded-md hover:bg-white/10"
                        onClick={() => setEditingTeam(team)}
                      >
                        <Edit fontSize="small" />
                      </button>
                      <button
                        className="p-1 rounded-md hover:bg-white/10"
                        onClick={() => handleDelete(team.id)}
                      >
                        <Delete fontSize="small" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {teams.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-5 text-gray-400 text-sm"
                  >
                    No team members added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Edit Modal */}
        {editingTeam && (
          <EditTeamModal
            team={editingTeam}
            teams={teams}
            onClose={() => setEditingTeam(null)}
            onSave={handleEditSave}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}

// ✅ Edit Modal Component
interface EditModalProps {
  team: Team;
  teams: Team[];
  onClose: () => void;
  onSave: (updatedTeam: Team) => void;
  loading: boolean;
}

function EditTeamModal({ team, teams, onClose, onSave, loading }: EditModalProps) {
  const [formData, setFormData] = useState<Team>(team);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#3D2F68] text-white rounded-lg p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <Close />
        </button>
        <h2 className="text-xl font-semibold mb-4">Edit Team Member</h2>

        <div className="space-y-3">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Member Name"
            className="w-full bg-[#2E2058] rounded-lg px-3 py-2 outline-none"
          />
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Image URL"
            className="w-full bg-[#2E2058] rounded-lg px-3 py-2 outline-none"
          />
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="Role"
            className="w-full bg-[#2E2058] rounded-lg px-3 py-2 outline-none"
          />
          
          {/* Parent Role Dropdown */}
          <select
            name="parentRole"
            value={formData.parentRole || ""}
            onChange={handleChange}
            className="w-full bg-[#2E2058] rounded-lg px-3 py-2 outline-none text-white"
          >
            <option value="">Select Parent (Optional - for hierarchy)</option>
            <option value="Founder & Creative Director">Founder & Creative Director</option>
            <option value="Head of Marketing">Head of Marketing</option>
            <option value="Operations Lead">Operations Lead</option>
            <option value="Lead Developer">Lead Developer</option>
            {teams
              .filter((t) => t.id !== team.id) // Don't show current member
              .map((t) => (
                <option key={t.id} value={t.role}>
                  {t.name} ({t.role})
                </option>
              ))}
          </select>

          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Bio"
            rows={3}
            className="w-full bg-[#2E2058] rounded-lg px-3 py-2 outline-none resize-none"
          />
          <input
            type="url"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder="LinkedIn Link"
            className="w-full bg-[#2E2058] rounded-lg px-3 py-2 outline-none"
          />

          <button
            onClick={() => onSave(formData)}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 rounded-lg py-2 font-semibold mt-3 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}