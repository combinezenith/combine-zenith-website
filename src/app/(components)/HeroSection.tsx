'use client';

import Link from "next/link";
import Image from "next/image";
import TextType from './TextType';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/config/firebase";

type HeroBgType = "default" | "solid" | "image" | "video";

interface HeroBackground {
  type: HeroBgType;
  value: string;
}

interface HeroBackgroundData {
  type: HeroBgType;
  value: string;
}

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [heroBg, setHeroBg] = useState<HeroBackground | null>(null);

  useEffect(() => {
    // fetch hero background
    const load = async () => {
      try {
        const snap = await getDocs(collection(db, "heroBackground"));
        if (!snap.empty) {
          const d = snap.docs[0].data() as HeroBackgroundData;
          setHeroBg({
            type: d.type || "default",
            value: d.value ?? "",
          });
        } else {
          setHeroBg({ type: "default", value: "" });
        }
      } catch (err) {
        console.warn("Failed to load hero bg", err);
        setHeroBg({ type: "default", value: "" });
      }
    };

    load();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Video fade-in animation (only if there's a video element)
      if (videoRef.current) {
        gsap.fromTo(
          videoRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1.5, ease: "power2.inOut" }
        );
      }

      // Text fade-up animation
      if (textRef.current) {
        gsap.fromTo(
          textRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1.2, delay: 0.5, ease: "power3.out" }
        );
      }

      // Button entrance
      if (buttonRef.current) {
        gsap.fromTo(
          buttonRef.current,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.8, delay: 0.8, ease: "back.out(1.7)" }
        );
      }

      // Social links slide-in
      if (socialRef.current) {
        gsap.fromTo(
          socialRef.current,
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, duration: 1, delay: 1, ease: "power3.out" }
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, [heroBg]); // re-run animations when heroBg changes

  // choose default gradient here — change this string to match your design
  const defaultGradientClass = "";

  // decide what to render for bg
  const renderBg = () => {
    if (!heroBg) return null;

    switch (heroBg.type) {
      case "default":
        // gradient background handled via class on section
        return null;
      case "solid":
        return (
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ backgroundColor: heroBg.value }}
          />
        );
      case "image":
        // value can be a public path (/hero/x.png) or a storage URL
        return (
          <Image
            src={heroBg.value}
            alt="Hero background"
            fill
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
        );
      case "video":
        // video tag behind content
        return (
          <video
            ref={videoRef}
            aria-hidden
            src={heroBg.value}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        );
      default:
        return null;
    }
  };

  const sectionClass =
    heroBg && heroBg.type === "default"
      ? `relative min-h-screen flex items-center justify-center overflow-hidden m-10 lg:mt-10 mt-20 ${defaultGradientClass}`
      : "relative min-h-screen flex items-center justify-center overflow-hidden m-10 lg:mt-10 mt-20";

  return (
    <section ref={heroRef} aria-label="Hero Section" className={sectionClass}>
      {/* render background layers */}
      {renderBg()}

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50" />

      <div aria-label="Hero Content" className="container mx-4 lg:mx-32 relative z-10">
        <div aria-label="Hero Grid" className="flex flex-col items-center justify-center text-center">
          {/* Text Content */}
          <div ref={textRef} aria-label="Hero Text" className="space-y-8 max-w-4xl">
            <div aria-label="Headline" className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-7xl text-white mt-10">
                <TextType
                  text={["From Ideas to Impact", "We Bring Your Vision to Life"]}
                  typingSpeed={75}
                  pauseDuration={1500}
                  showCursor={true}
                  cursorCharacter="|"
                />
              </h1>
            </div>

            <div aria-label="Description" className="space-y-4">
              <p className="text-gray-300 text-lg leading-relaxed mx-auto">
                At Combine Zenith, we don&apos;t just market brands — we partner with dreamers, creators, and changemakers. Every idea starts as a spark; we turn that spark into a story that connects, inspires, and drives real growth.
              </p>
            </div>
            <Link href="/services">
              <button
                ref={buttonRef}
                className="px-8 py-3 text-white rounded-l-xl rounded-r-xl bg-[#685885] transition-all transform hover:scale-105 shadow-2xl font-semibold text-lg"
              >
                Explore Our Services
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Social Media Links */}
      <div
        ref={socialRef}
        aria-label="Social Media Links"
        className="absolute left-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col space-y-6 z-30"
      >
        {/* ... keep your social icons markup if needed ... */}
      </div>
    </section>
  );
}
