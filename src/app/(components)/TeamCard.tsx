import Link from 'next/link';
import Jibran from "../../../public/Jibran.png"
import Waqas from "../../../public/Waqas.jpg"
import Hamza from "../../../public/Hamza.jpeg"
import Umer from "../../../public/Umer.jpeg"
import Esha from "../../../public/Esha.png"
import Image from 'next/image';

export default function TeamCard() {
  const teamMembers = [
    {
      id: "Muhammad-Jibran-Rehan",
      name: "Muhammad Jibran Rehan",
      role: "Chief Executive Officer",
      image: Jibran
    },
    {
      id: "Waqas-Ahmed",
      name: "Waqas Ahmed",
      role: "Head of Marketing",
      image: Waqas
    },
    {
      id: "Hamza-Ali",
      name: "Hamza Ali",
      role: "Strategy Lead",
      image: Hamza
    },
    {
      id: "Muhammad-Umer",
      name: "Muhammad Umer",
      role: "Creative Director",
      image: Umer
    },
    {
      id: "cameron-williamson",
      name: "Muhammad Shabbir Sabir",
      role: "Creative Director",
      image: "PIC"
    },
    {
      id: "Esha",
      name: "Esha",
      role: "Client Relations Manager",
      image: Esha
    }
  ];

  return (
    <div className="min-h-screen py-20 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <h2 className="text-5xl font-bold text-white text-center mb-20">
          Our Talented Team
        </h2>
        
        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <Link 
              key={member.id} 
              href={`/team/${member.id}`}
              className="relative rounded-3xl overflow-hidden shadow-2xl group cursor-pointer block"
              style={{ aspectRatio: '1 / 1.25' }}
            >
              {/* Team Member Image - Use Next.js Image for local, img for external */}
              {typeof member.image === 'string' ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <Image
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  placeholder="blur"
                />
              )}
              
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
      </div>
    </div>
  );
}