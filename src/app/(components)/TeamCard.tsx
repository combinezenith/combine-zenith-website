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
  parentRole?: string | null;
  children?: TeamMember[];
}

export default function OrgChart() {
  const [loading, setLoading] = useState(true);
  const [root, setRoot] = useState<TeamMember | null>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const snap = await getDocs(collection(db, 'teamMembers'));
        const all: TeamMember[] = snap.docs.map((d) => ({
          ...(d.data() as TeamMember),
          id: d.id,
          children: [],
        }));

        if (all.length === 0) return;

        // Create map for quick lookup
        const byRole: Record<string, TeamMember> = {};
        all.forEach((m) => (byRole[m.role] = m));

        // Build hierarchy using parentRole
        let founder: TeamMember | null = null;

        all.forEach((member) => {
          if (!member.parentRole) {
            // No parentRole → this is founder/root
            founder = member;
          } else {
            const parent = byRole[member.parentRole];
            if (parent) {
              parent.children!.push(member);
            }
          }
        });

        // Sort children alphabetically
        Object.values(byRole).forEach((node) => {
          node.children?.sort((a, b) => a.role.localeCompare(b.role));
        });

        setRoot(founder);
      } catch (e) {
        console.error('Error loading team:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  // ------------------
  // COMPONENTS
  // ------------------

  const MemberCard = ({ member }: { member: TeamMember }) => (
    <a
      href={`/team/${member.id}`}
      className="flex flex-col items-center group hover:scale-105 transition"
    >
      <div className="relative w-24 h-24 mb-3">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full"></div>

        <Image
          src={
            member.image ||
            'https://placehold.co/200x200/6B46C1/FFF?text=User'
          }
          alt={member.name}
          fill
          className="rounded-full object-cover p-1 relative z-10"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://placehold.co/200x200/6B46C1/FFF?text=User';
          }}
        />
      </div>

      <h3 className="text-sm font-bold text-center">{member.name}</h3>
      <p className="text-xs text-purple-600 font-medium text-center flex gap-1">
        <Briefcase className="w-3 h-3 text-purple-400" />
        {member.role}
      </p>
    </a>
  );

  const DepartmentColumn = ({ parent }: { parent: TeamMember }) => (
    <div className="flex flex-col items-center gap-8">
      <MemberCard member={parent} />

      {parent.children && parent.children.length > 0 && (
        <div className="flex flex-col gap-8">
          {parent.children.map((child) => (
            <MemberCard key={child.id} member={child} />
          ))}
        </div>
      )}
    </div>
  );

  const renderHierarchy = (root: TeamMember) => {
    const departments = root.children || [];

    return (
      <div className="w-full flex justify-center">
        <div className="max-w-6xl w-full">

          {/* Founder */}
          <div className="flex justify-center mb-10">
            <MemberCard member={root} />
          </div>

          {/* Mobile – stacked */}
          <div className="md:hidden flex flex-col gap-12">
            {departments.map((d) => (
              <DepartmentColumn key={d.id} parent={d} />
            ))}
          </div>

          {/* Tablet – 2 columns */}
          <div className="hidden md:grid lg:hidden grid-cols-2 gap-12 justify-items-center">
            {departments.map((d) => (
              <DepartmentColumn key={d.id} parent={d} />
            ))}
          </div>

          {/* Desktop – 3+ columns */}
          <div className="hidden lg:grid grid-cols-3 gap-16 justify-items-center">
            {departments.map((d) => (
              <DepartmentColumn key={d.id} parent={d} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ------------------
  // RENDER
  // ------------------

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {loading ? (
        <div className="text-center py-20">Loading team...</div>
      ) : root ? (
        renderHierarchy(root)
      ) : (
        <p className="text-center text-gray-500">No team data found.</p>
      )}
    </div>
  );
}
