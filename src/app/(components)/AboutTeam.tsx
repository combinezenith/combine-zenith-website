'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

interface TeamMember {
  name: string;
  position: string;
  description: string;
  image: string;
  slug: string;
  social: {
    profile: string;
    instagram: string;
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
            social: {
              ...data.social,
              profile: `/team/${doc.id}`
            }
          });
        });
        setTeamMembers(members);
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
            <div className="text-center py-12">
              <p className="text-gray-300 text-lg">Loading team members...</p>
            </div>
          )}

          {/* Team Grid */}
          <div aria-label="Team Members Grid" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-400/30 transition-all duration-300 group text-center"
              >
                {/* Profile Image Placeholder */}
                <div aria-label={`${member.name} Profile Picture`} className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 rounded-full flex items-center justify-center transition-all duration-300">
                  <span className="text-white text-2xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                
                {/* Member Info */}
                <div aria-label="Member Information" className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 transition-all duration-300">
                      {member.name}
                    </h3>
                    <p className="text-purple-300 font-semibold text-sm">
                      {member.position}
                    </p>
                  </div>
                  
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {member.description}
                  </p>
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
    href={member.social.instagram}
    aria-label={`Visit ${member.name}'s Instagram`}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-purple-400 transition-colors duration-300"
  >
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
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