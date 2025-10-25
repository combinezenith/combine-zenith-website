'use client';

import React, { useState } from 'react';

type Step = {
  id: string;
  title: string;
  content: string;
};

type Props = {
  approach?: Step[];
};

export default function ServiceApproach({ approach }: Props) {
  const steps = approach || [];
  const [open, setOpen] = useState<string | null>(steps.length ? steps[0].id : null);

  if (!steps.length) return null;

  return (
    <section aria-labelledby="approach-title" className="py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="approach-title" className="text-center text-white text-2xl sm:text-3xl font-semibold mb-8">
          Our Proven Transformation Approach
        </h2>

        <div className="space-y-4">
          {steps.map((s) => {
            const isOpen = open === s.id;
            return (
              <div key={s.id} className="bg-white/5 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : s.id)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="text-white font-medium">{s.title}</span>
                  <svg
                    className={`w-5 h-5 text-white transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <div className={`px-4 pb-4 text-white/90 ${isOpen ? 'block' : 'hidden'}`}>
                  <p className="text-sm">{s.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
