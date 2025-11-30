"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "@/app/config/firebase";
import Sidebar from "@/app/(admin-components)/Sidebar";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { Trash2, Upload, ImageIcon, Video, ChevronUp, ChevronDown, Save } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

// Interfaces
export type HeroBgType = "default" | "solid" | "image" | "video";

interface PartnerLogo {
  id: string;
  name: string;
  image: string;
  url: string;
  order: number;
}

interface HeroBackground {
  id: string;
  type: HeroBgType;
  value: string;
}

export default function HomeAdminPage() {
  const [partnerLogos, setPartnerLogos] = useState<PartnerLogo[]>([]);
  const [heroBackground, setHeroBackground] = useState<HeroBackground | null>(null);
  const [manualPartnerPath, setManualPartnerPath] = useState("");
  const [partnerUrl, setPartnerUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'partners' | 'hero'>('partners');

  const { data: session, status } = useSession();
  const router = useRouter();

  // Auth check
  useEffect(() => {
    if (status === "unauthenticated" || session?.user.role !== "admin") {
      router.replace("/admin/login");
    }
  }, [status, session, router]);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch partner logos
        const partnersSnapshot = await getDocs(collection(db, "partnerLogos"));
        const partnersData = partnersSnapshot.docs
          .map((d) => ({
            id: d.id,
            ...(d.data() as Omit<PartnerLogo, "id">),
          }))
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        setPartnerLogos(partnersData);

        // Fetch hero background
        const heroSnap = await getDocs(collection(db, "heroBackground"));
        if (!heroSnap.empty) {
          const docSnap = heroSnap.docs[0];
          const raw = docSnap.data() as Omit<HeroBackground, "id">;
          setHeroBackground({
            id: docSnap.id,
            type: raw.type || "default",
            value: raw.value ?? "",
          });
        } else {
          const defaultHero = {
            type: "default" as HeroBgType,
            value: "",
          };
          const created = await addDoc(collection(db, "heroBackground"), defaultHero);
          setHeroBackground({ id: created.id, ...defaultHero });
        }

        toast.success("Data loaded successfully!", { position: "top-center" });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") fetchData();
  }, [status]);

  // Upload helper
  const uploadFile = async (file: File, folder: string): Promise<string> => {
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const storageRef = ref(storage, `${folder}/${fileName}`);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (err: unknown) {
      console.warn("Storage upload failed:", err instanceof Error ? err.message : err);
      return "";
    }
  };

  // ===== PARTNER LOGOS =====
  const handleAddPartnerLogo = async (files: File[]) => {
    if (!files.length) return;

    setUploading(true);
    try {
      const url = await uploadFile(files[0], "partner-logos");

      await addDoc(collection(db, "partnerLogos"), {
        name: files[0].name,
        image: url || "",
        url: partnerUrl || "#",
        order: partnerLogos.length + 1,
      });

      const snap = await getDocs(collection(db, "partnerLogos"));
      const partnersData = snap.docs
        .map((d) => ({ id: d.id, ...(d.data() as Omit<PartnerLogo, "id">) }))
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      setPartnerLogos(partnersData);

      setPartnerUrl("");
      toast.success("Partner logo added successfully!");
    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to add partner logo");
    } finally {
      setUploading(false);
    }
  };

  const handleAddManualPartnerLogo = async () => {
    if (!manualPartnerPath.trim()) return toast.error("Enter a valid path");

    try {
      await addDoc(collection(db, "partnerLogos"), {
        name: manualPartnerPath.split("/").pop() ?? "public-file",
        image: manualPartnerPath,
        url: partnerUrl || "#",
        order: partnerLogos.length + 1,
      });

      const snap = await getDocs(collection(db, "partnerLogos"));
      const partnersData = snap.docs
        .map((d) => ({ id: d.id, ...(d.data() as Omit<PartnerLogo, "id">) }))
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      setPartnerLogos(partnersData);

      setManualPartnerPath("");
      setPartnerUrl("");
      toast.success("Partner logo added using public path");
    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to save partner logo");
    }
  };

  const handleDeletePartnerLogo = async (logo: PartnerLogo) => {
    if (window.confirm("Are you sure you want to delete this partner logo?")) {
      try {
        try {
          if (logo.image?.startsWith("https://")) {
            const parts = logo.image.split("/o/");
            if (parts.length > 1) {
              const encoded = parts[1].split("?")[0];
              const decoded = decodeURIComponent(encoded);
              await deleteObject(ref(storage, decoded));
            }
          }
        } catch (err) {
          console.warn("Storage deletion skipped or failed", err);
        }

        await deleteDoc(doc(db, "partnerLogos", logo.id));
        const filtered = partnerLogos.filter((l) => l.id !== logo.id);
        const reordered = filtered.map((l, idx) => ({ ...l, order: idx + 1 }));
        setPartnerLogos(reordered);
        
        for (const logo of reordered) {
          await updateDoc(doc(db, "partnerLogos", logo.id), { order: logo.order });
        }
        
        toast.success("Partner logo deleted successfully");
      } catch (err) {
        console.error(err);
        toast.error("Delete failed");
      }
    }
  };

  const movePartnerLogo = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = partnerLogos.findIndex(logo => logo.id === id);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex >= 0 && newIndex < partnerLogos.length) {
      const newLogos = [...partnerLogos];
      [newLogos[currentIndex], newLogos[newIndex]] = [newLogos[newIndex], newLogos[currentIndex]];
      
      const reordered = newLogos.map((logo, index) => ({ ...logo, order: index + 1 }));
      setPartnerLogos(reordered);
      
      for (const logo of reordered) {
        await updateDoc(doc(db, "partnerLogos", logo.id), { order: logo.order });
      }
      
      toast.success("Partner order updated");
    }
  };

  const handleUpdatePartnerUrl = async (id: string, newUrl: string) => {
    try {
      await updateDoc(doc(db, "partnerLogos", id), { url: newUrl });
      setPartnerLogos(prev => prev.map(p => p.id === id ? { ...p, url: newUrl } : p));
      toast.success("Partner URL updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update URL");
    }
  };

  // ===== HERO BACKGROUND =====
  const handleUpdateHeroBackground = async (
    type: HeroBgType,
    value: string,
    file?: File
  ) => {
    if (!heroBackground) return;

    try {
      setUploading(true);
      let finalValue = value;

      if ((type === "image" || type === "video") && file) {
        const url = await uploadFile(
          file,
          type === "image" ? "hero-images" : "hero-videos"
        );
        finalValue = url || value;
      }

      await updateDoc(doc(db, "heroBackground", heroBackground.id), {
        type,
        value: finalValue,
      });

      setHeroBackground({
        ...heroBackground,
        type,
        value: finalValue,
      });

      toast.success("Background updated successfully!");
    } catch (err: unknown) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setUploading(false);
    }
  };

  // Dropzone for partners
  const partnerDropzone = useDropzone({
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".svg", ".webp"] },
    onDrop: handleAddPartnerLogo,
    disabled: uploading,
  });

  if (loading || status === "loading")
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1e183a] text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading data...</p>
        </div>
      </div>
    );

  return (
    <>
      <Sidebar />

      <div className="md:ml-64 p-4 sm:p-6 lg:p-8 text-white min-h-screen bg-[#1e183a] transition-all duration-300">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left mb-3">
              Home Page Management
            </h1>
            <div className="flex gap-2 bg-[#2a2250]/80 p-1 rounded-lg w-fit">
              <button
                onClick={() => setActiveTab('partners')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'partners'
                    ? 'bg-purple-600 text-white'
                    : 'text-purple-300 hover:bg-purple-600/30'
                }`}
              >
                Partner Logos
              </button>
              <button
                onClick={() => setActiveTab('hero')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'hero'
                    ? 'bg-purple-600 text-white'
                    : 'text-purple-300 hover:bg-purple-600/30'
                }`}
              >
                Hero Background
              </button>
            </div>
          </div>
        </div>

        <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-200">
            💡 <strong>Tip:</strong> {activeTab === 'partners'
              ? 'Upload partner logos that will appear in the About section with scrolling animation.'
              : 'Configure the hero section background (default gradient, solid color, image, or video).'}
          </p>
        </div>

        {activeTab === 'partners' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-[#2a2250]/80 rounded-2xl p-6 shadow-md border border-white/5">
              <h2 className="text-xl font-semibold mb-4 text-purple-300">Add Partner Logo</h2>

              <div
                {...partnerDropzone.getRootProps()}
                className="border-2 border-dashed border-purple-500/50 hover:border-purple-500 p-8 rounded-lg text-center cursor-pointer transition-all bg-[#1e183a]/50 mb-4"
              >
                <input {...partnerDropzone.getInputProps()} />
                <Upload className="mx-auto mb-3 text-purple-400" size={48} />
                <p className="text-lg mb-1">{uploading ? "Uploading..." : "Drop partner logos here or click to browse"}</p>
                <p className="text-sm text-gray-400">Supports PNG, JPG, JPEG, SVG, WEBP</p>
              </div>

              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="/partners/logo.png"
                  value={manualPartnerPath}
                  onChange={(e) => setManualPartnerPath(e.target.value)}
                  className="flex-1 bg-[#1e183a] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 border border-white/20"
                />
                <button
                  onClick={handleAddManualPartnerLogo}
                  className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                >
                  Add Path
                </button>
              </div>
            </div>

            <div className="bg-[#2a2250]/80 rounded-2xl p-6 shadow-md border border-white/5">
              <h2 className="text-xl font-semibold mb-4 text-purple-300">
                Current Partner Logos ({partnerLogos.length})
              </h2>

              {partnerLogos.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No Partner Logos Yet</h3>
                  <p className="text-purple-200">Upload your first partner logo to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {partnerLogos.map((logo, index) => (
                    <motion.div
                      key={logo.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="bg-[#1e183a] p-4 rounded-xl relative hover:ring-2 hover:ring-purple-500 transition-all"
                    >
                      <div className="flex gap-4">
                        <div className="bg-white rounded-lg p-3 h-24 w-32 flex items-center justify-center flex-shrink-0">
                          <Image
                            src={logo.image || "/placeholder-logo.png"}
                            width={80}
                            height={80}
                            alt={logo.name}
                            className="object-contain max-h-full max-w-full"
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <p className="text-sm text-gray-400 truncate">{logo.name}</p>
                          <input
                            type="text"
                            value={logo.url}
                            onChange={(e) => handleUpdatePartnerUrl(logo.id, e.target.value)}
                            placeholder="Partner URL"
                            className="w-full bg-[#2a2250] text-white p-2 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 border border-white/20 text-sm"
                          />
                          <div className="flex gap-1">
                            <button
                              onClick={() => movePartnerLogo(logo.id, 'up')}
                              disabled={logo.order === 1}
                              className={`flex-1 p-2 rounded text-sm ${
                                logo.order === 1 
                                  ? 'text-gray-500 cursor-not-allowed bg-gray-700/30' 
                                  : 'text-purple-300 hover:bg-purple-600/30'
                              }`}
                            >
                              <ChevronUp size={16} className="mx-auto" />
                            </button>
                            <button
                              onClick={() => movePartnerLogo(logo.id, 'down')}
                              disabled={logo.order === partnerLogos.length}
                              className={`flex-1 p-2 rounded text-sm ${
                                logo.order === partnerLogos.length 
                                  ? 'text-gray-500 cursor-not-allowed bg-gray-700/30' 
                                  : 'text-purple-300 hover:bg-purple-600/30'
                              }`}
                            >
                              <ChevronDown size={16} className="mx-auto" />
                            </button>
                            <button
                              onClick={() => handleDeletePartnerLogo(logo)}
                              className="flex-1 p-2 text-red-400 hover:bg-red-600/30 rounded text-sm"
                            >
                              <Trash2 size={16} className="mx-auto" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 bg-purple-600/80 text-white text-xs px-2 py-1 rounded-full">
                        #{logo.order}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'hero' && heroBackground && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HeroBackgroundForm
              heroBackground={heroBackground}
              onUpdate={handleUpdateHeroBackground}
              uploading={uploading}
            />
          </motion.div>
        )}
      </div>
    </>
  );
}

// =============================
// HERO BACKGROUND FORM
// =============================

interface HeroBackgroundFormProps {
  heroBackground: HeroBackground;
  onUpdate: (type: HeroBgType, value: string, file?: File) => void;
  uploading: boolean;
}

function HeroBackgroundForm({ heroBackground, onUpdate, uploading }: HeroBackgroundFormProps) {
  const [selectedType, setType] = useState<HeroBgType>(heroBackground.type);
  const [solidColor, setSolidColor] = useState(heroBackground.value || "#000000");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [manualPath, setManualPath] = useState("");

  // Update local state when heroBackground changes
  useEffect(() => {
    setType(heroBackground.type);
    if (heroBackground.type === "solid") {
      setSolidColor(heroBackground.value || "#000000");
    }
  }, [heroBackground]);

  const save = () => {
    if (selectedType === "default") {
      onUpdate("default", "");
      return;
    }

    if (selectedType === "solid") {
      onUpdate("solid", solidColor);
      return;
    }

    if (manualPath.trim()) {
      onUpdate(selectedType, manualPath);
      return;
    }

    if (selectedFile) {
      onUpdate(selectedType, "", selectedFile);
      return;
    }

    toast.error("Select a file or enter a public path");
  };

  const { getRootProps, getInputProps } = useDropzone({
    disabled: uploading,
    multiple: false,
    accept:
      selectedType === "image"
        ? { "image/*": [".png", ".jpg", ".jpeg"] }
        : { "video/*": [".mp4", ".webm"] },
    onDrop: (files) => setSelectedFile(files[0]),
  });

  return (
    <div className="space-y-6">
      {/* Current Background Display */}
      <div className="bg-[#2a2250]/80 rounded-2xl p-6 shadow-md border border-white/5">
        <h2 className="text-xl font-semibold mb-4 text-purple-300">Current Hero Background</h2>
        <div className="flex items-center gap-4 p-4 bg-[#1e183a] rounded-lg border border-purple-500/30">
          <div className="text-4xl">
            {heroBackground.type === "default" && "🎨"}
            {heroBackground.type === "solid" && "🎨"}
            {heroBackground.type === "image" && "🖼️"}
            {heroBackground.type === "video" && "🎬"}
          </div>
          <div className="flex-1">
            <p className="text-lg font-semibold">
              {heroBackground.type === "default" && "Default Gradient"}
              {heroBackground.type === "solid" && "Solid Color"}
              {heroBackground.type === "image" && "Image Background"}
              {heroBackground.type === "video" && "Video Background"}
            </p>
            {heroBackground.value && heroBackground.type !== "default" && (
              <p className="text-sm text-gray-400 mt-1 break-all">
                {heroBackground.type === "solid" ? heroBackground.value : `Source: ${heroBackground.value.substring(0, 60)}...`}
              </p>
            )}
          </div>
          {heroBackground.type === "solid" && (
            <div 
              className="w-12 h-12 rounded-lg border-2 border-white/20"
              style={{ backgroundColor: heroBackground.value }}
            />
          )}
        </div>
      </div>

      {/* Preview */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-purple-300">Live Preview</h3>
        <div className="bg-[#2a2250]/80 rounded-2xl p-6 shadow-md border border-white/5">
          <div className="relative w-full h-64 rounded-lg overflow-hidden">
            {selectedType === "default" && (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 flex items-center justify-center">
                <p className="text-white text-lg font-semibold">Default Gradient</p>
              </div>
            )}
            {selectedType === "solid" && (
              <div 
                className="absolute inset-0 flex items-center justify-center"
                style={{ backgroundColor: solidColor }}
              >
                <p className="text-white text-lg font-semibold drop-shadow-lg">Solid Color</p>
              </div>
            )}
            {selectedType === "image" && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                {selectedFile ? (
                  <Image
                    src={URL.createObjectURL(selectedFile)}
                    alt="Hero preview"
                    fill
                    className="object-cover"
                  />
                ) : (heroBackground.type === "image" && heroBackground.value && heroBackground.value.trim() !== "" && !heroBackground.value.startsWith("#")) ? (
                  <Image
                    src={heroBackground.value}
                    alt="Hero preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <ImageIcon className="w-16 h-16 text-gray-600" />
                )}
              </div>
            )}
            {selectedType === "video" && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                {selectedFile ? (
                  <video
                    src={URL.createObjectURL(selectedFile)}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                  />
                ) : (heroBackground.type === "video" && heroBackground.value && heroBackground.value.trim() !== "" && !heroBackground.value.startsWith("#")) ? (
                  <video
                    src={heroBackground.value}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                  />
                ) : (
                  <Video className="w-16 h-16 text-gray-600" />
                )}
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-3xl font-bold mb-2">Hero Section</h2>
                <p className="text-sm">Your content will overlay here</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-purple-300">Change Background Settings</h3>
        <div className="bg-[#2a2250]/80 rounded-2xl p-6 shadow-md border border-white/5 space-y-6">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">Background Type</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "default", label: "Default Gradient", icon: "🎨" },
                { value: "solid", label: "Solid Color", icon: "🎨" },
                { value: "image", label: "Image", icon: "🖼️" },
                { value: "video", label: "Video", icon: "🎬" }
              ].map((option) => (
                <label 
                  key={option.value}
                  className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer border-2 transition-all ${
                    selectedType === option.value
                      ? 'border-purple-500 bg-gradient-to-br from-purple-600/30 to-indigo-600/30 shadow-lg'
                      : 'border-white/10 bg-[#1e183a]/50 hover:border-purple-500/50 hover:bg-[#1e183a]/80'
                  }`}
                >
                  <input
                    type="radio"
                    checked={selectedType === option.value}
                    onChange={() => {
                      setType(option.value as HeroBgType);
                      setSelectedFile(null);
                      setManualPath("");
                    }}
                    className="sr-only"
                  />
                  <span className="text-3xl">{option.icon}</span>
                  <span className="text-sm font-semibold">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Solid Color Picker */}
          {selectedType === "solid" && (
            <div className="space-y-3">
              <label className="block text-sm font-medium">Choose Color</label>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="color"
                    value={solidColor}
                    onChange={(e) => setSolidColor(e.target.value)}
                    className="w-20 h-20 rounded-xl cursor-pointer border-4 border-white/20"
                  />
                </div>
                <input
                  type="text"
                  value={solidColor}
                  onChange={(e) => setSolidColor(e.target.value)}
                  className="flex-1 bg-[#1e183a] text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 border border-white/20 font-mono text-lg"
                  placeholder="#000000"
                />
              </div>
            </div>
          )}

          {/* Image/Video Upload */}
          {(selectedType === "image" || selectedType === "video") && (
            <>
              <div>
                <label className="block text-sm font-medium mb-3">Upload {selectedType === "image" ? "Image" : "Video"}</label>
                <div
                  {...getRootProps()}
                  className="border-2 border-dashed border-purple-500/50 hover:border-purple-500 p-8 rounded-xl text-center cursor-pointer transition-all bg-gradient-to-br from-[#1e183a]/50 to-[#2a2250]/30 hover:from-[#2a2250]/50 hover:to-[#1e183a]/50"
                >
                  <input {...getInputProps()} />
                  <Upload className="mx-auto mb-3 text-purple-400" size={40} />
                  <p className="text-base font-medium mb-1">
                    {selectedFile 
                      ? `✓ ${selectedFile.name}` 
                      : `Drop ${selectedType} here or click to browse`}
                  </p>
                  <p className="text-xs text-gray-400">
                    {selectedType === "image" ? "PNG, JPG, JPEG" : "MP4, WEBM"}
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#2a2250] text-gray-400">OR</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Enter Public Path</label>
                <input
                  type="text"
                  placeholder={`/hero/${selectedType}.${selectedType === 'image' ? 'png' : 'mp4'}`}
                  className="w-full bg-[#1e183a] text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 border border-white/20"
                  value={manualPath}
                  onChange={(e) => setManualPath(e.target.value)}
                />
              </div>
            </>
          )}

          {/* Save Button */}
          <button
            onClick={save}
            disabled={uploading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] disabled:hover:scale-100 flex items-center justify-center gap-3 shadow-lg hover:shadow-purple-500/50"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                Saving Changes...
              </>
            ) : (
              <>
                <Save size={22} />
                Apply Background
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}