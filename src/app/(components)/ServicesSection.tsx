'use client';

import { Rocket, Pencil, Search, MessageCircle, Palette, Globe } from 'lucide-react';

const services = [
  {
    icon: Rocket,
    title: 'Digital Strategy',
    description: 'Comprehensive planning to align your marketing with business goals for maximum impact.',
  },
  {
    icon: Pencil,
    title: 'Content Creation',
    description: 'Engaging content across all platforms, from captivating blogs to high-quality videos and visuals.',
  },
  {
    icon: Search,
    title: 'SEO & SEM',
    description: 'Boost online visibility and drive organic and paid traffic effectively to your website.',
  },
  {
    icon: MessageCircle,
    title: 'Social Media Marketing',
    description: "Build a vibrant community and amplify your brand's message on key social platforms.",
  },
  {
    icon: Palette,
    title: 'Brand Identity',
    description: 'Crafting a unique and memorable brand identity that resonates deeply with your target audience.',
  },
  {
    icon: Globe,
    title: 'Web Development',
    description: 'Building high-performance, user-friendly digital experiences that convert visitors into customers.',
  },
];

export default function ServicesSection() {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our Expertise, Your Growth.
          </h2>
          <p className="text-purple-200 text-lg md:text-xl max-w-3xl mx-auto">
            We offer a full spectrum of digital marketing services designed to elevate your
            brand, engage your audience, and drive measurable results.
          </p>
        </div>

        {/* Services Horizontal Scroll */}
        <div className="relative overflow-hidden">
          <div className="flex animate-marquee-right gap-6 py-2">
            {/* First set of services */}
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={`service-${index}`}
                  className="group relative min-w-[320px] bg-[#685885] backdrop-blur-sm rounded-2xl p-8 hover:bg-primary hover:border-accent transition-all duration-500 hover:transform hover:scale-105 flex-shrink-0"
                >
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl group-hover:blur-0" />
                  
                  {/* Content Container */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="mb-6 flex justify-center">
                      <div className="w-16 h-16 bg-[#b5a6d0] rounded-lg flex items-center justify-center group-hover:bg-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <Icon className="w-8 h-8 text-white group-hover:text-purple-600 transition-colors duration-500" strokeWidth={1.5} />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white text-center mb-4 group-hover:text-white transition-colors duration-300">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-purple-200 text-center text-sm leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                      {service.description}
                    </p>

                    {/* Hidden Learn More Text */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                      <span className="text-white text-sm font-semibold bg-purple-600/50 px-3 py-1 rounded-full">
                        Learn More →
                      </span>
                    </div>
                  </div>

                  {/* Border Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/30 group-hover:shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-500" />
                </div>
              );
            })}
            
            {/* Duplicate for seamless loop */}
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={`service-copy-${index}`}
                  className="group relative min-w-[320px] bg-[#685885] backdrop-blur-sm rounded-2xl p-8 hover:bg-primary hover:border-accent transition-all duration-500 hover:transform hover:scale-105 flex-shrink-0"
                >
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl group-hover:blur-0" />
                  
                  {/* Content Container */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="mb-6 flex justify-center">
                      <div className="w-16 h-16 bg-[#b5a6d0] rounded-lg flex items-center justify-center group-hover:bg-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <Icon className="w-8 h-8 text-white group-hover:text-purple-600 transition-colors duration-500" strokeWidth={1.5} />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white text-center mb-4 group-hover:text-white transition-colors duration-300">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-purple-200 text-center text-sm leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                      {service.description}
                    </p>

                    {/* Hidden Learn More Text */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                      <span className="text-white text-sm font-semibold bg-purple-600/50 px-3 py-1 rounded-full">
                        Learn More →
                      </span>
                    </div>
                  </div>

                  {/* Border Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/30 group-hover:shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-500" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom CSS for marquee animation */}
        <style jsx>{`
          @keyframes marquee-right {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-marquee-right {
            animation: marquee-right 30s linear infinite;
          }
          .animate-marquee-right:hover {
            animation-play-state: paused;
          }
        `}</style>
      </div>
    </section>
  );
}