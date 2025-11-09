"use client";
import Image from 'next/image';
import { LuFolder } from 'react-icons/lu';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { collection, getDocs, DocumentData } from 'firebase/firestore';
import { db } from '../config/firebase';
import SkeletonLoader from './SkeletonLoader';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Portfolio {
  id: string;
  slug?: string;
  name?: string;
  description?: string;
  image?: string;
  services?: string[];
  creativeApproach?: string;
  challenges?: string;
  clientWords?: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  image?: string;
  skills?: string[];
  approach?: string[];
  status?: string;
}

export default function PortfolioCard() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch services
        const servicesSnapshot = await getDocs(collection(db, "services"));
        const servicesData = servicesSnapshot.docs.map(
          (d) => ({ id: d.id, ...(d.data() as DocumentData) } as Service)
        );
        setServices(servicesData);

        // Fetch portfolios
        const portfoliosSnapshot = await getDocs(collection(db, "portfolios"));
        const portfoliosData = portfoliosSnapshot.docs.map(
          (d) => ({ id: d.id, ...(d.data() as DocumentData) } as Portfolio)
        );
        setPortfolios(portfoliosData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && cardsRef.current) {
      // Animate cards on scroll
      gsap.fromTo(cardsRef.current.children,
        {
          opacity: 0,
          y: 50,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
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
  }, [loading, portfolios]);

  // Get category names from services
  const categories = ['All', ...services.map(service => service.name)];

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    console.log('Selected category:', category);
  };

  // Filter portfolios based on active category
  const filteredPortfolios = activeCategory === 'All'
    ? portfolios
    : portfolios.filter(portfolio =>
        portfolio.services?.some(service =>
          service.toLowerCase().includes(activeCategory.toLowerCase())
        )
      );

  return (
    <div className="min-h-screen relative overflow-x-hidden" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Categories Section */}
        <div className="py-16 lg:py-24">
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center items-center">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-6 py-3 sm:px-8 sm:py-3.5 rounded-full text-sm sm:text-base font-medium border-none cursor-pointer transition-all duration-300 whitespace-nowrap outline-none transform hover:scale-105 ${
                  activeCategory === category
                    ? 'bg-gradient-to-br from-[#8b45c1] to-[#a855f7] border-transparent shadow-lg shadow-[#a855f7]/40 hover:-translate-y-0.5 text-white'
                    : 'bg-black text-white border border-white/10 hover:bg-[rgba(139,69,193,0.3)] hover:border-[rgba(168,85,247,0.5)] hover:-translate-y-0.5'
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Cards Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8 p-4 md:p-6 text-center justify-center items-center"
        >
          {loading ? (
            <SkeletonLoader count={6} className="h-80" />
          ) : (
            filteredPortfolios.map((portfolio) => {
              const Icon = LuFolder;
              return (
                <Link
                  key={portfolio.id}
                  href={`/portfolio/${portfolio.id}`}
                  className="group relative opacity-0 backdrop-blur-sm rounded-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 overflow-hidden flex flex-col cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-purple-500/20"
                >
                  {/* Animated Background Gradient */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Image Container with Parallax Effect */}
                  <div className="w-full h-44 md:h-48 lg:h-48 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                    <Image
                      src={portfolio.image || '/logo.jpg'}
                      alt={portfolio.name || 'Portfolio'}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Overlay Effects */}
                    <div className="absolute inset-0  opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  <div className="p-4 md:p-6 flex-1 flex flex-col relative z-10">
                    <div className="mb-4 flex items-center gap-3 justify-center">
                      <div className="h-12 w-12 rounded-lg flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300 shadow-lg">
                        <Icon className="w-6 h-6 text-white group-hover:text-[#685885] transition-colors duration-300" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-purple-200 transition-colors duration-300">
                        {portfolio.name}
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center">
                      {(portfolio.services && portfolio.services.length > 0
                        ? portfolio.services
                        : ['BRANDING', 'CONTENT', 'DESIGN', 'SOCIAL MEDIA']
                      ).map((service, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[#b5a6d0]/30 text-purple-200 text-xs rounded-full border border-purple-300/20 group-hover:bg-white/20 group-hover:border-purple-300/40 transition-all duration-300 transform hover:scale-105"
                        >
                          {service}
                        </span>
                      ))}
                    </div>

                    {/* Hover Reveal Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
