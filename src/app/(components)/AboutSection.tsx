'use client';

import TextType from './TextType';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const descriptionRef = useRef(null);
  const trustedHeadingRef = useRef(null);
  const marqueeRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading slide-in animation
      gsap.fromTo(headingRef.current,
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
            trigger: headingRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Description fade-up animation
      gsap.fromTo(descriptionRef.current,
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
            trigger: descriptionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Trusted heading fade-in animation
      gsap.fromTo(trustedHeadingRef.current,
        {
          opacity: 0,
          scale: 0.9,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: trustedHeadingRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Marquee container zoom-in animation
      gsap.fromTo(marqueeRef.current,
        {
          opacity: 0,
          scale: 0.8,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: marqueeRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const items = [
    { id: "1", img: "/partners/1.jpg", url: "#" },
    { id: "2", img: "/partners/2.jpg", url: "#" },
    { id: "3", img: "/partners/3.jpg", url: "#" },
    { id: "4", img: "/partners/4.jpg", url: "#" },
    { id: "5", img: "/partners/5.jpg", url: "#" },
    { id: "6", img: "/partners/6.jpg", url: "#" },
    { id: "7", img: "/partners/7.jpg", url: "#" },
    { id: "8", img: "/partners/8.jpg", url: "#" },
    { id: "9", img: "/partners/9.jpg", url: "#" },
    { id: "10", img: "/partners/10.jpg", url: "#" },
    { id: "11", img: "/partners/11.jpg", url: "#" },
    { id: "12", img: "/partners/12.jpg", url: "#" },
    { id: "13", img: "/partners/13.jpg", url: "#" },
    { id: "14", img: "/partners/14.jpg", url: "#" },
    { id: "15", img: "/partners/15.jpg", url: "#" },
    { id: "16", img: "/partners/16.jpg", url: "#" },
    { id: "17", img: "/partners/17.jpg", url: "#" },
    { id: "18", img: "/partners/18.jpg", url: "#" },
    { id: "19", img: "/partners/19.jpg", url: "#" },
    { id: "20", img: "/partners/20.jpg", url: "#" },
    { id: "21", img: "/partners/21.jpg", url: "#" },
    { id: "22", img: "/partners/22.jpg", url: "#" },
    { id: "23", img: "/partners/23.jpg", url: "#" },
    { id: "24", img: "/partners/24.jpg", url: "#" },
    { id: "25", img: "/partners/25.jpg", url: "#" },
  ];

  return (
    <section ref={sectionRef} aria-label="About Section" className="py-8 md:py-20 px-4 sm:px-6 overflow-x-hidden">
      <div aria-label="About Container" className="container mx-auto max-w-6xl">
        {/* About Content */}
        <div aria-label="About Content" className="text-center mb-8 md:mb-16">
          <h2 ref={headingRef} className="text-2xl md:text-5xl font-bold text-white mb-4 md:mb-8">
            <TextType
              text={["Driven by Creativity.", "Defined by Connection."]}
              typingSpeed={75}
              pauseDuration={1500}
              showCursor={true}
              cursorCharacter="|"
            />
          </h2>
          <p ref={descriptionRef} className="text-purple-200 text-sm md:text-xl leading-relaxed max-w-4xl mx-auto">
            At Combine Zenith, we&apos;re more than just a creative agency we&apos;re a collective of dreamers, thinkers, and makers who believe that every brand has a story worth telling. We listen deeply, think boldly, and create passionately blending imagination with strategy to turn ideas into powerful experiences. Our work goes beyond visuals and campaigns it&apos;s about building meaning, trust, and impact that last. From shaping your identity to creating measurable growth, we walk beside you as true partners crafting stories that inspire, connect, and make a difference.
          </p>
        </div>

        {/* Trusted By Section */}
        <div aria-label="Trusted Companies" className="bg-purple-800/30 backdrop-blur-sm rounded-xl md:rounded-3xl p-4 md:p-12">
          <h3 ref={trustedHeadingRef} className="text-xl md:text-4xl font-bold text-white text-center mb-6 md:mb-12">
            Trusted by Industry Leaders.
          </h3>

          <div ref={marqueeRef} className="overflow-hidden">
            {/* Row 1 - moves left */}
            <div className="mb-6 md:mb-8 overflow-hidden">
              <div className="flex gap-4 md:gap-8 animate-marquee-left">
                {[...items.slice(0, 13), ...items.slice(0, 13)].map((item, index) => (
                  <a
                    key={`row1-${index}`}
                    href={item.url}
                    className="flex-shrink-0 w-32 h-20 md:w-40 md:h-24 bg-white rounded-lg p-1 md:p-2 hover:scale-105 transition-transform duration-300 shadow-md"
                  >
                    <Image
                      src={item.img} 
                      alt={`Partner ${item.id}`}
                      className="w-full h-full object-contain"
                      width={250}
                      height={250}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.parentElement) {
                          target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-purple-600 font-semibold text-xs md:text-sm">Logo ${item.id}</div>`;
                        }
                      }}
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* Row 2 - moves right */}
            <div className="overflow-hidden">
              <div className="flex gap-4 md:gap-8 animate-marquee-right">
                {[...items.slice(13, 25), ...items.slice(13, 25)].map((item, index) => (
                  <a
                    key={`row2-${index}`}
                    href={item.url}
                    className="flex-shrink-0 w-32 h-20 md:w-40 md:h-24 bg-white rounded-lg p-1 md:p-2 hover:scale-105 transition-transform duration-300 shadow-md"
                  >
                    <Image
                      src={item.img} 
                      alt={`Partner ${item.id}`}
                      className="w-full h-full object-contain"
                      width={250}
                      height={250}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.parentElement) {
                          target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-purple-600 font-semibold text-xs md:text-sm">Logo ${item.id}</div>`;
                        }
                      }}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

<style jsx>{`
  @keyframes marquee-left {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  @keyframes marquee-right {
    0% { transform: translateX(-50%); }
    100% { transform: translateX(0); }
  }

  .animate-marquee-left {
    animation: marquee-left 30s linear infinite;
    width: fit-content;
  }

  .animate-marquee-right {
    animation: marquee-right 30s linear infinite;
    width: fit-content;
  }
`}</style>

    </section>
  );
}