'use client';

import { Rocket, Pencil, Search, MessageCircle, Palette, Globe, ArrowRight, Code, Printer, Target, Cpu, Zap, Users } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Define proper TypeScript interfaces
interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  slug: string;
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
    slug: 'branding-identity'
  },
  {
    icon: Rocket,
    title: 'Creative Strategy',
    description: 'Every great idea starts with a vision we make that vision unstoppable. Through data-driven insights and emotional storytelling, we craft strategies that give your brand meaning, momentum, and magic.',
    slug: 'creative-work'
  },
  {
    icon: Pencil,
    title: 'Content Creation',
    description: 'Ideas are powerful only when they move people. Our creative team transforms your thoughts into visuals, campaigns, and experiences that spark emotion, start conversations, and leave a mark.',
    slug: 'content-creation'
  },
  {
    icon: Globe,
    title: 'AI Videos',
    description: 'Step into the future of storytelling. With AI-powered video creation, we produce unique, fast, and captivating content that turns your brand\'s story into a stunning visual experience.',
    slug: 'ai-videos'
  },
  {
    icon: Search,
    title: 'SEO',
    description: 'Visibility is the first step to victory. We use smart SEO strategies to ensure your audience finds you first and remembers you forever. Drive traffic, trust, and true growth.',
    slug: 'seo'
  },
  {
    icon: MessageCircle,
    title: 'Performance Marketing',
    description: 'Marketing that performs not just promises. We turn clicks into loyal customers through data-backed ad campaigns that maximize conversions, visibility, and measurable results.',
    slug: 'performance-marketing'
  },
  {
    icon: Code,
    title: 'Website Development',
    description: 'Transform your digital presence with custom websites that combine stunning design with seamless functionality. We build responsive, fast-loading sites that drive engagement and conversions.',
    slug: 'website-development'
  },
  {
    icon: Printer,
    title: 'All Print Productions',
    description: 'From business cards to large format prints, we deliver high-quality print materials that make your brand tangible and memorable across all physical media.',
    slug: 'all-print-productions'
  },
  {
    icon: Target,
    title: 'Strategy & Vision',
    description: 'Develop clear strategic roadmaps that align with your business goals. We help you define your vision and create actionable plans to achieve sustainable growth.',
    slug: 'pillar-strategy-vision'
  },
  {
    icon: Cpu,
    title: 'Technology Integration',
    description: 'Seamlessly integrate cutting-edge technologies into your operations. We help you leverage the right tools to enhance efficiency and stay ahead of the competition.',
    slug: 'pillar-technology-integration'
  },
  {
    icon: Zap,
    title: 'Process Optimization',
    description: 'Streamline workflows and enhance operational efficiency through automation and smart process redesign. Reduce costs while improving quality and speed.',
    slug: 'pillar-process-optimization'
  },
  {
    icon: Users,
    title: 'Change Management',
    description: 'Empower your team with the skills and mindset for a successful digital transition. We ensure smooth adoption and maximize the value of your transformations.',
    slug: 'pillar-change-management'
  },
  {
    icon: MessageCircle,
    title: 'Customer Experience',
    description: 'Design user-centric experiences that increase engagement and satisfaction. We create seamless journeys that turn customers into loyal brand advocates.',
    slug: 'pillar-customer-experience'
  },
];

export default function ServicesSection() {
  const router = useRouter();

  const handleLearnMore = (slug: string) => {
    router.push(`/services/${slug}`);
  };

  // Split services into two groups for desktop
  const firstRowServices = services.slice(0, Math.ceil(services.length / 2));
  const secondRowServices = services.slice(Math.ceil(services.length / 2));

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
                <ServiceCard 
                  key={`mobile-1-${index}`} 
                  service={service} 
                  mobile 
                  onLearnMore={handleLearnMore}
                />
              ))}
              {/* Duplicate for seamless loop */}
              {services.slice(0, 3).map((service, index) => (
                <ServiceCard 
                  key={`mobile-1-copy-${index}`} 
                  service={service} 
                  mobile 
                  onLearnMore={handleLearnMore}
                />
              ))}
            </div>
          </div>

          {/* Second Row - Scroll Right to Left */}
          <div aria-label="Second Service Row" className="relative overflow-hidden">
            <div aria-label="Scrolling Services Right" className="flex animate-marquee-mobile-reverse gap-4 py-2">
              {services.slice(3).map((service, index) => (
                <ServiceCard 
                  key={`mobile-2-${index}`} 
                  service={service} 
                  mobile 
                  onLearnMore={handleLearnMore}
                />
              ))}
              {/* Duplicate for seamless loop */}
              {services.slice(3).map((service, index) => (
                <ServiceCard 
                  key={`mobile-2-copy-${index}`} 
                  service={service} 
                  mobile 
                  onLearnMore={handleLearnMore}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Layout - Two Rows Scrolling Opposite Directions */}
        <div aria-label="Desktop Services View" className="hidden lg:block space-y-8">
          {/* First Row - Scroll Left to Right */}
          <div aria-label="First Desktop Service Row" className="relative overflow-hidden">
            <div aria-label="Scrolling Services Left" className="flex animate-marquee-desktop gap-6 py-2 hover-animation-pause">
              {firstRowServices.map((service, index) => (
                <ServiceCard 
                  key={`desktop-1-${index}`} 
                  service={service} 
                  onLearnMore={handleLearnMore}
                />
              ))}
              {/* Duplicate for seamless loop */}
              {firstRowServices.map((service, index) => (
                <ServiceCard 
                  key={`desktop-1-copy-${index}`} 
                  service={service} 
                  onLearnMore={handleLearnMore}
                />
              ))}
            </div>
          </div>

          {/* Second Row - Scroll Right to Left */}
          <div aria-label="Second Desktop Service Row" className="relative overflow-hidden">
            <div aria-label="Scrolling Services Right" className="flex animate-marquee-desktop-reverse gap-6 py-2 hover-animation-pause">
              {secondRowServices.map((service, index) => (
                <ServiceCard 
                  key={`desktop-2-${index}`} 
                  service={service} 
                  onLearnMore={handleLearnMore}
                />
              ))}
              {/* Duplicate for seamless loop */}
              {secondRowServices.map((service, index) => (
                <ServiceCard 
                  key={`desktop-2-copy-${index}`} 
                  service={service} 
                  onLearnMore={handleLearnMore}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes marquee-desktop {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-100% / 2));
            }
          }

          @keyframes marquee-desktop-reverse {
            0% {
              transform: translateX(calc(-100% / 2));
            }
            100% {
              transform: translateX(0);
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

          .animate-marquee-desktop {
            animation: marquee-desktop 25s linear infinite;
            width: max-content;
          }

          .animate-marquee-desktop-reverse {
            animation: marquee-desktop-reverse 25s linear infinite;
            width: max-content;
          }

          .animate-marquee-mobile {
            animation: marquee-mobile 20s linear infinite;
            width: max-content;
          }

          .animate-marquee-mobile-reverse {
            animation: marquee-mobile-reverse 30s linear infinite;
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
function ServiceCard({ service, mobile = false, onLearnMore }: ServiceCardProps & { onLearnMore?: (slug: string) => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = service.icon;

  const handleLearnMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLearnMore?.(service.slug);
  };

  const handleCardClick = () => {
    onLearnMore?.(service.slug);
  };
  
  return (
    <div
      aria-label={`${service.title} Service`}
      className={`relative ${
        mobile 
          ? 'min-w-[200px] sm:min-w-[240px]' 
          : 'min-w-[240px]'  // Reduced from 320px to 280px
      } bg-[#685885] backdrop-blur-sm rounded-2xl p-5 sm:p-6 flex-shrink-0 transition-all duration-300 ease-in-out ${
        isHovered ? 'transform scale-105 shadow-2xl shadow-purple-500/20' : 'shadow-lg shadow-purple-500/10'
      } cursor-pointer`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Content Container */}
      <div aria-label="Service Content" className="relative z-10 h-full flex flex-col">
        {/* Icon */}
        <div aria-label="Service Icon" className="mb-3 sm:mb-4 flex justify-center">
          <div 
            aria-hidden="true" 
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center transition-all duration-300 ease-in-out ${
              isHovered ? 'bg-white transform scale-110' : 'bg-[#b5a6d0]'
            }`}
          >
            <Icon 
              className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300 ease-in-out ${
                isHovered ? 'text-[#685885]' : 'text-white'
              }`} 
              strokeWidth={1.5} 
            />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-white text-center mb-2 sm:mb-3 line-clamp-2">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-purple-200 text-center text-xs leading-relaxed flex-grow mb-3 line-clamp-3">
          {service.description}
        </p>

        {/* Learn More Button */}
        <div className={`mt-auto transition-all duration-300 ease-in-out ${
          mobile 
            ? 'opacity-100 translate-y-0' 
            : `opacity-0 translate-y-4 ${isHovered ? 'opacity-100 translate-y-0' : ''}`
        }`}>
          <button
            aria-label={`Learn more about ${service.title}`}
            className={`
              w-full py-2 px-3 rounded-lg font-semibold text-xs sm:text-sm
              transition-all duration-300 ease-in-out flex items-center justify-center gap-1
              bg-white text-[#685885] hover:bg-purple-100 hover:scale-105
            `}
            onClick={handleLearnMoreClick}
          >
            Learn More
            <ArrowRight 
              className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 ease-in-out ${
                isHovered ? 'transform translate-x-1' : ''
              }`} 
              strokeWidth={2} 
            />
          </button>
        </div>
      </div>

      {/* Border Effect */}
      <div 
        aria-hidden="true" 
        className={`absolute inset-0 rounded-2xl border-2 transition-all duration-300 ease-in-out ${
          isHovered ? 'border-white/30 shadow-2xl shadow-purple-500/20' : 'border-white/10'
        }`} 
      />
    </div>
  );
}