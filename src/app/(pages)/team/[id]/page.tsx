'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProfileHeroSection from '@/app/(components)/ProfileHero';
import AboutMeSection from '@/app/(components)/TeamAbout';
import TeamInfo from '@/app/(components)/TeamInfo';
import { db } from '../../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

// Define the member type
type TeamMember = {
  name: string;
  role: string;
  tagline: string;
  image: string;
  bio: string;
  linkedin?: string;
};

export default function TeamMemberPage() {
  const params = useParams();
  const id = params.id as string;
  const [member, setMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMember = async () => {
      if (!id) return;

      try {
        const docRef = doc(db, 'teamMembers', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setMember({
            ...data,
          } as TeamMember);
        } else {
          setMember(null);
        }
      } catch (error) {
        console.error('Error fetching team member:', error);
        setMember(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMember();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen mt-20 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="mt-30 min-h-screen bg-gradient-to-br from-black via-purple-950 to-purple-900 text-white relative overflow-hidden">
        {/* Decorative Elements - Right Side */}
        <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-12 z-10">
          <div className="w-3 h-3 rounded-full bg-white opacity-60"></div>
          <div className="w-2 h-32 bg-purple-500 opacity-40"></div>
          <div className="w-3 h-3 rounded-full border-2 border-white opacity-60"></div>
          <div className="w-3 h-3 rounded-full border-2 border-white opacity-60"></div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-8 py-20 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-9xl font-bold mb-4">404</h1>
            <h2 className="text-5xl font-light mb-6">Team Member Not Found</h2>
            <p className="text-gray-300 mb-2">
              Oops! The page {`you're`} looking {`doesn't`} exist or has moved.
            </p>
            <p className="text-gray-300 mb-8">
              Please try navigating from the Team page or contact support.
            </p>

            <Link
              href="/team"
              className="inline-block px-8 py-3 border-2 border-white rounded-full hover:bg-white hover:text-purple-900 transition-all duration-300"
            >
              Go back to Team Page
            </Link>

            <p className="mt-8 text-sm text-gray-400">
              If you believe there is an error, please contact support.
            </p>
          </div>
        </div>

        {/* Geometric Shapes */}
        <div className="fixed right-0 top-1/2 -translate-y-1/2 w-1/2 h-full flex items-center justify-center pointer-events-none">
          {/* Large Triangle */}
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute" style={{
              width: 0,
              height: 0,
              borderLeft: '300px solid transparent',
              borderRight: '300px solid transparent',
              borderBottom: '520px solid rgba(88, 28, 135, 0.5)',
            }}></div>

            {/* Medium Triangle - Inverted */}
            <div className="absolute" style={{
              width: 0,
              height: 0,
              borderLeft: '120px solid transparent',
              borderRight: '120px solid transparent',
              borderTop: '208px solid rgba(88, 28, 135, 0.7)',
              transform: 'translate(-80px, -180px)'
            }}></div>

            {/* Star/Sparkle */}
            <div className="absolute bottom-32 right-32">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <path d="M30 0L32 28L60 30L32 32L30 60L28 32L0 30L28 28L30 0Z" fill="rgba(255, 255, 255, 0.3)" />
              </svg>
            </div>
          </div>
        </div>

        {/* Overlay gradient for depth */}
        <div className="fixed inset-0 bg-gradient-to-r from-black via-transparent to-transparent pointer-events-none"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-20 p-4 sm:p-6 lg:p-8">
      <ProfileHeroSection member={member!} />

      <div className="max-w-6xl mx-auto mt-8 sm:mt-10 lg:mt-12 space-y-6 sm:space-y-8 lg:space-y-12">
        <AboutMeSection
          name={member!.name}
          bio={member!.bio}
        />

        <TeamInfo
          linkedin={member!.linkedin}
        />

      </div>
    </div>
  );
}