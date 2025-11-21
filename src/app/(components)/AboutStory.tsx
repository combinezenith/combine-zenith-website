'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextType from "./TextType";

gsap.registerPlugin(ScrollTrigger);

export default function AboutStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bgCircle1Ref = useRef<HTMLDivElement>(null);
  const bgCircle2Ref = useRef<HTMLDivElement>(null);
  const bgCircle3Ref = useRef<HTMLDivElement>(null);

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

      // Animate content paragraphs with stagger
      if (contentRef.current) {
        const paragraphs = contentRef.current.querySelectorAll('p');
        gsap.fromTo(paragraphs,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: contentRef.current,
              start: "top 75%",
              end: "bottom 25%",
              toggleActions: "play none none reverse"
            }
          }
        );
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
    <section ref={sectionRef} aria-label="About Story Section" className="mt-20 relative py-20 overflow-hidden">
      {/* Background Elements */}
      <div aria-label="Background Decorations" className="absolute inset-0 overflow-hidden">
        <div ref={bgCircle1Ref} aria-label="Background Blur Circle 1" className="absolute -top-32 -right-32 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
        <div ref={bgCircle2Ref} aria-label="Background Blur Circle 2" className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
        <div ref={bgCircle3Ref} aria-label="Background Blur Circle 3" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
      </div>

      <div aria-label="About Content Container" className="mb-20 container mx-auto px-4 md:px-6 relative z-10">
        <div aria-label="About Text Content" className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div ref={headerRef} aria-label="About Header" className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
<TextType
  text={["Where Creativity Meets Connection,", "Vision Turns Into Reality"]}
  typingSpeed={75}
  pauseDuration={1000}
  showCursor={true}
  cursorCharacter="_"
/>
            </h1>
          </div>

          {/* Content Section */}
          <div ref={contentRef} aria-label="About Description" className="space-y-8">
            <p className="text-lg text-gray-300 leading-relaxed text-left">
              At Combine Zenith, we believe creativity begins with people. We focus on the ideas, emotions, and goals that shape every brand&apos;s story. Before creating anything, we first analyze your brand and its needs. We believe honesty leads to work that feels real and thoughtful.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed text-left">
              We don&apos;t treat brands as tasks to complete; we see them as partnerships built on trust. Our team of designers, writers, and thinkers works with care and clarity, crafting work that is thoughtful, original, and true to your vision. Every logo, message, and concept is shaped with attention to detail and a genuine respect for your story.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed text-left">
              Whether we&apos;re building your identity or creating your next campaign, our focus stays simple: clear communication, sincere creativity, and meaningful connections with your audience. At Combine Zenith, our mission is to help your brand rise with confidence, stand with intention, and be remembered for the right reasons.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed text-left">
              We hold ourselves to the highest level of quality in everything we do. Every detail, from design to strategy, reflects care, precision, and a commitment to excellence. We work side by side with you, bringing design, strategy, and content together so everything feels connected and makes sense.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}