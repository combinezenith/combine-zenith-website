'use client';

import { Rocket, Pencil, Search, MessageCircle, Palette, Globe, ArrowRight, Code, Printer, Target, Cpu, Zap, Users } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../config/firebase';

import { collection, getDocs } from 'firebase/firestore';
import Image from 'next/image';

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

  useEffect(() => {
    if (services.length > 0) {
      const interval = setInterval(() => {
        setSelectedService(changeServiceCallback);
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [services]);

  const changeService = (newService: Service) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedService(newService);
      setTimeout(() => setIsTransitioning(false), 300);
    }, 300);
  };

  const changeServiceCallback = (prev: Service | null) => {
    const currentIndex = prev ? services.findIndex(s => s.slug === prev.slug) : 0;
    const nextIndex = (currentIndex + 1) % services.length;
    const nextService = services[nextIndex];
    changeService(nextService);
    return nextService;
  };

  const handleServiceClick = (service: Service) => {
    changeService(service);
  };

  const handleLearnMore = (slug: string) => {
    router.push(`/services/${slug}`);
  };

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

        {/* Services Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
          {services.map((service, index) => (
            <ServiceButton
              key={index}
              service={service}
              onClick={handleServiceClick}
              isSelected={selectedService?.slug === service.slug}
            />
          ))}
        </div>

        {/* Selected Service Card */}
        {selectedService && (
          <div className={`bg-[#685885] backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg shadow-purple-500/10 transition-all duration-500 ease-in-out ${
            isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
          }`}>
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Side: Name, Description, CTA */}
              <div className="flex-1">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  {selectedService.title}
                </h3>
                <p className="text-purple-200 text-base sm:text-lg leading-relaxed mb-6">
                  {selectedService.description}
                </p>
                <button
                  onClick={() => handleLearnMore(selectedService.id || selectedService.slug)}
                  className="bg-white text-[#685885] px-6 py-3 rounded-lg font-semibold hover:bg-purple-100 transition-colors duration-300 flex items-center gap-2"
                >
                  Learn More
                  <ArrowRight className="w-5 h-5" strokeWidth={2} />
                </button>
              </div>
              {/* Right Side: Image */}
              <div className="flex-1">
                {selectedService.image ? (
                  <Image
                    src={selectedService.image}
                    alt={selectedService.title}
                    width={600}
                    height={400}
                    className="w-full h-64 sm:h-80 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-64 sm:h-80 bg-[#b5a6d0] rounded-lg flex items-center justify-center">
                    <selectedService.icon className="w-16 h-16 text-white" strokeWidth={1.5} />
                  </div>
                )}
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
      className={`flex items-center justify-center p-4 rounded-lg transition-all duration-300 ease-in-out ${
        isSelected
          ? 'bg-[#685885] text-white hover:bg-[#7a5f95] shadow-md shadow-purple-500/10'
          : 'bg-white text-[#685885] shadow-lg shadow-purple-500/20'
      }`}
    >
      <span className="text-sm font-medium text-center">{service.title}</span>
    </button>
  );
}