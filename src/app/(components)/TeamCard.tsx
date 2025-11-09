'use client';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Briefcase } from 'lucide-react';
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
  'Creative Content Creator',
  'AI Video Specialist',
];

export default function OrgChart() {
  const [loading, setLoading] = useState(true);
  const [hierarchy, setHierarchy] = useState<TeamMember | null>(null);

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
        members.sort((a, b) => {
          const aIndex = ROLE_ORDER.indexOf(a.role);
          const bIndex = ROLE_ORDER.indexOf(b.role);
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

        const connect = (parentRole: string, childRoles: string[]) => {
          if (map[parentRole]) {
            map[parentRole].children = childRoles
              .map((r) => map[r])
              .filter(Boolean);
          }
        };

        connect('Founder & Creative Director', [
          'Head of Marketing',
          'Operations Lead',
          'Lead Developer',
        ]);
        connect('Head of Marketing', ['Social Media Executive','Content Writer']);
        connect('Operations Lead', [
          'Creative Content Creator',
          'AI Video Specialist',
          'SEO & AI Support Specialist',

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

  const MemberCard = ({ member }: { member: TeamMember }) => {
    return (
      <a
        href={`/team/${member.id}`}
        className="flex flex-col items-center group no-underline transition-all duration-300 hover:scale-105"
      >
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 mb-3 sm:mb-4">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 shadow-2xl group-hover:shadow-purple-400/50 transition-all duration-300"></div>
          <Image
            src={member.image || 'https://placehold.co/200x200/6B46C1/FFF?text=User'}
            alt={member.name}
            width={128}
            height={128}
            className="absolute inset-0 w-full h-full rounded-full object-cover p-1 z-10"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              (e.target as HTMLImageElement).src =
                'https://placehold.co/200x200/6B46C1/FFF?text=User';
            }}
          />
        </div>
        <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 text-center mb-1 px-2">
          {member.name}
        </h3>
        <p className="text-xs sm:text-sm text-purple-600 font-medium text-center flex items-center gap-1 px-2">
          <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 flex-shrink-0" />
          <span className="break-words">{member.role}</span>
        </p>
      </a>
    );
  };



  const DepartmentColumn = ({ head, teamMembers }: { head: TeamMember; teamMembers?: TeamMember[] }) => (
    <div className="flex flex-col items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12">
      {/* Department Head */}
      <div className="relative">
        <MemberCard member={head} />

      </div>

      {/* Team Members */}
      {teamMembers && teamMembers.length > 0 && (
        <div className="flex flex-col gap-6 sm:gap-8 md:gap-10">
          {teamMembers.map((child) => (
            <div key={child.id} className="relative">
              <MemberCard member={child} />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderOrgChart = (root: TeamMember) => {
    const directReports = root.children || [];
    const marketing = directReports.find(m => m.role === 'Head of Marketing');
    const operations = directReports.find(m => m.role === 'Operations Lead');
    const lead = directReports.find(m => m.role === 'Lead Developer');

    return (
      <div className="w-full flex justify-center">
        <div className="w-full max-w-7xl">
          {/* Mobile Layout - Vertical Stack */}
          <div className="flex flex-col items-center gap-8 sm:gap-10 md:hidden">
            {/* Founder */}
            <div className="relative">
              <MemberCard member={root} />
            </div>

            {/* All Departments Stacked */}
            {marketing && (
              <div className="relative w-full flex justify-center">
                <DepartmentColumn head={marketing} teamMembers={marketing.children} />
              </div>
            )}

            {operations && (
              <div className="relative w-full flex justify-center">
                <DepartmentColumn head={operations} teamMembers={operations.children} />
              </div>
            )}

            {lead && (
              <div className="relative w-full flex justify-center">
                <DepartmentColumn head={lead} teamMembers={lead.children} />
              </div>
            )}
          </div>

          {/* Tablet Layout - 2 Columns */}
          <div className="hidden md:flex lg:hidden flex-col items-center gap-10">
            {/* Founder */}
            <div className="relative">
              <MemberCard member={root} />
            </div>

            {/* First Row: Marketing + Operations */}
            <div className="grid grid-cols-2 gap-12 w-full max-w-3xl">
              {marketing && <DepartmentColumn head={marketing} teamMembers={marketing.children} />}
              {operations && <DepartmentColumn head={operations} teamMembers={operations.children} />}
            </div>

            {/* Second Row: Development */}
            {lead && (
              <div className="w-full flex justify-center">
                <DepartmentColumn head={lead} teamMembers={lead.children} />
              </div>
            )}
          </div>

          {/* Desktop Layout - 3 Columns + Founder */}
          <div className="hidden lg:flex flex-col items-center gap-12">
            {/* Founder */}
            <div className="relative">
              <MemberCard member={root} />
            </div>

            {/* All Three Departments Side by Side */}
            <div className="grid grid-cols-3 gap-16 xl:gap-20 w-full max-w-6xl">
              {marketing && <DepartmentColumn head={marketing} teamMembers={marketing.children} />}
              {operations && <DepartmentColumn head={operations} teamMembers={operations.children} />}
              {lead && <DepartmentColumn head={lead} teamMembers={lead.children} />}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen p-4 sm:p-6 md:p-8 lg:p-12 bg-gradient-to-br from-purple-50 via-white to-purple-50 transition-all duration-300"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="py-8 sm:py-10 md:py-12 lg:py-16 w-full">
          {loading ? (
            <div className="text-center py-16 sm:py-20 text-gray-500">
              <svg
                className="animate-spin h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mx-auto"
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
            renderOrgChart(hierarchy)
          ) : (
            <p className="text-gray-500 text-center text-base sm:text-lg">No hierarchy data found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
