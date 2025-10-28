'use client';

import { Rocket, Pencil, Search, MessageCircle, Palette, Globe } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

// Define proper TypeScript interfaces
interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface ServiceCardProps {
  service: Service;
  mobile?: boolean;
}

const services: Service[] = [
  {
    icon: Rocket,
    title: 'Digital Strategy',
    description: 'Comprehensive planning to align your marketing with business goals for maximum impact.',
  },
  {
    icon: Pencil,
    title: 'Content Creation',
    description: 'Engaging content across all platforms, from captivating blogs to high-quality videos and visuals.',
  },
  {
    icon: Search,
    title: 'SEO & SEM',
    description: 'Boost online visibility and drive organic and paid traffic effectively to your website.',
  },
  {
    icon: MessageCircle,
    title: 'Social Media Marketing',
    description: "Build a vibrant community and amplify your brand's message on key social platforms.",
  },
  {
    icon: Palette,
    title: 'Brand Identity',
    description: 'Crafting a unique and memorable brand identity that resonates deeply with your target audience.',
  },
  {
    icon: Globe,
    title: 'Web Development',
    description: 'Building high-performance, user-friendly digital experiences that convert visitors into customers.',
  },
];

export default function ServicesSection() {
  return (
    <section aria-label='' className="py-20 px-4 sm:px-6">
      <div aria-label='' className="container mx-auto max-w-7xl">
        {/* Header */}
        <div aria-label='' className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            Our Expertise, Your Growth.
          </h2>
          <p className="text-purple-200 text-base sm:text-lg md:text-xl max-w-3xl mx-auto px-2">
            We offer a full spectrum of digital marketing services designed to elevate your
            brand, engage your audience, and drive measurable results.
          </p>
        </div>

        {/* Mobile Layout - Two Rows */}
        <div aria-label='' className="block lg:hidden space-y-6">
          {/* First Row - Scroll Left to Right */}
          <div aria-label='' className="relative overflow-hidden">
            <div aria-label='' className="flex animate-marquee-mobile gap-4 py-2">
              {services.slice(0, 3).map((service, index) => (
                <ServiceCard key={`mobile-1-${index}`} service={service} mobile />
              ))}
              {/* Duplicate for seamless loop */}
              {services.slice(0, 3).map((service, index) => (
                <ServiceCard key={`mobile-1-copy-${index}`} service={service} mobile />
              ))}
            </div>
          </div>

          {/* Second Row - Scroll Right to Left */}
          <div aria-label='' className="relative overflow-hidden">
            <div aria-label='' className="flex animate-marquee-mobile-reverse gap-4 py-2">
              {services.slice(3).map((service, index) => (
                <ServiceCard key={`mobile-2-${index}`} service={service} mobile />
              ))}
              {/* Duplicate for seamless loop */}
              {services.slice(3).map((service, index) => (
                <ServiceCard key={`mobile-2-copy-${index}`} service={service} mobile />
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Layout - Single Row */}
        <div aria-label='' className="hidden lg:block relative overflow-hidden">
          <div aria-label='' className="flex animate-marquee-smooth gap-6 py-2">
            {services.map((service, index) => (
              <ServiceCard key={`desktop-${index}`} service={service} />
            ))}
            {/* Duplicate for seamless loop */}
            {services.map((service, index) => (
              <ServiceCard key={`desktop-copy-${index}`} service={service} />
            ))}
          </div>
        </div>

        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes marquee-smooth {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-100% / 2));
            }
          }

          @keyframes marquee-mobile {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-100% / 2));
            }
          }

          @keyframes marquee-mobile-reverse {
            0% {
              transform: translateX(calc(-100% / 2));
            }
            100% {
              transform: translateX(0);
            }
          }

          .animate-marquee-smooth {
            animation: marquee-smooth 15s linear infinite;
            width: max-content;
          }

          .animate-marquee-mobile {
            animation: marquee-mobile 10s linear infinite;
            width: max-content;
          }

          .animate-marquee-mobile-reverse {
            animation: marquee-mobile-reverse 10s linear infinite;
            width: max-content;
          }
        `}</style>
      </div>
    </section>
  );
}

// Separate Service Card Component with proper TypeScript types
function ServiceCard({ service, mobile = false }: ServiceCardProps) {
  const Icon = service.icon;
  
  return (
    <div
      className={`relative ${
        mobile 
          ? 'min-w-[280px] sm:min-w-[300px]' 
          : 'min-w-[320px]'
      } bg-[#685885] backdrop-blur-sm rounded-2xl p-6 sm:p-8 flex-shrink-0`}
    >
      {/* Content Container */}
      <div aria-label='' className="relative z-10">
        {/* Icon */}
        <div aria-label='' className="mb-4 sm:mb-6 flex justify-center">
          <div aria-label='' className="w-12 h-12 sm:w-16 sm:h-16 bg-[#b5a6d0] rounded-lg flex items-center justify-center">
            <Icon 
              className="w-6 h-6 sm:w-8 sm:h-8 text-white" 
              strokeWidth={1.5} 
            />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-white text-center mb-3 sm:mb-4">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-purple-200 text-center text-xs sm:text-sm leading-relaxed">
          {service.description}
        </p>
      </div>

      {/* Border Effect */}
      <div aria-label='' className="absolute inset-0 rounded-2xl border-2 border-white/10 shadow-lg shadow-purple-500/10" />
    </div>
  );
}