'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Star, Award, Users, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import ServiceCard from '@/app/(components)/ServiceCard';
<<<<<<< HEAD
=======
// import TextType from '@/app/(components)/TextType';
>>>>>>> 4c7705363112a00da02a00b1567cc6fc8f7f5787
import { CountingNumber } from '@/app/components/CountingNumber';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/app/config/firebase';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

interface Stat {
  id: string;
  icon: string;
  value: number;
  label: string;
  color: string;
  suffix: string;
  order: number;
}

const iconMap = {
  Star: Star,
  Award: Award,
  Users: Users,
  TrendingUp: TrendingUp,
};

export default function Service() {
  const heroRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchStats = async () => {
    try {
      const snapshot = await getDocs(collection(db, "stats"));
      if (snapshot.empty) {
        // Use default stats if none exist
        setStats([
          { id: "stat1", icon: "Star", value: 500, label: "Projects Completed", color: "text-yellow-400", suffix: "+", order: 1 },
          { id: "stat2", icon: "Award", value: 98, label: "Client Satisfaction", color: "text-green-400", suffix: "%", order: 2 },
          { id: "stat3", icon: "Users", value: 150, label: "Happy Clients", color: "text-blue-400", suffix: "+", order: 3 },
          { id: "stat4", icon: "TrendingUp", value: 300, label: "Average ROI", color: "text-purple-400", suffix: "%", order: 4 }
        ]);
      } else {
        const data: Stat[] = snapshot.docs
          .map((d) => ({ id: d.id, ...d.data() } as Stat))
          .sort((a, b) => a.order - b.order);
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      // Fallback to default stats on error
      setStats([
        { id: "stat1", icon: "Star", value: 500, label: "Projects Completed", color: "text-yellow-400", suffix: "+", order: 1 },
        { id: "stat2", icon: "Award", value: 98, label: "Client Satisfaction", color: "text-green-400", suffix: "%", order: 2 },
        { id: "stat3", icon: "Users", value: 150, label: "Happy Clients", color: "text-blue-400", suffix: "+", order: 3 },
        { id: "stat4", icon: "TrendingUp", value: 300, label: "Average ROI", color: "text-purple-400", suffix: "%", order: 4 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  fetchStats(); // Remove authentication check
}, []); // Remove dependencies

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      if (heroRef.current) {
        gsap.fromTo(heroRef.current.querySelector('.hero-title'),
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );

        gsap.fromTo(heroRef.current.querySelector('.hero-subtitle'),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: 0.3,
            ease: "power2.out",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );

        gsap.fromTo(heroRef.current.querySelector('.hero-cta'),
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            delay: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // Stats animations
      if (statsRef.current && !loading) {
        const statItems = statsRef.current.querySelectorAll('.stat-item');
        gsap.fromTo(statItems,
          { opacity: 0, y: 50, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 75%",
              end: "bottom 25%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // Services section animation
      if (servicesRef.current) {
        gsap.fromTo(servicesRef.current,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: servicesRef.current,
              start: "top 75%",
              end: "bottom 25%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // CTA section animation
      if (ctaRef.current) {
        gsap.fromTo(ctaRef.current,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 75%",
              end: "bottom 25%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, [loading]);

  return (
    <main className="min-h-screen text-white overflow-hidden" aria-label='Services Page'>
      {/* Hero Section */}
      <section ref={heroRef} className="relative py-20 sm:py-28 md:py-36 px-4 sm:px-6 lg:px-8">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <div className="hero-title mb-6 sm:mb-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6">
                <span className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                  Our Services
                </span>
              </h1>
            </div>

            <div className="hero-subtitle max-w-4xl mx-auto mb-8 sm:mb-12">
              <p className="text-lg sm:text-xl md:text-2xl text-purple-200 leading-relaxed">
                At Combine Zenith, we turn creativity into connection and ideas into impact.
                Our services are designed to help brands grow with purpose, clarity, and authenticity.
                From strategy to storytelling, design to digital, we bring your vision to life with meaning and
                precision.
              </p>
            </div>

            <div className="hero-cta">
              <a href="#ServiceCard" className="group bg-purple-100/50 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full font-semibold text-lg sm:text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 flex items-center gap-3 mx-auto w-fit">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                Explore Our Services
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center text-purple-300">Loading stats...</div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {stats.map((stat, index) => {
                const IconComponent = iconMap[stat.icon as keyof typeof iconMap] || Star;
                
                return (
                  <div key={stat.id} className="stat-item text-center group">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-purple-400/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10">
                      <IconComponent className={`w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-4 ${stat.color} group-hover:scale-110 transition-transform`} />
                      <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                        <CountingNumber
                          number={stat.value}
                          fromNumber={0}
                          padStart={false}
                          decimalSeparator="."
                          decimalPlaces={0}
                          delay={index * 200}
                          className="text-3xl sm:text-4xl md:text-5xl font-bold"
                        />
                        {stat.suffix}
                      </div>
                      <div className="text-sm sm:text-base text-purple-200">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section id="ServiceCard" ref={servicesRef} className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                What We Offer
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-purple-200 max-w-3xl mx-auto">
              Comprehensive solutions tailored to your unique needs. From concept to execution,
              we deliver excellence across every service we provide.
            </p>
          </div>

          <ServiceCard />
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className=" backdrop-blur-sm rounded-3xl p-8 sm:p-12 md:p-16 border border-purple-500/20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8">
              <span className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                Ready to Transform Your Brand?
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-purple-200 mb-8 sm:mb-10 max-w-2xl mx-auto">
              Let&apos;s collaborate to bring your vision to life. Our team of experts is ready to
              create something extraordinary together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <Link href='/pricing'>
              <button className="group bg-purple-100/50 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full font-semibold text-lg sm:text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 flex items-center justify-center gap-3">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                Start Your Project
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              </Link>
              <Link href='/contact'>
              <button className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full font-semibold text-lg sm:text-xl transition-all duration-300 hover:scale-105 border border-white/20 flex items-center justify-center gap-3">
                Schedule a Call
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}