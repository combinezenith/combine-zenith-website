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
import { Trash2, Upload } from "lucide-react";
import Image from "next/image";

// Interfaces
export type HeroBgType = "default" | "solid" | "image" | "video";

interface TrustedLogo {
  id: string;
  name: string;
  image: string;
}

interface HeroBackground {
  id: string;
  type: HeroBgType;
  value: string;
}

export default function HomeAdminPage() {
  const [trustedLogos, setTrustedLogos] = useState<TrustedLogo[]>([]);
  const [heroBackground, setHeroBackground] = useState<HeroBackground | null>(null);
  const [manualLogoPath, setManualLogoPath] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

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
        // Fetch trusted logos
        const logosSnapshot = await getDocs(collection(db, "trustedLogos"));
        setTrustedLogos(
          logosSnapshot.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<TrustedLogo, "id">),
          }))
        );

        // Fetch hero background (take first doc)
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
      } catch (err) {
        console.error(err);
        toast.error("Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") fetchData();
  }, [status]);

  // Upload helper: returns download URL or empty string on storage failure
  const uploadFile = async (file: File, folder: string): Promise<string> => {
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const storageRef = ref(storage, `${folder}/${fileName}`);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (err: unknown) {
      console.warn("Storage upload failed:", err instanceof Error ? err.message : err);
      // Return empty string so UI can fallback to manual/public path
      return "";
    }
  };

  // Add logo from dropzone
  const handleAddLogo = async (files: File[]) => {
    if (!files.length) return;

    setUploading(true);
    try {
      const url = await uploadFile(files[0], "trusted-logos");

      await addDoc(collection(db, "trustedLogos"), {
        name: files[0].name,
        image: url || "", // if storage missing, save empty or use manual path later
      });

      const snap = await getDocs(collection(db, "trustedLogos"));
      setTrustedLogos(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<TrustedLogo, "id">) })));

      toast.success("Logo added");
    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to add logo");
    } finally {
      setUploading(false);
    }
  };

  // Add logo using manual /public path
  const handleAddManualLogo = async () => {
    if (!manualLogoPath.trim()) return toast.error("Enter a valid path");

    try {
      await addDoc(collection(db, "trustedLogos"), {
        name: manualLogoPath.split("/").pop() ?? "public-file",
        image: manualLogoPath,
      });

      const snap = await getDocs(collection(db, "trustedLogos"));
      setTrustedLogos(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<TrustedLogo, "id">) })));

      setManualLogoPath("");
      toast.success("Logo added using public path");
    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to save logo");
    }
  };

  // Delete logo (storage safe)
  const handleDeleteLogo = async (logo: TrustedLogo) => {
    try {
      // If the stored image is a Firebase download URL, convert to storage path and attempt delete.
      try {
        if (logo.image?.startsWith("https://")) {
          // firebase download urls contain "/o/<encodedPath>?..."
          const parts = logo.image.split("/o/");
          if (parts.length > 1) {
            const encoded = parts[1].split("?")[0];
            const decoded = decodeURIComponent(encoded);
            await deleteObject(ref(storage, decoded));
          }
        }
        // if logo.image is a storage path or empty or /public path, skip deletion
      } catch (err) {
        console.warn("Storage deletion skipped or failed", err);
      }

      await deleteDoc(doc(db, "trustedLogos", logo.id));
      setTrustedLogos((prev) => prev.filter((l) => l.id !== logo.id));
      toast.success("Logo deleted");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  // Update hero background (includes file or manual path)
  const handleUpdateHeroBackground = async (
    type: HeroBgType,
    value: string,
    file?: File
  ) => {
    if (!heroBackground) return;

    setUploading(true);
    try {
      let finalValue = value;

      if ((type === "image" || type === "video") && file) {
        const url = await uploadFile(
          file,
          type === "image" ? "hero-images" : "hero-videos"
        );
        finalValue = url || value; // if upload fails, keep manual value (if any)
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

      toast.success("Background updated");
    } catch (err: unknown) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setUploading(false);
    }
  };

  // Dropzone for logos
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".svg", ".webp"] },
    onDrop: handleAddLogo,
    disabled: uploading,
  });

  if (loading || status === "loading")
    return (
      <div className="text-white p-10">Loading…</div>
    );

  return (
    <div className="flex">
      <div className="fixed w-64 h-screen">
        <Sidebar />
      </div>

      <div className="flex-1 text-white p-6 ml-64">
        <h1 className="text-2xl font-bold mb-6">Home Management</h1>

        {/* Trusted Logos */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Trusted Logos</h2>

          {/* Dropzone */}
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-400 p-6 rounded-lg text-center cursor-pointer"
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto mb-2" />
            <p>{uploading ? "Uploading..." : "Drop logos or click"}</p>
          </div>

          {/* Manual path input */}
          <div className="mt-4 flex gap-3">
            <input
              type="text"
              placeholder="/trusted/logo.png"
              value={manualLogoPath}
              onChange={(e) => setManualLogoPath(e.target.value)}
              className="flex-1 bg-[#2E2058] rounded px-3 py-2"
            />
            <button
              onClick={handleAddManualLogo}
              className="bg-purple-600 px-4 rounded"
            >
              Add
            </button>
          </div>

          {/* Logos grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {trustedLogos.map((logo) => (
              <div key={logo.id} className="bg-[#3D2F68] p-4 rounded relative group">
                <Image
                  src={logo.image || "/placeholder-logo.png"}
                  width={80}
                  height={80}
                  alt={logo.name}
                  className="object-contain w-full h-16"
                />
                <button
                  onClick={() => handleDeleteLogo(logo)}
                  className="absolute top-2 right-2 bg-red-600 p-1 rounded opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Background */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Hero Background</h2>

          {heroBackground && (
            <HeroBackgroundForm
              heroBackground={heroBackground}
              onUpdate={handleUpdateHeroBackground}
              uploading={uploading}
            />
          )}
        </div>
      </div>
    </div>
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
    <div className="bg-[#3D2F68] p-6 rounded-lg space-y-4">

      {/* Type */}
      <div>
        <p className="text-sm mb-1">Background Type</p>
        <div className="grid grid-cols-2 gap-3">
          {["default", "solid", "image", "video"].map((t) => (
            <label key={t} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={selectedType === t}
                onChange={() => {
                  setType(t as HeroBgType);
                  setSelectedFile(null);
                  setManualPath("");
                }}
              />
              <span className="text-sm capitalize">{t}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Solid color */}
      {selectedType === "solid" && (
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={solidColor}
            onChange={(e) => setSolidColor(e.target.value)}
            className="w-12 h-10"
          />
          <input
            type="text"
            value={solidColor}
            onChange={(e) => setSolidColor(e.target.value)}
            className="flex-1 bg-[#2E2058] px-3 py-2 rounded"
          />
        </div>
      )}

      {/* Image / video dropzone + manual path */}
      {(selectedType === "image" || selectedType === "video") && (
        <>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-400 p-4 rounded text-center cursor-pointer"
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto mb-2" />
            <p>{selectedFile ? selectedFile.name : `Drop ${selectedType} or click`}</p>
          </div>

          <div className="mt-3">
            <input
              type="text"
              placeholder={`/hero/${selectedType}.png`}
              className="w-full bg-[#2E2058] px-3 py-2 rounded"
              value={manualPath}
              onChange={(e) => setManualPath(e.target.value)}
            />
          </div>
        </>
      )}

      {/* Save */}
      <button
        onClick={save}
        className="w-full bg-purple-600 py-2 rounded font-semibold"
        disabled={uploading}
      >
        {uploading ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
