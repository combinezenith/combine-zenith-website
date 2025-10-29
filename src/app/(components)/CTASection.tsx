'use client';

import Link from 'next/link';

export default function CTASectionEnhanced() {
  return (
    <section aria-label="Call to Action Section" className="relative py-20 px-6 overflow-hidden">

      <div aria-label="CTA Content Container" className="container mx-auto max-w-4xl relative z-10">
        <div aria-label="CTA Text Content" className="text-center space-y-8">
          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Our Clients Don&apos;t Just Work With Us They Grow With Us.
          </h2>

          {/* Description */}
          <p className="text-purple-200 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Every collaboration at Combine Zenith begins with trust and grows through shared vision. We see our clients not as projects, but as partners in purpose. Their goals become our goals, their challenges our mission. Each success story we create together is built on open communication, mutual respect, and genuine passion for making something meaningful. When our clients thrive, we thrive because every brand we help build is a reflection of the relationships we nurture with honesty and heart. At Combine Zenith, it&apos;s never just about campaigns or designs it&apos;s about creating impact, celebrating growth, and walking the journey together.
          </p>

          {/* CTA Button */}
          <div aria-label="Call to Action Button" className="pt-4">
<Link
              href="/contact"
              className="inline-block px-8 py-4 bg-[#b5a6d0] text-[#200053] hover:text-white font-semibold rounded-lg hover:bg-[#685885] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
            >
              Get a Free Consultation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}