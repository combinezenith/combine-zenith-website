'use client';

import Image from 'next/image';
import { doc, onSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { notFound } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import ServicePillars from '@/app/(components)/ServicePillars';
import ServiceApproach from '@/app/(components)/FAQ';
import CTASectionEnhanced from '@/app/(components)/CTASection';
import ServicePricingPlan, { PricingPackage } from '@/app/(components)/ServicePricingPlan';

type ApproachStep = {
  id: string;
  title: string;
  content: string;
};

type Service = {
  id: string;
  name: string;
  description?: string;
  image?: string;
  skills?: string[];
  approach?: ApproachStep[];
  pillars?: ApproachStep[];
  pricingPackages?: PricingPackage[];
};

export default function DynamicServices() {
  const params = useParams();
  const id = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const docRef = doc(db, "services", id);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setService({ id: docSnap.id, ...(docSnap.data() as DocumentData) } as Service);
      } else {
        setService(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching service:", error);
      setService(null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  if (loading) {
    return (
      <section className="relative w-full">
        <div className="mt-20 h-96 bg-gray-200 animate-pulse"></div>
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="h-12 bg-gray-200 animate-pulse mb-4"></div>
            <div className="h-6 bg-gray-200 animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!service) return notFound();

  return (
    <section aria-labelledby="service-title" className="relative w-full">
      <div className="mt-20">
        <Image
          src={service.image || '/laptop-hero.jpg'}
          alt={service.name}
          width={900}
          height={900}
          className="object-cover w-full h-96 block"
          priority
        />
      </div>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 id="service-title" className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight">
              {service.name}
            </h1>
            <p className="text-[#b589fc] text-center sm:text-lg md:text-xl">
              {service.description}
            </p>
          </div>
        </div>

      {/* Service-specific pillars */}
      <ServicePillars pillars={service.pillars} />
      <ServicePricingPlan pricingPackages={service.pricingPackages || []}/>
  {/* Proven approach / accordion */}
  <ServiceApproach approach={service.approach} />

  <CTASectionEnhanced/>

    </section>
  );
}
