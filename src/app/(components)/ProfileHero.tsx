'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { StaticImageData } from 'next/image';

interface TeamMember {
  name: string;
  role: string;
  tagline: string;
  image: string | StaticImageData;
}

interface ProfileHeroSectionProps {
  member: TeamMember;
}

export default function ProfileHeroSection({ member }: ProfileHeroSectionProps) {
  const router = useRouter();

  const handleBackToTeam = () => {
    router.push('/team');
  };

  return (
    <div className="relative h-96 w-full overflow-hidden rounded-3xl">
      {/* Background Image */}
      <div className="absolute inset-0">
        {typeof member.image === 'string' ? (
          // For external URLs
          <Image
            src={member.image}
            alt={member.name}
            layout="fill"
            className="w-full h-full object-cover"
          />
        ) : (
          // For local images (StaticImageData)
          <Image
            src={member.image}
            alt={member.name}
            width={800}
            height={800}
            className="w-full h-full object-cover"
            placeholder="blur"
            fill
            sizes="100vw"
          />
        )}
        {/* Purple/Blue Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-800/80 via-indigo-800/70 to-blue-900/60"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-8">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          {member.name}
        </h1>
        
        <p className="text-xl md:text-2xl text-purple-100 font-light mb-6 drop-shadow-md">
          {member.role}
        </p>
        
        <p className="text-gray-200 text-base md:text-lg max-w-2xl mb-10 drop-shadow-md">
          {member.tagline}
        </p>
        
        {/* Back to Team Button */}
        <button
          onClick={handleBackToTeam}
          className="bg-white/95 hover:bg-white text-purple-900 font-semibold px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl"
        >
          Back to Team
        </button>
      </div>
    </div>
  );
}