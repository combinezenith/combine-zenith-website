"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDocs,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { motion } from "framer-motion";

// ✅ Define a strongly typed Service interface
interface Service {
  id?: string;
  name?: string;
  description?: string;
  image?: string;
  video?: string;
  skills?: string[];
  pillars?: { id: string; title: string; content: string }[];
  approach?: { id: string; title: string; content: string }[];
  works?: { id: string; image: string; link: string }[];
  pricingPackages?: { [key: string]: { price: number; description?: string } };
  status?: "Active" | "Inactive";
  createdAt?: Timestamp;
}

// ✅ Define props for this form
interface ServiceFormProps {
  onClose: () => void;
  onSuccess: (service: Service) => void;
  editService?: Service;
}

export default function ServiceForm({
  onClose,
  editService,
  onSuccess,
}: ServiceFormProps) {
  // ✅ Only editable fields tracked in form state
  const [formData, setFormData] = useState({
    name: editService?.name || "",
    description: editService?.description || "",
    image: editService?.image || "",
    video: editService?.video || "",
  pillars: editService?.pillars || [{ id: "", title: "", content: "" }],
  approaches: editService?.approach || [
    { id: "", title: "", content: "" }
  ],
  works: editService?.works || [{ id: "", image: "", link: "" }],
  pricingPackages: editService?.pricingPackages || { 
    basic: { price: 0, description: "" }, 
    premium: { price: 0, description: "" }, 
    advanced: { price: 0, description: "" } 
  },
  status: editService?.status || "Active",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (
      name.startsWith('pillar') ||
      name.startsWith('approach') ||
      name.startsWith('works') ||
      name.startsWith('pricing-')
    ) {
      const [type, index, field] = name.split('-');
      if (type === 'pillar') {
        const idx = parseInt(index);
        setFormData((prev) => {
          const newPillars = [...prev.pillars];
          newPillars[idx] = { ...newPillars[idx], [field]: value };
          return { ...prev, pillars: newPillars };
        });
      } else if (type === 'approach') {
        const idx = parseInt(index);
        setFormData((prev) => {
          const newApproaches = [...prev.approaches];
          newApproaches[idx] = { ...newApproaches[idx], [field]: value };
          return { ...prev, approaches: newApproaches };
        });
      } else if (type === 'works') {
        const idx = parseInt(index);
        setFormData((prev) => {
          const newWorks = [...prev.works];
          newWorks[idx] = { ...newWorks[idx], [field]: value };
          return { ...prev, works: newWorks };
        });
      } else if (type === 'pricing') {
        const packageKey = index;
        setFormData((prev) => ({
          ...prev,
          pricingPackages: {
            ...prev.pricingPackages,
            [packageKey]: {
              ...prev.pricingPackages[packageKey],
              [field]: field === 'price' ? parseFloat(value) || 0 : value
            }
          }
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addPillar = () => {
    setFormData((prev) => ({
      ...prev,
      pillars: [...prev.pillars, { id: "", title: "", content: "" }],
    }));
  };

  const addApproach = () => {
    setFormData((prev) => ({
      ...prev,
      approaches: [...prev.approaches, { id: "", title: "", content: "" }],
    }));
  };

  const addWork = () => {
    setFormData((prev) => ({
      ...prev,
      works: [...prev.works, { id: "", image: "", link: "" }],
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const pillars = formData.pillars.filter(p => p.id && p.title && p.content);
      const approach = formData.approaches.filter(a => a.id && a.title && a.content);
      const works = formData.works.filter(w => w.image && w.link); // id may be empty for new docs

      const serviceData = {
        name: formData.name,
        description: formData.description,
        image: formData.image,
        video: formData.video,
        pillars,
        approach,
        pricingPackages: formData.pricingPackages,
        status: formData.status,
      };

      let docRef;
      if (editService?.id) {
        // Updating existing service
        docRef = doc(db, "services", editService.id);
        await updateDoc(docRef, serviceData);
      } else {
        // Adding new service
        docRef = await addDoc(collection(db, "services"), {
          ...serviceData,
          createdAt: serverTimestamp(),
        });
      }

      // Sync works subcollection
      const worksCollectionRef = collection(db, "services", docRef.id, "works");

      // Fetch current works docs in subcollection
      const currentWorksSnapshot = await getDocs(worksCollectionRef);
      const currentWorksDocs = currentWorksSnapshot.docs;

      // Delete docs missing from formData.works
      for (const docSnap of currentWorksDocs) {
        if (!works.find((w) => w.id === docSnap.id)) {
          await deleteDoc(doc(db, "services", docRef.id, "works", docSnap.id));
        }
      }

      // Add or update works from formData
      for (const work of works) {
        if (work.id) {
          // Update existing doc
          const workDocRef = doc(db, "services", docRef.id, "works", work.id);
          await updateDoc(workDocRef, {
            image: work.image,
            link: work.link,
          });
        } else {
          // New doc
          await addDoc(worksCollectionRef, {
            image: work.image,
            link: work.link,
          });
        }
      }

      // Notify success with updated service data, excluding works (location uncertain)
      const updatedService = {
        id: docRef.id,
        ...serviceData,
      };

      onSuccess(updatedService);

    } catch (error) {
      console.error("Error saving service:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#2a2250] rounded-xl p-6 w-[600px] max-h-[80vh] overflow-y-auto shadow-lg text-white"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editService ? "Edit Service" : "Add New Service"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Service Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none resize-none"
          />

          {/* 👇 Image Path Input */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">
              Image Path
            </label>
            <input
              name="image"
              type="text"
              placeholder="/images/service-banner.jpg"
              value={formData.image}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
            />
            <p className="text-gray-400 text-xs mt-1 px-1">
              💡 Enter path from public folder (e.g., /images/banner.jpg)
            </p>
          </div>

          {/* 👇 Video Path Input */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">
              Video Path (Optional)
            </label>
            <input
              name="video"
              type="text"
              placeholder="/videos/service-promo.mp4"
              value={formData.video}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
            />
            <p className="text-gray-400 text-xs mt-1 px-1">
              💡 Enter video path from public folder (e.g., /videos/promo.mp4)
            </p>
          </div>
    {/* New Works Section Added */}
    <div className="space-y-2 mt-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold">Gallery</h3>
        <button
          type="button"
          onClick={addWork}
          className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 rounded"
        >
          Add Items
        </button>
      </div>
      {formData.works.map((work, index) => (
        <div key={index} className="space-y-1 border border-gray-600 p-2 rounded mt-2">
          <input
            name={`works-${index}-image-path`}
            placeholder="Write Image Path..."
            value={work.image}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
          />
          <textarea
            name={`works-${index}-link`}
            placeholder="Write Link..."
            value={work.link}
            onChange={handleChange}
            rows={2}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none resize-none"
          />
        </div>
      ))}
    </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold">Pillars</h3>
              <button
                type="button"
                onClick={addPillar}
                className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 rounded"
              >
                Add Pillar
              </button>
            </div>
            {formData.pillars.map((pillar, index) => (
              <div key={index} className="space-y-1 border border-gray-600 p-2 rounded">
                <input
                  name={`pillar-${index}-id`}
                  placeholder="Pillar ID"
                  value={pillar.id}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
                />
                <input
                  name={`pillar-${index}-title`}
                  placeholder="Pillar Title"
                  value={pillar.title}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
                />
                <textarea
                  name={`pillar-${index}-content`}
                  placeholder="Pillar Content"
                  value={pillar.content}
                  onChange={handleChange}
                  rows={2}
                  className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none resize-none"
                />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold">Approaches</h3>
              <button
                type="button"
                onClick={addApproach}
                className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 rounded"
              >
                Add Approach
              </button>
            </div>
            {formData.approaches.map((approach, index) => (
              <div key={index} className="space-y-1 border border-gray-600 p-2 rounded">
                <input
                  name={`approach-${index}-id`}
                  placeholder="Approach ID"
                  value={approach.id}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
                />
                <input
                  name={`approach-${index}-title`}
                  placeholder="Approach Title"
                  value={approach.title}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
                />
                <textarea
                  name={`approach-${index}-content`}
                  placeholder="Approach Content"
                  value={approach.content}
                  onChange={handleChange}
                  rows={2}
                  className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none resize-none"
                />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Pricing Packages</h3>
            {Object.entries(formData.pricingPackages).map(([key, pkg]) => (
              <div key={key} className="space-y-1 border border-gray-600 p-2 rounded">
                <h4 className="text-xs font-medium capitalize">{key} Package</h4>
                <input
                  name={`pricing-${key}-price`}
                  placeholder="Price"
                  type="number"
                  value={pkg.price}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
                />
                <textarea
                  name={`pricing-${key}-description`}
                  placeholder="Description"
                  value={pkg.description || ""}
                  onChange={handleChange}
                  rows={2}
                  className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none resize-none"
                />
              </div>
            ))}
          </div>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

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