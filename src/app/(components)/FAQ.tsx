'use client';

import React, { useState } from 'react';

type Props = {
  approach?: string[];
};

export default function ServiceApproach({ approach }: Props) {
  const steps = approach || [];

  if (!steps.length) return null;

  return (
    <section aria-labelledby="approach-title" className="py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="approach-title" className="text-center text-white text-2xl sm:text-3xl font-semibold mb-8">
          Our Proven Transformation Approach
        </h2>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="bg-white/5 rounded-lg overflow-hidden">
              <div className="p-4">
                <span className="text-white font-medium">{step}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
