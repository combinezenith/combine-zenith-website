import Link from 'next/link';
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

type WorkItem = {
  id: string;
  mediaType: 'image' | 'video';
  mediaPath: string;
  title: string;
  link: string;
};

type ServiceWorksGalleryProps = {
  works: WorkItem[];
};

const ServiceWorksGallery: React.FC<ServiceWorksGalleryProps> = ({ works }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -400,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 400,
        behavior: 'smooth'
      });
    }
  };

  if (!works || works.length === 0) {
    return (
      <section className="py-12 text-center text-purple-200">
        No works available to display.
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Title Section */}
      <div className="mb-8 sm:mb-12 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
          Our Key <span className="text-purple-400">Gallery</span> for Transformation
        </h2>
        <p className="text-purple-200 text-sm sm:text-base md:text-lg max-w-3xl mx-auto">
          Explore our portfolio of successful projects and transformative solutions
        </p>
      </div>

      {/* Gallery Container with Arrows */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full p-3 transition-all duration-300 hover:scale-110 shadow-lg"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6 text-white" strokeWidth={2.5} />
        </button>

        {/* Scrollable Gallery */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-2 md:px-12 pb-4"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {works.map((work) => (
            <div
              key={work.id}
              className="flex-shrink-0 w-80 sm:w-96 group"
            >
              <div className="bg-[#685885] backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg shadow-purple-500/20 transition-transform duration-300 transform group-hover:scale-105">
                {/* Media Container */}
                <div className="relative w-full h-64 bg-[#b5a6d0] overflow-hidden">
                  {work.mediaType === 'image' ? (
                    <Image
                      src={work.mediaPath}
                      alt={work.title}
                      className="object-cover w-full h-full transition-transform duration-500"
                    />
                  ) : (
                    <video
                      src={work.mediaPath}
                      className="object-cover w-full h-full"
                      controls
                      playsInline
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>

                {/* Title Section - Only this is clickable */}
                {work.title && (
                  <div className="p-5 bg-[#685885]">
                    <Link href={work.link}>
                      <h3 className="underline text-white font-semibold text-center text-lg hover:text-purple-200 transition-colors duration-300 cursor-pointer">
                        {work.title}
                      </h3>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full p-3 transition-all duration-300 hover:scale-110 shadow-lg"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6 text-white" strokeWidth={2.5} />
        </button>
      </div>

      {/* Mobile Scroll Hint */}
      <div className="md:hidden text-center mt-4">
        <p className="text-purple-300 text-sm">← Swipe to explore more →</p>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default ServiceWorksGallery;