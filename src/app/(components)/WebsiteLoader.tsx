"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";

export default function WebsiteLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const loaderRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Always show loader on home page, regardless of visit history
    // Only skip if explicitly set to skip
    const skipLoader = localStorage.getItem("skipLoader");
    if (skipLoader === "true") {
      setIsLoading(false);
      setShowContent(true);
      return;
    }

    const duration = 4000; // 9 seconds

    // Start exit animation after duration
    setTimeout(() => {
      const tl = gsap.timeline();

      // Swipe up animation
      tl.to(overlayRef.current, {
        y: "-100%",
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          // Don't set hasVisited to true, so it shows every time
          setIsLoading(false);
          // Add a small delay before showing content to ensure smooth transition
          setTimeout(() => {
            setShowContent(true);
          }, 100);
        }
      });
    }, duration);
  }, []);

  useEffect(() => {
    if (isLoading && loaderRef.current) {
      // Initial setup
      gsap.set(logoRef.current, {
        opacity: 0,
        scale: 0.8
      });

      gsap.set(overlayRef.current, {
        y: 0
      });

      // Logo entrance animation
      gsap.to(logoRef.current, {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "back.out(1.7)",
        delay: 0.2
      });
    }
  }, [isLoading]);

  if (!showContent) {
    return (
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 bg-white flex items-center justify-center"
      >
        {/* Logo Container */}
        <div ref={logoRef} className="relative">
          <div className="relative">
            <Image
              src="/logo.png"
              width={200}
              height={80}
              alt="Combine Zenith Logo"
              className="drop-shadow-lg"
              priority
            />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
