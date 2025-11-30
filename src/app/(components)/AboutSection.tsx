'use client';

import TextType from './TextType';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/config/firebase";

gsap.registerPlugin(ScrollTrigger);

interface PartnerLogo {
  id: string;
  name: string;
  image: string;
  url: string;
  order: number;
}

export default function AboutSection() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const descriptionRef = useRef(null);
  const trustedHeadingRef = useRef(null);
  const marqueeRef = useRef(null);

  const [partnerLogos, setPartnerLogos] = useState<PartnerLogo[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch partner logos from Firestore
  useEffect(() => {
    const fetchPartnerLogos = async () => {
      try {
        const partnersSnapshot = await getDocs(collection(db, "partnerLogos"));
        const partnersData = partnersSnapshot.docs
          .map((d) => ({
            id: d.id,
            ...(d.data() as Omit<PartnerLogo, "id">),
          }))
          .filter((logo) => logo.image && logo.image.trim() !== "") // Filter out empty images
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        setPartnerLogos(partnersData);
      } catch (error) {
        console.error("Error fetching partner logos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartnerLogos();
  }, []);

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

  // Split logos into two rows for marquee effect
  const midPoint = Math.ceil(partnerLogos.length / 2);
  const row1Logos = partnerLogos.slice(0, midPoint);
  const row2Logos = partnerLogos.slice(midPoint);

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

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-purple-200">Loading partners...</p>
            </div>
          ) : partnerLogos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-purple-200">No partner logos to display yet.</p>
            </div>
          ) : (
            <div ref={marqueeRef} className="overflow-hidden">
              {/* Row 1 - moves left */}
              {row1Logos.length > 0 && (
                <div className="mb-6 md:mb-8 overflow-hidden">
                  <div className="flex gap-4 md:gap-8 animate-marquee-left">
                    {[...row1Logos, ...row1Logos].map((item, index) => {
                      // Ensure image exists and is valid
                      if (!item.image || item.image.trim() === "") return null;
                      
                      return (
                        <a
                          key={`row1-${item.id}-${index}`}
                          href={item.url || "#"}
                          target={item.url && item.url !== "#" ? "_blank" : "_self"}
                          rel={item.url && item.url !== "#" ? "noopener noreferrer" : undefined}
                          className="flex-shrink-0 w-32 h-20 md:w-40 md:h-24 bg-white rounded-lg p-1 md:p-2 hover:scale-105 transition-transform duration-300 shadow-md"
                        >
                          <Image
                            src={item.image}
                            alt={item.name || "Partner logo"}
                            className="w-full h-full object-contain"
                            width={160}
                            height={96}
                          />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Row 2 - moves right */}
              {row2Logos.length > 0 && (
                <div className="overflow-hidden">
                  <div className="flex gap-4 md:gap-8 animate-marquee-right">
                    {[...row2Logos, ...row2Logos].map((item, index) => {
                      // Ensure image exists and is valid
                      if (!item.image || item.image.trim() === "") return null;
                      
                      return (
                        <a
                          key={`row2-${item.id}-${index}`}
                          href={item.url || "#"}
                          target={item.url && item.url !== "#" ? "_blank" : "_self"}
                          rel={item.url && item.url !== "#" ? "noopener noreferrer" : undefined}
                          className="flex-shrink-0 w-32 h-20 md:w-40 md:h-24 bg-white rounded-lg p-1 md:p-2 hover:scale-105 transition-transform duration-300 shadow-md"
                        >
                          <Image
                            src={item.image}
                            alt={item.name || "Partner logo"}
                            className="w-full h-full object-contain"
                            width={160}
                            height={96}
                          />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
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