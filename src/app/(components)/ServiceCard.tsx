"use client";

import Image from 'next/image';
import { IconType } from 'react-icons';
import { LuLightbulb, LuTarget, LuPalette, LuVideo, LuSearch, LuTrendingUp, LuCode, LuPrinter } from 'react-icons/lu';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, getDocs, DocumentData } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Service {
  id: string;
  title: string;
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

  if (loading) {
    return <p className="text-center py-10 text-gray-300">Loading services...</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-4 md:mx-8 lg:mx-12 my-8 p-4 md:p-6 text-center justify-center items-center ">
      {services.map((service) => {
        const Icon = iconsMap[service.title] || LuLightbulb;
        return (
          <div
            key={service.id}
            className="group relative bg-[#685885] backdrop-blur-2xl bg-blend-multiply rounded-2xl transition-all duration-300 hover:scale-105 overflow-hidden flex flex-col"
          >
            <div className="w-full h-44 md:h-48 lg:h-48 relative">
              <Image
                src={service.image || '/logo.jpg'}
                alt={service.title}
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
                  {service.title}
                </h3>
              </div>

              <p className="text-purple-200 text-sm leading-relaxed mb-6">
                {service.description}
              </p>

              <div className="mt-auto">
                <Link href={`/services/${service.id}`} className="block">
                  <span className="bg-[#b5a6d0] w-full p-3 rounded-full text-sm font-medium inline-block text-center">
                    Learn More
                  </span>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
