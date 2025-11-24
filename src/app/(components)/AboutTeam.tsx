'use client';

import { useState, useEffect, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

interface TeamMember {
  id: string;
  name: string;
  position: string;
  role: string;
  bio: string;
  image: string;
  slug: string;
  linkedin: string;
  social: {
    profile: string;
  };
}

const ROLE_ORDER = [
  'Founder & Creative Director',
  'Head of Marketing',
  'Operations Lead',
  'Lead Developer',
  'Web Developer & R&D Specialist',
  'Backend Support Developer',
  'SEO & AI Support Specialist',
  'Content Writer',
  'Social Media Executive',
  'Creative Content Creator',
  'AI Video Specialist',
];

export default function MeetTheTeam() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const bgCircle1Ref = useRef<HTMLDivElement>(null);
  const bgCircle2Ref = useRef<HTMLDivElement>(null);
  const bgCircle3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'teamMembers'));
        const members: TeamMember[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as TeamMember;
          members.push({
            ...data,
            id: doc.id,
            social: {
              profile: `/team/${doc.id}`
            }
          });
        });

        members.sort((a, b) => {
          const aIndex = ROLE_ORDER.indexOf(a.role);
          const bIndex = ROLE_ORDER.indexOf(b.role);
          if (aIndex === -1 && bIndex === -1) return 0;
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;
          return aIndex - bIndex;
        });

        setTeamMembers(members);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  useEffect(() => {
<<<<<<< HEAD
=======
    if (!galleryRef.current || loading || teamMembers.length === 0) return;

    const items = teamMembers.map(member => ({
      image: member.image,
      text: member.name,
      id: member.id
    }));

    const app = new GalleryApp(galleryRef.current, {
      items,
      bend: 2.5,
      textColor: '#ffffff',
      borderRadius: 0.5,
      font: 'bold 28px sans-serif',
      scrollSpeed: 2,
      scrollEase: 0.1,
      autoScroll: true,
      autoScrollSpeed: 0.1
    });

    galleryAppRef.current = app;

    return () => {
      app.destroy();
      galleryAppRef.current = null;
    };
  }, [loading, teamMembers]);

  useEffect(() => {
>>>>>>> a300441ff41d72df04f15d647bf75be1c83b036d
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 80%',
            },
          }
        );
      }

      if (marqueeRef.current) {
        gsap.fromTo(
          marqueeRef.current,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: marqueeRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top 80%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [loading]);

  return (
    <section ref={sectionRef} className="relative py-20 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div ref={headerRef} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Meet the Team
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Our talented team of professionals dedicated to your success
            </p>
          </div>

          {loading && (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          )}

          {!loading && teamMembers.length > 0 && (
            <div ref={marqueeRef} className="relative overflow-hidden py-8">
              <div className="flex gap-8 marquee-container">
                
                {[...teamMembers, ...teamMembers].map((member, index) => (
                  <div
                    key={`${member.id}-${index}`}
                    className="flex-shrink-0 w-80 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-400/30 transition-all duration-300 group hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
                  >
                    <div className="relative w-24 h-24 mx-auto mb-6">
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          width={96}
                          height={96}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                          {member.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                      )}
                    </div>

                    <div className="text-center space-y-2">
                      <h3 className="text-xl font-bold text-white">
                        {member.name}
                      </h3>
                      <p className="text-purple-300 font-semibold text-sm">
                        {member.position}
                      </p>
                      <p className="text-gray-400 text-xs">{member.role}</p>
                    </div>

                    <div className="flex justify-center space-x-3 mt-6 pt-6 border-t border-gray-700/50">
                      <Link
                        href={member.social.profile}
                        className="text-gray-400 hover:text-purple-400"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                      </Link>

                      <a
                        href={member.linkedin}
                        target="_blank"
                        className="text-gray-400 hover:text-purple-400"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          )}
{/* Bottom CTA */}
<div ref={ctaRef} aria-label="Call to Action" className="text-center mt-16 pt-12 border-t border-gray-700/50">
  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
    Ready to Transform Your Brand?
  </h2>
  <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
    Let Combine Zenith be your strategic partner in navigating the complexities of the modern market. We&apos;re here to help you achieve unprecedented success.
  </p>
  <button className="px-8 py-3 bg-[#685885] text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 font-semibold">
    <a href="/contact">
    Contact Us Today
    </a>
  </button>
</div>
        </div>
      </div>

      {/* Perfect Seamless Marquee */}
      <style jsx>{`
        @keyframes marqueeScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .marquee-container {
          display: flex;
          width: max-content;
          animation: marqueeScroll 18s linear infinite;
        }

        .marquee-container:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}