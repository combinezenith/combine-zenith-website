import Link from 'next/link';

export default function TeamCard() {
  const teamMembers = [
    {
      id: "eleanor-pena",
      name: "Eleanor Pena",
      role: "Chief Executive Officer",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop"
    },
    {
      id: "ralph-edwards",
      name: "Ralph Edwards",
      role: "Head of Marketing",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
    },
    {
      id: "esther-howard",
      name: "Esther Howard",
      role: "Strategy Lead",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop"
    },
    {
      id: "brooklyn-simmons",
      name: "Brooklyn Simmons",
      role: "Creative Director",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop"
    },
    {
      id: "cameron-williamson",
      name: "Cameron Williamson",
      role: "Creative Director",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
    },
    {
      id: "leslie-alexander",
      name: "Leslie Alexander",
      role: "Client Relations Manager",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop"
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
              {/* Team Member Image */}
              <img
                src={member.image}
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
      </div>
    </div>
  );
}