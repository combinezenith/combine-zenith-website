'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import SkeletonLoader from './SkeletonLoader';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
}

export default function TeamCard() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'teamMembers'));
        const members: TeamMember[] = [];
        querySnapshot.forEach((doc) => {
          members.push({ id: doc.id, ...doc.data() } as TeamMember);
        });
        
        // Define the desired role order based on your team structure
        const roleOrder = [
          'Founder & Creative Director',           // Waqas Ahmed
          'Head of Marketing',                     // Muhammad Shabbir Sabir
          'Operations Lead',                       // Muhammad Umar
          'Lead Developer',                        // Esha
          'Web Developer & R&D Specialist',        // Muhammad Jibran Rehan
          'Backend Support Developer',             // Hamza Ali
          'SEO & AI Support Specialist',           // Moeen
          'Content Writer',                        // Maliha
          'Social Media Executive'                 // Saim
        ];
        
        // Sort members by role according to the defined order
        const sortedMembers = members.sort((a, b) => {
          const indexA = roleOrder.indexOf(a.role);
          const indexB = roleOrder.indexOf(b.role);
          
          // If both roles are in the order array, sort by their position
          if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
          }
          
          // If only A is in the order array, A comes first
          if (indexA !== -1) return -1;
          
          // If only B is in the order array, B comes first
          if (indexB !== -1) return 1;
          
          // If neither role is in the order array, sort alphabetically
          return a.role.localeCompare(b.role);
        });
        
        setTeamMembers(sortedMembers);
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  return (
    <div className="min-h-screen py-20 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <h2 className="text-5xl font-bold text-white text-center mb-20">
          Our Talented Team
        </h2>
        
        {/* Team Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <SkeletonLoader count={3} className="h-96" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <Link
                key={member.id}
                href={`/team/${member.id}`}
                className="relative rounded-3xl overflow-hidden shadow-2xl group cursor-pointer block"
                style={{ aspectRatio: '1 / 1.25' }}
              >
                {/* Team Member Image */}
                <Image
                  width={900}
                  height={1200}
                  src={member.image || '/placeholder.png'} // Fallback if image is empty
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Dark Gradient Overlay - Bottom Heavy */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                {/* Member Info - Bottom Left */}
                <div className="absolute bottom-0 left-0 p-7 text-white">
                  <h3 className="text-2xl font-bold mb-1.5 leading-tight">
                    {member.name}
                  </h3>
                  <p className="text-gray-200 text-base font-light">
                    {member.role}
                  </p>
                </div>

                {/* Hover Indicator */}
                <div className="absolute inset-0 bg-purple-600/0 group-hover:bg-purple-600/10 transition-colors duration-300"></div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}