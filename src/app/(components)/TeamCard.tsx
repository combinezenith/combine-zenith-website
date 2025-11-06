'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Briefcase, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
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

        // Sort by role order
        members.sort(
          (a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role)
        );

        // Build hierarchy tree
        const root = members.find(
          (m) => m.role === 'Founder & Creative Director'
        );
        if (!root) return;

        const map = Object.fromEntries(members.map((m) => [m.role, m]));
        const connect = (parentRole: string, childRoles: string[]) => {
          if (map[parentRole])
            map[parentRole].children = childRoles
              .map((r) => map[r])
              .filter(Boolean);
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
    <div className="flex flex-col items-center p-4 bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 min-w-[180px] w-full max-w-[250px]">
      <div className="relative w-24 h-24 mb-3">
        <Image
          src={member.image || '/placeholder.png'}
          alt={member.name}
          fill
          className="rounded-full object-cover ring-4 ring-[#b5a6d0]/50"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://placehold.co/100x100/6B46C1/FFF?text=User';
          }}
        />
      </div>
      <h3 className="text-sm font-semibold text-gray-800 text-center leading-tight">
        {member.name}
      </h3>
      <p className="text-xs text-[#200053] font-medium mt-1 flex items-center">
        <Briefcase className="w-3 h-3 mr-1 text-[#b5a6d0]" />
        {member.role}
      </p>
    </div>
  );

  const OrgChartNode = ({ member }: { member: TeamMember }) => {
    const [expanded, setExpanded] = useState(true);
    const hasChildren = member.children && member.children.length > 0;

    return (
      <div className="flex flex-col items-center">
        <div className="relative">
          <MemberCard member={member} />
          {hasChildren && (
            <button
              onClick={() => setExpanded((e) => !e)}
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 p-1 rounded-full bg-white text-[#200053] shadow-md hover:bg-indigo-50 transition z-10"
            >
              {expanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

       {hasChildren && expanded && (
  <div className=" w-full relative">
        {/* Horizontal line connecting all visible children */}
    <div className="w-full sm:border-t border-[#b5a6d0] absolute top-0 left-0"></div>

    <div className="flex justify-center w-full mt-8 gap-8 sm:gap-6">
      {member.children!.map((child) => (
        <div
          key={child.id}
          className="relative flex flex-col items-center w-full sm:w-auto"
        >
          {/* Vertical line connecting parent to child */}
          <div className="hidden sm:block w-px h-8 bg-[#b5a6d0] absolute -top-8 left-1/2 transform -translate-x-1/2"></div>

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
      className="min-h-screen p-4 sm:p-8 "
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="pb-10 w-full text-center">
          {loading ? (
            <div className="text-center py-20 text-gray-500">
              <svg
                className="animate-spin h-8 w-8 text-[#200053] mx-auto"
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
              <p className="mt-4">Loading Team Hierarchy...</p>
            </div>
          ) : hierarchy ? (
            <OrgChartNode member={hierarchy} />
          ) : (
            <p className="text-gray-500">No hierarchy data found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
