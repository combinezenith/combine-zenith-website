'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function CustomMarketingCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = ctaRef.current;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px'
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div 
        ref={ctaRef}
        className="w-full max-w-4xl"
      >
        {/* CTA Card with animation */}
        <div 
          className={`bg-purple-700 bg-opacity-50 backdrop-blur-sm rounded-3xl p-12 shadow-2xl text-center transform transition-all duration-1000 ${
            isVisible 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-12 scale-95'
          }`}
        >
          {/* Heading with staggered animation */}
          <h2 
            className={`text-4xl md:text-5xl font-bold text-white mb-6 transition-all duration-1000 delay-200 ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 -translate-y-8'
            }`}
          >
            Need a Custom Marketing Solution?
          </h2>
          
          {/* Description with staggered animation */}
          <p 
            className={`text-purple-100 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-400 ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 -translate-y-8'
            }`}
          >
            Our team of experts is ready to craft a tailored strategy that aligns perfectly with your business goals. Reach out today for a personalized consultation.
          </p>
          
          {/* CTA Button with staggered animation and pulse effect */}
          <div
            className={`transition-all duration-1000 delay-600 ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <button className="bg-white hover:bg-purple-50 text-purple-900 font-bold text-lg px-10 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 animate-pulse-slow">
              Create a Plan
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
          }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}