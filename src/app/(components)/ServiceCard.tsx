"use client";

import Image from 'next/image';
import { IconType } from 'react-icons';
import { LuLightbulb, LuTarget, LuPalette, LuVideo, LuSearch, LuTrendingUp, LuCode, LuPrinter } from 'react-icons/lu';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { collection, getDocs, DocumentData } from 'firebase/firestore';
import { db } from '../config/firebase';
import SkeletonLoader from './SkeletonLoader';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Service {
  id: string;
  name: string;
  description: string;
  image?: string;
  skills?: string[];
  approach?: string[];
  status?: string;
}

const iconsMap: Record<string, IconType> = {
  'Branding Identity': LuLightbulb,
  'Creative Strategy': LuTarget,
  'Creative Work': LuPalette,
  'Ai Videos': LuVideo,
  'SEO': LuSearch,
  'Performance Marketing': LuTrendingUp,
  'Website Development': LuCode,
  'All Print Productions': LuPrinter,
};

export default function ServiceCard() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const snapshot = await getDocs(collection(db, "services"));
        const data = snapshot.docs.map(
          (d) => ({ id: d.id, ...(d.data() as DocumentData) } as Service)
        );
        setServices(data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    if (!loading && cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll('.service-card');

      gsap.fromTo(cards,
        {
          opacity: 0,
          y: 60,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, [loading]);

  return (
    <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mx-4 md:mx-8 lg:mx-12 my-8 p-4 md:p-6 text-center justify-center items-center">
      {loading ? (
        <SkeletonLoader count={6} className="h-80" />
      ) : (
        services.map((service) => {
          const Icon = iconsMap[service.name] || LuLightbulb;
          return (
            <div
              key={service.id}
              className="service-card group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-white/10 overflow-hidden flex flex-col hover:border-white/30"
            >
              {/* Subtle background overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Image section */}
              <div className="relative w-full h-44 md:h-48 lg:h-48 overflow-hidden">
                <Image
                  src={service.image || '/logo.jpg'}
                  alt={service.name || 'Service Image'}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Minimal overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
              </div>

              <div className="relative p-6 flex-1 flex flex-col">
                {/* Header with icon and title */}
                <div className="mb-4 flex items-center gap-3 justify-center">
                  <div className="h-10 w-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                    <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-white group-hover:text-white transition-colors duration-300">
                    {service.name}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow group-hover:text-gray-200 transition-colors duration-300">
                  {service.description}
                </p>

                {/* CTA Button */}
                <div className="mt-auto">
                  <Link href={`/services/${service.id}`} className="block">
                    <span className="group/btn bg-white/10 hover:bg-white/20 w-full py-3 px-4 rounded-xl text-sm font-medium inline-block text-center text-white transition-all duration-300 hover:shadow-lg backdrop-blur-sm border border-white/20">
                      Learn More
                      <span className="inline-block ml-2 transform group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
