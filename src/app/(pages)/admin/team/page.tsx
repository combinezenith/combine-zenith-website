"use client";
import { useEffect, useState } from "react";
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

// ✅ Team interface
interface Team {
  id: string;
  name: string;
  members: string;
  role: string;
  status: "Active" | "Inactive" | "Pending" | string;
  createdAt?: Timestamp;
}

export default function TeamPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null); // ✅ modal state
  const [loading, setLoading] = useState(false);

  const fetchTeams = async () => {
    const querySnapshot = await getDocs(collection(db, "teamsCollection"));
    const data: Team[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Team, "id">),
    }));
    setTeams(data);
  };

  useEffect(() => {
    fetchTeams();
  }, [refresh]);

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "teamsCollection", id));
    setRefresh(!refresh);
  };

  const handleEditSave = async (updatedTeam: Team) => {
    if (!updatedTeam.id) return;
    setLoading(true);
    try {
      const docRef = doc(db, "teamsCollection", updatedTeam.id);
      await updateDoc(docRef, {
        name: updatedTeam.name,
        members: updatedTeam.members,
        role: updatedTeam.role,
        status: updatedTeam.status,
      });
      setEditingTeam(null);
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error updating team:", error);
    } finally {
      setLoading(false);
    }
  };

  const statusColor: Record<string, string> = {
    Active: "bg-green-500/20 text-green-400",
    Inactive: "bg-red-500/20 text-red-400",
    Pending: "bg-yellow-500/20 text-yellow-400",
  };

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
              Manage your organization’s teams and their roles within Combine
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
                <th className="py-3 px-4 text-left font-medium">Team Name</th>
                <th className="py-3 px-4 text-left font-medium">Members</th>
                <th className="py-3 px-4 text-left font-medium">Role</th>
                <th className="py-3 px-4 text-left font-medium">Status</th>
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
                  <td className="py-3 px-4">{team.members}</td>
                  <td className="py-3 px-4">{team.role}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        statusColor[team.status] ||
                        "bg-gray-500/20 text-gray-300"
                      }`}
                    >
                      {team.status}
                    </span>
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
                    colSpan={6}
                    className="text-center py-5 text-gray-400 text-sm"
                  >
                    No teams added yet.
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
  onClose: () => void;
  onSave: (updatedTeam: Team) => void;
  loading: boolean;
}

function EditTeamModal({ team, onClose, onSave, loading }: EditModalProps) {
  const [formData, setFormData] = useState<Team>(team);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#3D2F68] text-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <Close />
        </button>
        <h2 className="text-xl font-semibold mb-4">Edit Team</h2>

        <div className="space-y-3">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Team Name"
            className="w-full bg-[#2E2058] rounded-lg px-3 py-2 outline-none"
          />
          <input
            type="text"
            name="members"
            value={formData.members}
            onChange={handleChange}
            placeholder="Members"
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
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full bg-[#2E2058] rounded-lg px-3 py-2 outline-none"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
          </select>

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
