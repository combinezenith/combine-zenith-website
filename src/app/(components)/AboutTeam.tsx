'use client';

export default function MeetTheTeam() {
  const teamMembers = [
    {
      name: "Jane Doe",
      position: "CEO & Founder",
      description: "Welcome to the following: a journey's strategic direction and growth.",
      image: "/team/jane-doe.jpg" // Replace with actual image path
    },
    {
      name: "John Smith",
      position: "Head of Strategy",
      description: "Master strategist with a brand for crafting impactful market entry plans.",
      image: "/team/john-smith.jpg" // Replace with actual image path
    },
    {
      name: "Emily White",
      position: "Lead Creative Director",
      description: "Award-winning creative mind transforming ideas into captivating campaigns.",
      image: "/team/emily-white.jpg" // Replace with actual image path
    },
    {
      name: "David Chen",
      position: "Senior Marketing Analyst",
      description: "Data-driven expert unmoving market trends to optimize client performance.",
      image: "/team/david-chen.jpg" // Replace with actual image path
    }
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Meet the Team
            </h1>
            <br />
            </div>

          {/* Team Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-400/30 transition-all duration-300 group text-center"
              >
                {/* Profile Image Placeholder */}
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 rounded-full flex items-center justify-center transition-all duration-300">
                  <span className="text-white text-2xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                
                {/* Member Info */}
                <div className="space-y-4">
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
                <div className="flex justify-center space-x-3 mt-6 pt-6 border-t border-gray-700/50">
                  <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>

{/* Bottom CTA */}
<div className="text-center mt-16 pt-12 border-t border-gray-700/50">
  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
    Ready to Transform Your Brand?
  </h2>
  <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
    Let Combine Zenith be your strategic partner in navigating the complexities of the
    modern market. We&apos;re here to help you achieve unprecedented success.
  </p>
  <button className="px-8 py-3 bg-[#685885] text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 font-semibold">
    Contact Us Today
  </button>
</div>

        </div>
      </div>
    </section>
  );
}