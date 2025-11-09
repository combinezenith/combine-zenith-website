import React from "react";
import PortfolioCard from "@/app/(components)/PortfolioCard";

const Portfolio = () => {
  return (
    <div className="min-h-screen flex flex-col pt-30 justify-center relative overflow-hidden">
      
      <div className="text-center px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Animated Title */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent animate-fade-in-up">
              Our Strategic
            </h1>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-pink-300 to-purple-600 bg-clip-text text-transparent animate-fade-in-up animation-delay-300">
              Masterpieces
            </h1>
          </div>

          {/* Animated Description */}
          <div className="animate-fade-in-up animation-delay-600">
            <p className="text-gray-300 text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-3xl mx-auto mb-12">
              At Combine Zenith, we believe success isn&apos;t a destination it&apos;s a peak we climb together. Every project we create is a step toward that summit where imagination meets innovation and creativity meets measurable impact.
            </p>
            <p className="text-purple-300 text-lg sm:text-xl lg:text-2xl font-semibold italic max-w-2xl mx-auto">
              Here&apos;s a glimpse of the journeys we&apos;ve crafted each a reflection of passion, precision, and our promise to take your brand to{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent font-bold">
                the peak of success.
              </span>
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="flex justify-center items-center gap-4 mt-12 mb-8">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-purple-400"></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-purple-400"></div>
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <PortfolioCard />
      </div>
    </div>
  );
};

export default Portfolio;
