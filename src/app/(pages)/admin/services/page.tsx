"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "@/app/(admin-components)/Sidebar";
import ServiceForm from "../../../(admin-components)/ServiceForm";
import toast from "react-hot-toast";

// ✅ Define a proper type for service (matching ServiceForm)
interface Service {
  id?: string;
  name?: string;
  description?: string;
  image?: string;
  skills?: string[];
  pillars?: { id: string; title: string; content: string }[];
  approach?: { id: string; title: string; content: string }[];
  status?: "Active" | "Inactive";
}

export default function ServiceManagementPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editService, setEditService] = useState<Service | undefined>(
    undefined
  );
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ✅ Fetch from Firestore
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const snapshot = await getDocs(collection(db, "services"));
        const data: Service[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Service, "id">),
        }));
        setServices(data);
      } catch (error) {
        toast.error("Failed to fetch services.", {
          position: "top-center",
        });
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // ✅ Delete with confirmation and toast
  const handleDelete = async (id: string) => {
    const serviceToDelete = services.find((s) => s.id === id);
    if (!serviceToDelete) return;

    const confirmToastId = toast.custom(
      () => (
        <div className="text-white p-3">
          <p>
            Delete <b>{serviceToDelete.name}</b>?
          </p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={async () => {
                toast.dismiss(confirmToastId);
                try {
                  setDeletingId(id);
                  await deleteDoc(doc(db, "services", id));
                  setServices((prev) => prev.filter((s) => s.id !== id));
                  toast.success("Service deleted successfully!", {
                    duration: 2500,
                    position: "top-center",
                  });
                } catch (e) {
                  console.log(e);
                  toast.error("Failed to delete service.", {
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

  const handleEdit = (service: Service) => {
    setEditService(service);
    setShowForm(true);
  };

  const filteredServices = services.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <p className="text-center py-10 text-gray-300">Loading services...</p>
    );

  return (
    <>
      <Sidebar />

      <div className="md:ml-64 p-4 sm:p-6 lg:p-8 text-white min-h-screen bg-[#1e183a] transition-all duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
            Services Management
          </h1>

          <button
            onClick={() => {
              setEditService(undefined);
              setShowForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base transition-all"
          >
            <Plus size={18} /> Add New Service
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center sm:justify-start mb-6">
          <input
            type="text"
            placeholder="🔍 Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-96 bg-[#2a2250]/70 text-white p-3 rounded-lg outline-none placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
              gap-6
            "
          >
            {filteredServices.map((service) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="
                  bg-[#2a2250]/80 
                  rounded-2xl 
                  p-5 
                  shadow-md 
                  hover:shadow-lg 
                  hover:bg-[#3b2e65]/70 
                  transition 
                  flex 
                  flex-col
                  justify-between
                "
              >
                <div>
                  <div className="text-3xl mb-3">💡</div>

                  <h2 className="text-lg sm:text-xl font-semibold mb-2 wrap-break-words">
                    {service.name || "Untitled Service"}
                  </h2>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {service.description || "No description available."}
                  </p>
                  {service.image && (
                    <p className="text-gray-400 text-xs mb-2">
                      Image: {service.image}
                    </p>
                  )}
                  {service.skills && service.skills.length > 0 && (
                    <p className="text-gray-400 text-xs mb-2">
                      Skills: {service.skills.join(", ")}
                    </p>
                  )}
                  {service.approach && service.approach.length > 0 && (
                    <p className="text-gray-400 text-xs mb-2">
                      Approach: {service.approach.length} steps
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center mb-3">
                    <span className="bg-green-500 text-xs px-3 py-1 rounded-full font-medium">
                      {service.status || "Active"}
                    </span>
                  </div>

                  <hr className="border-gray-600 mb-3" />

                  <div className="flex justify-between text-sm font-medium">
                    <button className="text-gray-300 hover:text-blue-400 transition">
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(service)}
                      className="text-yellow-400 hover:text-yellow-300 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => service.id && handleDelete(service.id)}
                      disabled={deletingId === service.id || !service.id}
                      className={`text-red-500 hover:text-red-400 transition ${
                        deletingId === service.id
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {deletingId === service.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-10">No services found.</p>
        )}

        {/* Modal Form */}
        {showForm && (
          <ServiceForm
            onClose={() => setShowForm(false)}
            editService={editService}
            onSuccess={(newService: Service) => {
              if (editService) {
                setServices(
                  services.map((s) => (s.id === newService.id ? newService : s))
                );
                toast.success("Service updated successfully!", {
                  duration: 2500,
                  position: "top-center",
                });
              } else {
                setServices([...services, newService]);
                toast.success("New service added successfully!", {
                  duration: 2500,
                  position: "top-center",
                });
              }
              setShowForm(false);
            }}
          />
        )}
      </div>
    </>
  );
}
