'use client';

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
  video?: string;
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
  const [videoError, setVideoError] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);

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
        <div className="mt-20 h-96 bg-gray-900 animate-pulse flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
        </div>
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="h-12 bg-gray-700 animate-pulse mb-4 rounded"></div>
            <div className="h-6 bg-gray-700 animate-pulse rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!service) return notFound();

  return (
    <section aria-labelledby="service-title" className="relative w-full">
      {/* Hero Video Section - Autoplay with Audio */}
      <div className="mt-20">
        {service.video ? (
          <div className="relative bg-black">
            {videoLoading && !videoError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            )}
            {!videoError ? (
              <video
                src={service.video}
                className="object-cover w-full h-96 block [&::-webkit-media-controls]:hidden [&::-webkit-media-controls-enclosure]:hidden"
                autoPlay
                loop
                playsInline
                muted
                onLoadedData={() => setVideoLoading(false)}
                onError={() => {
                  setVideoError(true);
                  setVideoLoading(false);
                }}
              >
                <track kind="captions" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="w-full h-96 bg-gray-800 flex items-center justify-center text-white">
                <div className="text-center">
                  <p className="text-lg mb-2">⚠️ Video could not be loaded</p>
                  <p className="text-sm text-gray-400">Path: {service.video}</p>
                  <p className="text-xs text-gray-500 mt-1">Make sure the file exists in the public folder</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-96 bg-gray-800 flex items-center justify-center text-white">
            <div className="text-center">
              <p className="text-lg mb-2">📹 No video available</p>
              <p className="text-sm text-gray-400">Please try refreshing the page</p>
            </div>
          </div>
        )}
      </div>

      {/* Service Title and Description */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 
            id="service-title" 
            className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-4"
          >
            {service.name}
          </h1>
          <p className="text-[#b589fc] text-center sm:text-lg md:text-xl max-w-4xl mx-auto">
            {service.description}
          </p>
        </div>
      </div>

      {/* Service-specific pillars */}
      {service.pillars && service.pillars.length > 0 && (
        <ServicePillars pillars={service.pillars} />
      )}

      {/* Pricing Packages */}
      {service.pricingPackages && Object.keys(service.pricingPackages).length > 0 && (
        <ServicePricingPlan pricingPackages={service.pricingPackages || []} />
      )}

      {/* Proven approach / FAQ */}
      {service.approach && service.approach.length > 0 && (
        <ServiceApproach approach={service.approach} />
      )}

      {/* CTA Section */}
      <CTASectionEnhanced />
    </section>
  );
}