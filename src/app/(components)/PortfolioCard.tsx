"use client";
import Image from 'next/image';
import { LuFolder } from 'react-icons/lu';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, getDocs, DocumentData } from 'firebase/firestore';
import { db } from '../config/firebase';
import SkeletonLoader from './SkeletonLoader';

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
    <div className="min-h-screen relative overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Categories Section */}
        <div className="py-16 lg:py-24">
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center items-center">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-6 py-3 sm:px-8 sm:py-3.5 rounded-full text-sm sm:text-base font-medium border-none cursor-pointer transition-all duration-300 whitespace-nowrap outline-none ${
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8 p-4 md:p-6 text-center justify-center items-center">
          {loading ? (
            <SkeletonLoader count={6} className="h-80" />
          ) : (
            filteredPortfolios.map((portfolio) => {
              const Icon = LuFolder;
              return (
                <Link
                  key={portfolio.id}
                  href={`/portfolio/${portfolio.id}`}
                  className="group relative bg-[#685885] backdrop-blur rounded-2xl transition-all duration-300 hover:scale-105 overflow-hidden flex flex-col cursor-pointer"
                >
                  <div className="w-full h-44 md:h-48 lg:h-48 relative">
                    <Image
                      src={portfolio.image || '/logo.jpg'}
                      alt={portfolio.name || 'Portfolio'}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 md:p-6 flex-1 flex flex-col">
                    <div className="mb-4 flex items-center gap-3 justify-center">
                      <div className="h-12 w-12 bg-[#b5a6d0] rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-white">
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
                          className="px-3 py-1 bg-[#b5a6d0]/30 text-purple-200 text-xs rounded-full border border-purple-300/20"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
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