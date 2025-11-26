"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
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
  works?: { id: string; mediaType: "image" | "video"; mediaPath: string; title: string; link: string }[];
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
    works: [{ id: "", mediaType: "image" as "image" | "video", mediaPath: "", title: "", link: "" }],
    pricingPackages: editService?.pricingPackages || { 
      basic: { price: 0, description: "" }, 
      premium: { price: 0, description: "" }, 
      advanced: { price: 0, description: "" } 
    },
    status: editService?.status || "Active",
  });

  const [loading, setLoading] = useState(false);
  const [loadingWorks, setLoadingWorks] = useState(false);

  // ✅ Fetch works from subcollection when editing
  useEffect(() => {
    const fetchWorks = async () => {
      if (!editService?.id) return;
      
      setLoadingWorks(true);
      try {
        const worksCollectionRef = collection(db, "services", editService.id, "works");
        const worksSnapshot = await getDocs(worksCollectionRef);
        
        const worksData = worksSnapshot.docs.map(doc => ({
          id: doc.id,
          mediaType: doc.data().mediaType || "image" as "image" | "video",
          mediaPath: doc.data().mediaPath || "",
          title: doc.data().title || "",
          link: doc.data().link || "",
        }));

        if (worksData.length > 0) {
          setFormData(prev => ({
            ...prev,
            works: worksData
          }));
        }
      } catch (error) {
        console.error("Error fetching works:", error);
      } finally {
        setLoadingWorks(false);
      }
    };

    fetchWorks();
  }, [editService?.id]);

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
          if (field === 'mediaType') {
            newWorks[idx] = { ...newWorks[idx], [field]: value as "image" | "video" };
          } else {
            newWorks[idx] = { ...newWorks[idx], [field]: value };
          }
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
      works: [...prev.works, { id: "", mediaType: "image", mediaPath: "", title: "", link: "" }],
    }));
  };

  const removeWork = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      works: prev.works.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const pillars = formData.pillars.filter(p => p.id && p.title && p.content);
      const approach = formData.approaches.filter(a => a.id && a.title && a.content);
      const works = formData.works.filter(w => w.mediaPath && w.title && w.link);

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
      let serviceId: string;

      if (editService?.id) {
        // Updating existing service
        serviceId = editService.id;
        docRef = doc(db, "services", serviceId);
        await updateDoc(docRef, serviceData);
      } else {
        // Adding new service
        const newDocRef = await addDoc(collection(db, "services"), {
          ...serviceData,
          createdAt: serverTimestamp(),
        });
        serviceId = newDocRef.id;
        docRef = newDocRef;
      }

      // Sync works subcollection
      const worksCollectionRef = collection(db, "services", serviceId, "works");

      // Fetch current works docs in subcollection
      const currentWorksSnapshot = await getDocs(worksCollectionRef);
      const currentWorksDocs = currentWorksSnapshot.docs;

      // Delete docs missing from formData.works
      for (const docSnap of currentWorksDocs) {
        if (!works.find((w) => w.id === docSnap.id)) {
          await deleteDoc(doc(db, "services", serviceId, "works", docSnap.id));
        }
      }

      // Add or update works from formData
      for (const work of works) {
        if (work.id) {
          // Update existing doc
          const workDocRef = doc(db, "services", serviceId, "works", work.id);
          await updateDoc(workDocRef, {
            mediaType: work.mediaType,
            mediaPath: work.mediaPath,
            title: work.title,
            link: work.link,
          });
        } else {
          // New doc
          await addDoc(worksCollectionRef, {
            mediaType: work.mediaType,
            mediaPath: work.mediaPath,
            title: work.title,
            link: work.link,
          });
        }
      }

      // Notify success with updated service data
      const updatedService = {
        id: serviceId,
        ...serviceData,
        works,
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

          {/* 📸 Works Gallery Section - Image or Video */}
          <div className="space-y-2 mt-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold">
                Gallery (Images/Videos)
                {loadingWorks && <span className="text-xs text-gray-400 ml-2">Loading...</span>}
              </h3>
              <button
                type="button"
                onClick={addWork}
                className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 rounded"
              >
                + Add Media
              </button>
            </div>
            {formData.works.map((work, index) => (
              <div key={index} className="space-y-2 border border-gray-600 p-3 rounded mt-2 bg-[#1f1a3a]">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Media #{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeWork(index)}
                    className="text-red-500 hover:text-red-400 text-xs"
                  >
                    ✕ Remove
                  </button>
                </div>
                
                {/* Media Type Selector */}
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-300">
                    Media Type
                  </label>
                  <select
                    name={`works-${index}-mediaType`}
                    value={work.mediaType}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
                  >
                    <option value="image">🖼️ Image</option>
                    <option value="video">🎥 Video</option>
                  </select>
                </div>

                {/* Media Path Input */}
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-300">
                    {work.mediaType === "image" ? "Image" : "Video"} Path
                  </label>
                  <input
                    name={`works-${index}-mediaPath`}
                    placeholder={
                      work.mediaType === "image" 
                        ? "/images/gallery/project1.jpg" 
                        : "/videos/gallery/demo.mp4"
                    }
                    value={work.mediaPath}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
                  />
                  <p className="text-gray-400 text-xs mt-1 px-1">
                    💡 Path from public folder (e.g., {work.mediaType === "image" ? "/images/gallery/photo.jpg" : "/videos/gallery/clip.mp4"})
                  </p>
                </div>

                {/* Title Input */}
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-300">
                    Title
                  </label>
                  <input
                    name={`works-${index}-title`}
                    placeholder="Project Title or Media Description"
                    value={work.title}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none"
                  />
                </div>

                {/* Link Input */}
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-300">
                    Link (URL)
                  </label>
                  <textarea
                    name={`works-${index}-link`}
                    placeholder="https://example.com or /project-details"
                    value={work.link}
                    onChange={handleChange}
                    rows={2}
                    className="w-full p-2 rounded bg-[#3b2e65] text-white outline-none resize-none"
                  />
                </div>
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
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

