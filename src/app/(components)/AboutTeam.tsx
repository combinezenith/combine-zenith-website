'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import Image from 'next/image';
import Link from 'next/link';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  role: string;
  bio: string;
  image: string;
  slug: string;
  social: {
    profile: string;
    linkedin: string;
  };
}

export default function MeetTheTeam() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'teamMembers'));
        const members: TeamMember[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Omit<TeamMember, 'social'> & { social: Omit<TeamMember['social'], 'profile'> };
          members.push({
            ...data,
            id: doc.id,
            social: {
              ...data.social,
              profile: `/team/${doc.id}`
            }
          });
        });
        const specificNames = ["Waqas Ahmed", "Muhammad Umar", "Muhammad Shabbir Sabir"];
        const filteredMembers = members.filter(member => specificNames.includes(member.name));
        setTeamMembers(filteredMembers);
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);
  
  return (
    <section aria-label="Meet The Team Section" className="relative py-20 overflow-hidden">
      {/* Background Elements */}
      <div aria-label="Background Decorations" className="absolute inset-0 overflow-hidden">
        <div aria-label="Background Blur Circle 1" className="absolute -top-32 -left-32 w-64 h-64 rounded-full blur-3xl" />
        <div aria-label="Background Blur Circle 2" className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full blur-3xl" />
        <div aria-label="Background Blur Circle 3" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div aria-label="Team Container" className="container mx-auto px-6 relative z-10">
        <div aria-label="Team Content" className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div aria-label="Team Header" className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Meet the Team
            </h1>
            <br />
            </div>

          {/* Loading State */}
          {loading && (
            <div aria-label="Team Members Grid" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center animate-pulse"
                >
                  {/* Profile Image Skeleton */}
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-pulse"></div>

                  {/* Member Info Skeleton */}
                  <div className="space-y-4">
                    <div>
                      {/* Name Skeleton */}
                      <div className="h-6 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded mb-2 animate-pulse"></div>
                      {/* Position Skeleton */}
                      <div className="h-4 bg-gradient-to-r from-purple-700 via-purple-600 to-purple-700 rounded mb-1 animate-pulse w-3/4 mx-auto"></div>
                      {/* Role Skeleton */}
                      <div className="h-3 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded animate-pulse w-1/2 mx-auto"></div>
                    </div>
                  </div>

                  {/* Social Links Skeleton */}
                  <div className="flex justify-center space-x-3 mt-6 pt-6 border-t border-gray-700/50">
                    <div className="w-4 h-4 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded animate-pulse"></div>
                    <div className="w-4 h-4 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Team Grid */}
          <div aria-label="Team Members Grid" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-400/30 transition-all duration-300 group text-center"
              >
                {/* Profile Image */}
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={`${member.name} Profile Picture`}
                    width={96}
                    height={96}
                    className="w-24 h-24 mx-auto mb-6 rounded-full object-cover transition-all duration-300"
                  />
                ) : (
                  <div aria-label={`${member.name} Profile Picture`} className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 rounded-full flex items-center justify-center transition-all duration-300">
                    <span className="text-white text-2xl font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}

                {/* Member Info */}
                <div aria-label="Member Information" className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 transition-all duration-300">
                      {member.name}
                    </h3>
                    <p className="text-purple-300 font-semibold text-sm">
                      {member.position}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {member.role}
                    </p>
                  </div>
                </div>

                {/* Social Links */}
<div aria-label="Social Media Links" className="flex justify-center space-x-3 mt-6 pt-6 border-t border-gray-700/50">
  <a
    href={member.social.profile}
    aria-label={`View ${member.name}'s Profile`}
    className="text-gray-400 hover:text-purple-400 transition-colors duration-300"
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
    </svg>
  </a>
  <a
    href={member.social.linkedin}
    aria-label={`Visit ${member.name}'s LinkedIn`}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-purple-400 transition-colors duration-300"
  >
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  </a>
</div>
              </div>
            ))}
          </div>

          {/* View All Members Button */}
          <div className="text-center mt-12">
            <Link
              href="/team"
              className="inline-block px-8 py-3 bg-[#685885] text-white rounded-xl hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 font-semibold"
            >
              View All Members
            </Link>
          </div>

{/* Bottom CTA */}
<div aria-label="Call to Action" className="text-center mt-16 pt-12 border-t border-gray-700/50">
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
    </section>
  );
}