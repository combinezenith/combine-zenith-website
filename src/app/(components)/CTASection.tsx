'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CTASectionEnhanced() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax background effect
      gsap.to(sectionRef.current, {
        backgroundPosition: "50% 100%",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Heading fade-up animation
      gsap.fromTo(headingRef.current,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Description slide-in animation
      gsap.fromTo(descriptionRef.current,
        {
          opacity: 0,
          x: -50,
        },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: descriptionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Button entrance animation
      gsap.fromTo(buttonRef.current,
        {
          opacity: 0,
          scale: 0.8,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: buttonRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Call to Action Section"
      className="relative py-20 px-6 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #200053 0%, #000000 50%, #200053 100%)',
        backgroundSize: '200% 200%',
      }}
    >

      <div aria-label="CTA Content Container" className="container mx-auto max-w-4xl relative z-10">
        <div aria-label="CTA Text Content" className="text-center space-y-8">
          {/* Heading */}
          <h2 ref={headingRef} className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Our Clients Don&apos;t Just Work With Us They Grow With Us.
          </h2>

          {/* Description */}
          <p ref={descriptionRef} className="text-purple-200 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Every collaboration at Combine Zenith begins with trust and grows through shared vision. We see our clients not as projects, but as partners in purpose. Their goals become our goals, their challenges our mission. Each success story we create together is built on open communication, mutual respect, and genuine passion for making something meaningful. When our clients thrive, we thrive because every brand we help build is a reflection of the relationships we nurture with honesty and heart. At Combine Zenith, it&apos;s never just about campaigns or designs it&apos;s about creating impact, celebrating growth, and walking the journey together.
          </p>

          {/* CTA Button */}
          <div aria-label="Call to Action Button" className="pt-4">
            <Link
              ref={buttonRef}
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
