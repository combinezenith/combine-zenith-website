'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CoreValues() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const bgCircle1Ref = useRef<HTMLDivElement>(null);
  const bgCircle2Ref = useRef<HTMLDivElement>(null);
  const bgCircle3Ref = useRef<HTMLDivElement>(null);

  const values = [
    {
      title: "Clear Vision",
      description: "We communicate simply and honestly. Every idea and decision is explained in a way that's easy to understand and aligned with your goals.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      title: "Zenith Standard",
      description: "We hold ourselves to the highest level of quality in everything we do. Every detail, from design to strategy, reflects care, precision, and a commitment to excellence; We never settle for anything less than our best.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: "Unified Work",
      description: "We work side by side with you, bringing design, strategy, and content together so everything feels connected and makes sense.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "Accountable Growth",
      description: "We are responsible for your results as much as our work. Your growth is our priority, and we commit to helping your brand succeed every step of the way.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate header
      if (headerRef.current) {
        gsap.fromTo(headerRef.current,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // Animate value cards with horizontal alternating animations
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.value-card');
        cards.forEach((card, index) => {
          gsap.fromTo(card,
            { opacity: 0, x: index % 2 === 0 ? -100 : 100, scale: 0.8 },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              duration: 0.8,
              delay: index * 0.2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: gridRef.current,
                start: "top 75%",
                end: "bottom 25%",
                toggleActions: "play none none reverse"
              }
            }
          );
        });
      }

      // Parallax background effects
      if (bgCircle1Ref.current) {
        gsap.to(bgCircle1Ref.current, {
          y: -100,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        });
      }

      if (bgCircle2Ref.current) {
        gsap.to(bgCircle2Ref.current, {
          y: -80,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        });
      }

      if (bgCircle3Ref.current) {
        gsap.to(bgCircle3Ref.current, {
          y: -120,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} aria-label="Core Values Section" className="relative py-20 overflow-hidden">
      {/* Background Elements */}
      <div aria-label="Background Decorations" className="absolute inset-0 overflow-hidden">
        <div ref={bgCircle1Ref} aria-label="Background Blur Circle 1" className="absolute -top-32 -left-32 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
        <div ref={bgCircle2Ref} aria-label="Background Blur Circle 2" className="absolute -bottom-32 -right-32 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
        <div ref={bgCircle3Ref} aria-label="Background Blur Circle 3" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div aria-label="Core Values Container" className="container mx-auto px-6 relative z-10">
        <div aria-label="Core Values Content" className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div ref={headerRef} aria-label="Core Values Header" className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Our Core Values
            </h1>
          </div>

          {/* Values Grid */}
          <div ref={gridRef} aria-label="Values Grid" className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="value-card bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-purple-400/30 transition-all duration-300 hover:transform hover:scale-105 group"
              >
                <div aria-label="Value Item" className="flex items-start space-x-4">
                  <div aria-label="Value Icon" className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                    <div className="text-white">
                      {value.icon}
                    </div>
                  </div>
                  <div aria-label="Value Content" className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-3 transition-all duration-300">
                      {value.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}