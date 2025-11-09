'use client';

import TextType from './TextType';
import Masonry from './Masonry';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const trustedHeadingRef = useRef<HTMLHeadingElement>(null);
  const masonryRef = useRef<HTMLDivElement>(null);

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

      // Masonry container zoom-in animation
      gsap.fromTo(masonryRef.current,
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
            trigger: masonryRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const items = [
    {
      id: "1",
      img: "/partners/1.jpg",
      url: "#",
      height: 180,
    },
    {
      id: "2",
      img: "/partners/2.jpg",
      url: "#",
      height: 220,
    },
    {
      id: "3",
      img: "/partners/3.jpg",
      url: "#",
      height: 160,
    },
    {
      id: "4",
      img: "/partners/4.jpg",
      url: "#",
      height: 240,
    },
    {
      id: "5",
      img: "/partners/5.jpg",
      url: "#",
      height: 200,
    },
    {
      id: "6",
      img: "/partners/6.jpg",
      url: "#",
      height: 190,
    },
    {
      id: "7",
      img: "/partners/7.jpg",
      url: "#",
      height: 170,
    },
    {
      id: "8",
      img: "/partners/8.jpg",
      url: "#",
      height: 210,
    },
    {
      id: "9",
      img: "/partners/9.jpg",
      url: "#",
      height: 230,
    },
    {
      id: "10",
      img: "/partners/10.jpg",
      url: "#",
      height: 150,
    },
    {
      id: "11",
      img: "/partners/11.jpg",
      url: "#",
      height: 260,
    },
    {
      id: "12",
      img: "/partners/12.jpg",
      url: "#",
      height: 180,
    },
    {
      id: "13",
      img: "/partners/13.jpg",
      url: "#",
      height: 140,
    },
    {
      id: "14",
      img: "/partners/14.jpg",
      url: "#",
      height: 220,
    },
    {
      id: "15",
      img: "/partners/15.jpg",
      url: "#",
      height: 190,
    },
    {
      id: "16",
      img: "/partners/16.jpg",
      url: "#",
      height: 170,
    },
    {
      id: "17",
      img: "/partners/17.jpg",
      url: "#",
      height: 210,
    },
    {
      id: "18",
      img: "/partners/18.jpg",
      url: "#",
      height: 240,
    },
    {
      id: "19",
      img: "/partners/19.jpg",
      url: "#",
      height: 160,
    },
    {
      id: "20",
      img: "/partners/20.jpg",
      url: "#",
      height: 200,
    },
    {
      id: "21",
      img: "/partners/21.jpg",
      url: "#",
      height: 180,
    },
    {
      id: "22",
      img: "/partners/22.jpg",
      url: "#",
      height: 220,
    },
    {
      id: "23",
      img: "/partners/23.jpg",
      url: "#",
      height: 140,
    },
    {
      id: "24",
      img: "/partners/24.jpg",
      url: "#",
      height: 260,
    },
    {
      id: "25",
      img: "/partners/25.jpg",
      url: "#",
      height: 190,
    },
  ];

  return (
    <section ref={sectionRef} aria-label="About Section" className="py-8 md:py-20 px-4 sm:px-6">
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
        <div aria-label="Trusted Companies" className="bg-purple-800/30 backdrop-blur-sm rounded-xl md:rounded-3xl p-4 md:p-16 min-h-[500px] md:min-h-[800px] flex flex-col">
          <h3 ref={trustedHeadingRef} className="text-xl md:text-4xl font-bold text-white text-center mb-6 md:mb-12">
            Trusted by Industry Leaders.
          </h3>

          <div ref={masonryRef} className="flex-1 relative min-h-[300px] md:min-h-[200px]">
            <Masonry
              items={items}
              ease="power3.out"
              duration={0.6}
              stagger={0.05}
              animateFrom="random"
              scaleOnHover={true}
              hoverScale={0.95}
              blurToFocus={true}
              colorShiftOnHover={false}
              itemsPerLoad={10}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
