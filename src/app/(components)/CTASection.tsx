'use client';

import Link from 'next/link';

export default function CTASectionEnhanced() {
  return (
    <section className="relative py-20 px-6 overflow-hidden">

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center space-y-8">
          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Ready to Transform Your Digital Presence?
          </h2>

          {/* Description */}
          <p className="text-purple-200 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Partner with Combine Zenith to unlock your brand&apos;s full potential. Let&apo;s
            discuss how our tailored strategies can drive your success.
          </p>

          {/* CTA Button */}
          <div className="pt-4">
<Link
              href="/contact"
              className="inline-block px-8 py-4 bg-[#b5a6d0] text-primary hover:text-white font-semibold rounded-lg hover:bg-secondary transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
            >
              Get a Free Consultation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}