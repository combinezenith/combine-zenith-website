'use client';

import { useState } from 'react';

export default function AboutSection() {
  // Array of logo image paths
  const logos = [
    '/partners/1.jpg',
    '/partners/2.jpg',
    '/partners/3.jpg',
    '/partners/4.jpg',
    '/partners/5.jpg',
    '/partners/6.jpg',
    '/partners/7.jpg',
    '/partners/8.jpg',
    '/partners/9.jpg',
    '/partners/10.jpg',
    '/partners/11.jpg',
    '/partners/12.jpg',
    '/partners/13.jpg',
    '/partners/14.jpg',
    '/partners/15.jpg',
    '/partners/16.jpg',
    '/partners/17.jpg',
    '/partners/18.jpg',
    '/partners/19.jpg',
    '/partners/20.jpg',
    '/partners/21.jpg',
    '/partners/22.jpg',
    '/partners/23.jpg',
    '/partners/24.jpg',
    '/partners/25.jpg',
  ];

  // Split logos into two groups for the two rows
  const row1Logos = logos.slice(0, 13);
  const row2Logos = logos.slice(13, 25);

  // State to track loaded images
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const handleImageLoad = (src: string) => {
    setLoadedImages(prev => new Set(prev.add(src)));
  };

  const handleImageError = (src: string) => {
    console.warn(`Failed to load image: ${src}`);
  };

  return (
    <section aria-label="About Section" className="py-20 px-6">
      <div aria-label="About Container" className="container mx-auto max-w-6xl">
        {/* About Content */}
        <div aria-label="About Content" className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Driven by Creativity. Defined by Connection.
          </h2>
          <p className="text-purple-200 text-lg md:text-xl leading-relaxed max-w-4xl mx-auto">
            At Combine Zenith, we&apos;re more than just a creative agency we&apos;re a collective of dreamers, thinkers, and makers who believe that every brand has a story worth telling. We listen deeply, think boldly, and create passionately blending imagination with strategy to turn ideas into powerful experiences. Our work goes beyond visuals and campaigns it&apos;s about building meaning, trust, and impact that last. From shaping your identity to creating measurable growth, we walk beside you as true partners crafting stories that inspire, connect, and make a difference.
          </p>
        </div>

        {/* Trusted By Section */}
        <div aria-label="Trusted Companies" className="bg-purple-800/30 backdrop-blur-sm rounded-3xl p-12 md:p-16 overflow-hidden">
          <h3 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Trusted by Industry Leaders.
          </h3>

          {/* Row 1 - moves left */}
          <div aria-label="Logo Row 1" className="relative overflow-hidden">
            <div aria-label="Scrolling Logos" className="flex animate-marquee-left gap-12">
              {row1Logos.map((logo, index) => (
                <div
                  key={`row1-${index}`}
                  className="w-48 h-24 flex items-center justify-center bg-white/10 rounded-xl p-4"
                >
                  <img 
                    src={logo} 
                    alt={`Partner Company ${index + 1}`}
                    className="max-w-full max-h-full object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
                    onLoad={() => handleImageLoad(logo)}
                    onError={() => handleImageError(logo)}
                  />
                </div>
              ))}
              {/* Duplicate for smooth loop */}
              {row1Logos.map((logo, index) => (
                <div
                  key={`row1-copy-${index}`}
                  className="w-48 h-24 flex items-center justify-center bg-white/10 rounded-xl p-4"
                >
                  <img 
                    src={logo} 
                    alt={`Partner Company ${index + 1}`}
                    className="max-w-full max-h-full object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
                    onLoad={() => handleImageLoad(logo)}
                    onError={() => handleImageError(logo)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 - moves right */}
          <div aria-label="Logo Row 2" className="relative overflow-hidden mt-12">
            <div aria-label="Scrolling Logos Reverse" className="flex animate-marquee-right gap-12">
              {row2Logos.map((logo, index) => (
                <div
                  key={`row2-${index}`}
                  className="w-48 h-24 flex items-center justify-center bg-white/10 rounded-xl p-4"
                >
                  <img 
                    src={logo} 
                    alt={`Partner Company ${index + 14}`}
                    className="max-w-full max-h-full object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
                    onLoad={() => handleImageLoad(logo)}
                    onError={() => handleImageError(logo)}
                  />
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {row2Logos.map((logo, index) => (
                <div
                  key={`row2-copy-${index}`}
                  className="w-48 h-24 flex items-center justify-center bg-white/10 rounded-xl p-4"
                >
                  <img 
                    src={logo} 
                    alt={`Partner Company ${index + 14}`}
                    className="max-w-full max-h-full object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
                    onLoad={() => handleImageLoad(logo)}
                    onError={() => handleImageError(logo)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for marquee animations */}
      <style jsx>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes marquee-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-marquee-left {
          animation: marquee-left 22s linear infinite;
          width: max-content;
        }
        .animate-marquee-right {
          animation: marquee-right 22s linear infinite;
          width: max-content;
        }
      `}</style>
    </section>
  );
}