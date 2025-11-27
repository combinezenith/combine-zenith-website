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
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch services for categories
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
      const cards = cardsRef.current.querySelectorAll('.portfolio-card');

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
  }, [loading, activeCategory]);

  // Get category names from services
  const categories = ['All', ...services.map(service => service.name)];

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
  };

  // Filter portfolios based on active category
  const filteredPortfolios = activeCategory === 'All'
    ? portfolios
    : portfolios.filter(portfolio => {
        // Check if portfolio has any services
        if (!portfolio.services || portfolio.services.length === 0) {
          return false;
        }
        
        // Match service names - handle variations like "Ai Videos" vs "AI Video Creation"
        return portfolio.services.some(service => {
          const serviceStr = typeof service === 'string' ? service.toLowerCase().trim() : '';
          const categoryStr = (activeCategory || '').toLowerCase().trim();
          
          // Exact match first
          if (serviceStr === categoryStr) return true;
          
          // Check if either contains the other (for variations)
          if (serviceStr.includes(categoryStr) || categoryStr.includes(serviceStr)) return true;
          
          // Handle "AI Video" variations - normalize both strings
          const normalizedService = serviceStr.replace(/\s+/g, ' ');
          const normalizedCategory = categoryStr.replace(/\s+/g, ' ');
          
          return normalizedService.includes(normalizedCategory) || 
                 normalizedCategory.includes(normalizedService);
        });
      });

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Categories Section */}
        <div className="py-12 lg:py-16">
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center items-center">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-6 py-3 sm:px-8 sm:py-3.5 rounded-full text-sm sm:text-base font-medium transition-all duration-300 whitespace-nowrap outline-none transform hover:scale-105 ${
                  activeCategory === category
                    ? 'bg-white/20 text-white shadow-lg shadow-white/20 border border-white/30'
                    : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:border-white/20'
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mx-4 md:mx-8 lg:mx-12 my-8 p-4 md:p-6 text-center justify-center items-center"
        >
          {loading ? (
            <SkeletonLoader count={6} className="h-80" />
          ) : filteredPortfolios.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 max-w-md w-full">
                <LuFolder className="w-16 h-16 text-white/30 mx-auto mb-4" strokeWidth={1.5} />
                <h3 className="text-xl font-semibold text-white mb-2">No Projects Available</h3>
                <p className="text-gray-400 text-sm">
                  There are no projects in the &apos;{activeCategory}&apos; category yet.
                </p>
              </div>
            </div>
          ) : (
            filteredPortfolios.map((portfolio) => {
              const Icon = LuFolder;
              return (
                <div
                  key={portfolio.id}
                  className="portfolio-card group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-white/10 overflow-hidden flex flex-col hover:border-white/30"
                >
                  {/* Subtle background overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Image section */}
                  <div className="relative w-full h-44 md:h-48 lg:h-48 overflow-hidden">
                    <Image
                      src={portfolio.image || '/logo.jpg'}
                      alt={portfolio.name || 'Portfolio Image'}
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
                        {portfolio.name}
                      </h3>
                    </div>

                    {/* Services Tags */}
                    <div className="flex flex-wrap gap-2 justify-center mb-6">
                      {portfolio.services && portfolio.services.length > 0 ? (
                        portfolio.services.slice(0, 3).map((service, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-white/10 text-gray-300 text-xs rounded-full border border-white/20 group-hover:bg-white/15 group-hover:text-white transition-all duration-300"
                          >
                            {service}
                          </span>
                        ))
                      ) : (
                        <span className="px-3 py-1 bg-white/10 text-gray-300 text-xs rounded-full border border-white/20">
                          Portfolio
                        </span>
                      )}
                    </div>

                    {/* CTA Button */}
                    <div className="mt-auto">
                      <Link href={`/portfolio/${portfolio.id}`} className="block">
                        <span className="group/btn bg-white/10 hover:bg-white/20 w-full py-3 px-4 rounded-xl text-sm font-medium inline-block text-center text-white transition-all duration-300 hover:shadow-lg backdrop-blur-sm border border-white/20">
                          View Project
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
      </div>
    </div>
  );
}