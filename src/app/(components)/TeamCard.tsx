'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Briefcase, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  parentRole?: string | null;
  children?: TeamMember[];
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
];

export default function OrgChart() {
  const [loading, setLoading] = useState(true);
  const [hierarchy, setHierarchy] = useState<TeamMember | null>(null);

  // --- Fetch and organize data ---
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const snap = await getDocs(collection(db, 'teamMembers'));
        const members: TeamMember[] = snap.docs.map((doc) => ({
          ...(doc.data() as TeamMember),
          id: doc.id,
          children: [],
        }));

        console.log('Fetched members:', members); // Debug log

        // Sort by role order
        members.sort((a, b) => {
          const aIndex = ROLE_ORDER.indexOf(a.role);
          const bIndex = ROLE_ORDER.indexOf(b.role);
          // If role not in ROLE_ORDER, put it at the end
          if (aIndex === -1 && bIndex === -1) return 0;
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;
          return aIndex - bIndex;
        });

        // Build hierarchy tree
        const root = members.find(
          (m) => m.role === 'Founder & Creative Director'
        );
        if (!root) {
          console.error('No Founder found');
          return;
        }

        const map = Object.fromEntries(members.map((m) => [m.role, m]));
        console.log('Role map:', Object.keys(map)); // Debug log

        const connect = (parentRole: string, childRoles: string[]) => {
          if (map[parentRole]) {
            map[parentRole].children = childRoles
              .map((r) => map[r])
              .filter(Boolean);
            console.log(`Connected ${parentRole} to ${map[parentRole].children?.length} children`);
          }
        };

        connect('Founder & Creative Director', [
          'Head of Marketing',
          'Operations Lead',
          'Lead Developer',
        ]);
        connect('Head of Marketing', ['Social Media Executive']);
        connect('Operations Lead', [
          'SEO & AI Support Specialist',
          'Content Writer',
        ]);
        connect('Lead Developer', [
          'Web Developer & R&D Specialist',
          'Backend Support Developer',
        ]);

        setHierarchy(root);
      } catch (err) {
        console.error('Error fetching team hierarchy:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  // --- UI Components ---

  const MemberCard = ({ member }: { member: TeamMember }) => (
    <Link href={`/team/${member.id}`} className="block">
      <div className="flex flex-col items-center p-3 sm:p-4 bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer w-full max-w-[180px] sm:max-w-[200px] lg:max-w-[250px]">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mb-2 sm:mb-3">
          <Image
            src={member.image || '/placeholder.png'}
            alt={member.name}
            fill
            className="rounded-full object-cover ring-2 sm:ring-4 ring-[#b5a6d0]/50"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://placehold.co/100x100/6B46C1/FFF?text=User';
            }}
          />
        </div>
        <h3 className="text-xs sm:text-sm font-semibold text-gray-800 text-center leading-tight px-1">
          {member.name}
        </h3>
        <p className="text-[10px] sm:text-xs text-[#200053] font-medium mt-1 flex items-center flex-wrap justify-center text-center">
          <Briefcase className="w-3 h-3 mr-1 text-[#b5a6d0] flex-shrink-0" />
          <span className="break-words max-w-[120px] sm:max-w-[150px] lg:max-w-none">
            {member.role}
          </span>
        </p>
      </div>
    </Link>
  );

  const OrgChartNode = ({ member }: { member: TeamMember }) => {
    const [expanded, setExpanded] = useState(true);
    const hasChildren = member.children && member.children.length > 0;

    return (
      <div className="flex flex-col items-center w-full">
        <div className="relative">
          <MemberCard member={member} />
          {hasChildren && (
            <button
              onClick={() => setExpanded((e) => !e)}
              className="absolute -bottom-3 sm:-bottom-4 left-1/2 transform -translate-x-1/2 p-1 rounded-full bg-white text-[#200053] shadow-md hover:bg-indigo-50 transition z-10"
            >
              {expanded ? (
                <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
            </button>
          )}
        </div>

        {hasChildren && expanded && (
          <div className="w-full relative mt-6 sm:mt-8">
            {/* Horizontal line connecting all visible children */}
            <div className="w-full border-t border-[#b5a6d0] absolute top-0 left-0"></div>

            <div className="flex flex-col sm:flex-row justify-center items-center sm:items-start w-full gap-4 sm:gap-3 lg:gap-6 px-2 sm:px-0 flex-wrap">
              {member.children!.map((child) => (
                <div
                  key={child.id}
                  className="relative flex flex-col items-center w-full sm:w-auto"
                >
                  {/* Vertical line connecting parent to child - hidden on mobile */}
                  <div className="hidden sm:block w-px h-6 sm:h-8 bg-[#b5a6d0] absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2"></div>
                  
                  {/* Mobile vertical line */}
                  <div className="block sm:hidden w-px h-4 bg-[#b5a6d0] absolute -top-4 left-1/2 transform -translate-x-1/2"></div>

                  <OrgChartNode member={child} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- Main Render ---
  return (
    <div
      className="min-h-screen p-3 sm:p-6 lg:p-8"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="pb-6 sm:pb-8 lg:pb-10 w-full text-center">
          {loading ? (
            <div className="text-center py-16 sm:py-20 text-gray-500">
              <svg
                className="animate-spin h-6 w-6 sm:h-8 sm:w-8 text-[#200053] mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base">Loading Team Hierarchy...</p>
            </div>
          ) : hierarchy ? (
            <OrgChartNode member={hierarchy} />
          ) : (
            <p className="text-gray-500 text-sm sm:text-base">No hierarchy data found.</p>
          )}
        </div>
      </div>
    </div>
  );
}