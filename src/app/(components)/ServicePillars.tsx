'use client';

import React from 'react';
import services from '@/app/data/services.json';

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
  const allPillars = (services as any[]).filter((s) => s.type === 'pillar') as Pillar[];

  const pillars = slugs && slugs.length
    ? allPillars.filter((p) => slugs.includes(p.slug))
    : allPillars;

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
