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

export default function PortfolioCard() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const snapshot = await getDocs(collection(db, "portfolios"));
        const data = snapshot.docs.map(
          (d) => ({ id: d.id, ...(d.data() as DocumentData) } as Portfolio)
        );
        setPortfolios(data);
      } catch (error) {
        console.error("Failed to fetch portfolios:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolios();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-4 md:mx-8 lg:mx-12 my-8 p-4 md:p-6 text-center justify-center items-center">
      {loading ? (
        <SkeletonLoader count={6} className="h-80" />
      ) : (
        portfolios.map((portfolio) => {
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
  );
}