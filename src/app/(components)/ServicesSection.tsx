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
    icon: Palette,
    title: 'Brand Identity',
    description: 'Your brand is more than a logo it\'s a feeling, a promise, and a first impression that lasts. From logo design to full visual systems, we shape identities that speak with confidence and stand out in every crowd.',
  },
  {
    icon: Rocket,
    title: 'Creative Strategy',
    description: 'Every great idea starts with a vision we make that vision unstoppable. Through data-driven insights and emotional storytelling, we craft strategies that give your brand meaning, momentum, and magic.',
  },
  {
    icon: Pencil,
    title: 'Content Creation',
    description: 'Ideas are powerful only when they move people. Our creative team transforms your thoughts into visuals, campaigns, and experiences that spark emotion, start conversations, and leave a mark.',
  },
  {
    icon: Globe,
    title: 'AI Videos',
    description: 'Step into the future of storytelling. With AI-powered video creation, we produce unique, fast, and captivating content that turns your brand\'s story into a stunning visual experience.',
  },
  {
    icon: Search,
    title: 'SEO',
    description: 'Visibility is the first step to victory. We use smart SEO strategies to ensure your audience finds you first and remembers you forever. Drive traffic, trust, and true growth.',
  },
  {
    icon: MessageCircle,
    title: 'Performance Marketing',
    description: 'Marketing that performs not just promises. We turn clicks into loyal customers through data-backed ad campaigns that maximize conversions, visibility, and measurable results.',
  },
];

export default function ServicesSection() {
  return (
    <section aria-label="Our Services" className="py-20 px-4 sm:px-6">
      <div aria-label="Services Container" className="container mx-auto max-w-7xl">
        {/* Header */}
        <div aria-label="Services Header" className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            Building Brands. Driving Growth. Creating Impact.
          </h2>
          <p className="text-purple-200 text-base sm:text-lg md:text-xl max-w-3xl mx-auto px-2">
            We deliver integrated marketing solutions that combine creativity with intelligence ensuring every project speaks with purpose and performs with excellence. Our expertise blends creativity, strategy, and technology to turn ideas into stories, and stories into movements. Every brand we touch is built to inspire, engage, and lead with purpose.
          </p>
        </div>

        {/* Mobile Layout - Two Rows */}
        <div aria-label="Mobile Services View" className="block lg:hidden space-y-6">
          {/* First Row - Scroll Left to Right */}
          <div aria-label="First Service Row" className="relative overflow-hidden">
            <div aria-label="Scrolling Services Left" className="flex animate-marquee-mobile gap-4 py-2">
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
          <div aria-label="Second Service Row" className="relative overflow-hidden">
            <div aria-label="Scrolling Services Right" className="flex animate-marquee-mobile-reverse gap-4 py-2">
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
        <div aria-label="Desktop Services View" className="hidden lg:block relative overflow-hidden">
          <div aria-label="Scrolling Services" className="flex animate-marquee-smooth gap-6 py-2 hover-animation-pause">
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

          /* Hover pause only for desktop */
          @media (min-width: 1024px) {
            .hover-animation-pause:hover {
              animation-play-state: paused;
            }
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
      aria-label={`${service.title} Service`}
      className={`relative ${
        mobile 
          ? 'min-w-[280px] sm:min-w-[300px]' 
          : 'min-w-[320px]'
      } bg-[#685885] backdrop-blur-sm rounded-2xl p-6 sm:p-8 flex-shrink-0`}
    >
      {/* Content Container */}
      <div aria-label="Service Content" className="relative z-10">
        {/* Icon */}
        <div aria-label="Service Icon" className="mb-4 sm:mb-6 flex justify-center">
          <div aria-hidden="true" className="w-12 h-12 sm:w-16 sm:h-16 bg-[#b5a6d0] rounded-lg flex items-center justify-center">
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
      <div aria-hidden="true" className="absolute inset-0 rounded-2xl border-2 border-white/10 shadow-lg shadow-purple-500/10" />
    </div>
  );
}