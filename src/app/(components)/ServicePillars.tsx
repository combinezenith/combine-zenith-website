'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs, DocumentData } from 'firebase/firestore';
import { db } from '../config/firebase';

type Pillar = {
  slug: string;
  name: string;
  description: string;
  type?: string;
};

type Props = {
  slugs?: string[];
};

export default function ServicePillars({ slugs }: Props) {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPillars = async () => {
      try {
        console.log("Fetching pillars for slugs:", slugs);
        const snapshot = await getDocs(collection(db, "services"));
        const allServices = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as DocumentData) } as Record<string, unknown>));
        console.log("All services:", allServices);
        const allPillars = allServices.filter((s: Record<string, unknown>) => s.type === 'pillar') as Pillar[];
        console.log("All pillars:", allPillars);
        const filteredPillars = slugs && slugs.length
          ? allPillars.filter((p: Pillar) => slugs.includes(p.slug))
          : allPillars;
        console.log("Filtered pillars:", filteredPillars);
        setPillars(filteredPillars);
      } catch (error) {
        console.error("Failed to fetch pillars:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPillars();
  }, [slugs]);

  if (loading) return <p className="text-center py-10 text-gray-300">Loading pillars...</p>;
  if (!pillars.length) return null;

  return (
    <section aria-labelledby="pillars-title" className="py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="pillars-title" className="text-center text-white text-2xl sm:text-3xl font-semibold mb-8">
          Our Key Pillars for Transformation
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((p) => (
            <div
              key={p.slug}
              className="p-6 rounded-lg shadow-md min-h-40 flex flex-col justify-center bg-[#685885]"

            >
              <div className="mb-4">
                <div className="h-10 w-10 rounded-md bg-[#b5a6d0] flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" fill="#FFFFFF" fillOpacity="0.9"/>
                  </svg>
                </div>
              </div>

              <h3 className="text-white text-lg font-semibold mb-2">{p.name}</h3>
              <p className="text-white/90 text-sm">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
