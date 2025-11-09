'use client';

import { Rocket, Pencil, Search, MessageCircle, Palette, Globe, ArrowRight, Code, Printer, Target, Cpu, Zap, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Image from 'next/image';
import TextType from './TextType';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Define proper TypeScript interfaces
interface Service {
  id?: string;
  icon: LucideIcon;
  title: string;
  description: string;
  slug: string;
  image?: string;
}

interface ServiceButtonProps {
  service: Service;
  onClick: (service: Service) => void;
  isSelected: boolean;
}

const iconMap: { [key: string]: LucideIcon } = {
  Palette,
  Rocket,
  Pencil,
  Globe,
  Search,
  MessageCircle,
  Code,
  Printer,
  Target,
  Cpu,
  Zap,
  Users,
};

export default function ServicesSection() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const servicesScrollRef = useRef<HTMLDivElement>(null);
  const selectedCardRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'services'));
        const servicesData: Service[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const iconName = data.icon || 'Palette'; // Default icon
          const IconComponent = iconMap[iconName] || Palette;
          servicesData.push({
            id: doc.id,
            icon: IconComponent,
            title: data.name || data.title || '',
            description: data.description || '',
            slug: data.slug || '',
            image: data.image || '',
          });
        });
        setServices(servicesData);
        if (servicesData.length > 0) {
          setSelectedService(servicesData[0]); // Default to first service
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  const changeService = (newService: Service) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedService(newService);
      setTimeout(() => setIsTransitioning(false), 300);
    }, 300);
  };

  const changeServiceCallback = useCallback((prev: Service | null) => {
    const currentIndex = prev ? services.findIndex(s => s.slug === prev.slug) : 0;
    const nextIndex = (currentIndex + 1) % services.length;
    const nextService = services[nextIndex];
    changeService(nextService);
    return nextService;
  }, [services]);

  useEffect(() => {
    if (services.length > 0) {
      const interval = setInterval(() => {
        setSelectedService(changeServiceCallback);
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [services, changeServiceCallback]);

  const handleServiceClick = (service: Service) => {
    changeService(service);
  };

  const handleLearnMore = (slug: string) => {
    router.push(`/services/${slug}`);
  };

  // Smooth scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (scrollContainerRef.current && scrollContainerRef.current.contains(e.target as Node)) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          scrollLeft();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          scrollRight();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

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

      // Animate services horizontal scroll container
      if (servicesScrollRef.current) {
        gsap.fromTo(servicesScrollRef.current,
          { opacity: 0, x: -100 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: servicesScrollRef.current,
              start: "top 75%",
              end: "bottom 25%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // Animate selected service card
      if (selectedCardRef.current) {
        gsap.fromTo(selectedCardRef.current,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: selectedCardRef.current,
              start: "top 75%",
              end: "bottom 25%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} aria-label="Our Services" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div aria-label="Services Container" className="container mx-auto max-w-7xl">
        {/* Header */}
        <div ref={headerRef} aria-label="Services Header" className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-6 px-2">
            <TextType
              text={["Building Brands.", "Driving Growth.", "Creating Impact."]}
              typingSpeed={75}
              pauseDuration={1500}
              showCursor={true}
              cursorCharacter="|"
            />
          </h2>
          <p className="text-purple-200 text-sm sm:text-base md:text-lg lg:text-xl max-w-3xl mx-auto px-4 sm:px-6 leading-relaxed">
            We deliver integrated marketing solutions that combine creativity with intelligence ensuring every project speaks with purpose and performs with excellence. Our expertise blends creativity, strategy, and technology to turn ideas into stories, and stories into movements. Every brand we touch is built to inspire, engage, and lead with purpose.
          </p>
        </div>

        {/* Horizontal Scrollable Services */}
        <div ref={servicesScrollRef} className="relative mb-8 sm:mb-12">
          {/* Left Arrow - Hidden on mobile */}
          <button
            onClick={scrollLeft}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full p-2 transition-all duration-300 hover:scale-110"
            aria-label="Scroll services left"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          {/* Right Arrow - Hidden on mobile */}
          <button
            onClick={scrollRight}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full p-2 transition-all duration-300 hover:scale-110"
            aria-label="Scroll services right"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide gap-3 sm:gap-4 pb-4 px-2 md:px-12 scroll-smooth"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
            role="tablist"
            aria-label="Services navigation"
          >
            {services.map((service, index) => (
              <div key={index} className="flex-shrink-0">
                <ServiceButton
                  service={service}
                  onClick={handleServiceClick}
                  isSelected={selectedService?.slug === service.slug}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Selected Service Card */}
        {selectedService && (
          <div ref={selectedCardRef} className={`max-w-5xl mx-auto px-2 transition-all duration-500 ease-in-out ${isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
            <div className="bg-[#685885] backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg shadow-purple-500/10">
              <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 h-full">
                {/* Left Side: Name, Description, CTA */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
                    {selectedService.title}
                  </h3>
                  <p className="text-purple-200 text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6 flex-grow">
                    {selectedService.description}
                  </p>
                  <button
                    onClick={() => handleLearnMore(selectedService.id || selectedService.slug)}
                    className="bg-white text-[#685885] px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-purple-100 transition-colors duration-300 flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
                  </button>
                </div>

                {/* Right Side: Image */}
                <div className="flex-1 lg:max-w-md">
                  {selectedService.image ? (
                    <div className="relative w-full h-48 sm:h-64 md:h-72 lg:h-80">
                      <Image
                        src={selectedService.image}
                        alt={selectedService.title}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 sm:h-64 md:h-72 lg:h-80 bg-[#b5a6d0] rounded-lg flex items-center justify-center">
                      <selectedService.icon className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white" strokeWidth={1.5} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// Service Button Component
function ServiceButton({ service, onClick, isSelected }: ServiceButtonProps) {
  return (
    <button
      onClick={() => onClick(service)}
      className={`flex items-center justify-center p-3 sm:p-4 rounded-lg transition-all duration-300 ease-in-out min-w-[120px] sm:min-w-[140px] md:min-w-[160px] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent ${
        isSelected
          ? 'bg-[#685885] text-white hover:bg-[#7a5f95] shadow-md shadow-purple-500/10'
          : 'bg-white text-[#685885] shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30'
      }`}
      role="tab"
      aria-selected={isSelected}
      tabIndex={isSelected ? 0 : -1}
    >
      {service.title}
    </button>
  );
}
