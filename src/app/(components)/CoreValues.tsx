'use client';

export default function CoreValues() {
  const values = [
    {
      title: "Authenticity",
      description: "We believe that true impact begins with honesty and heart. Every story we tell and every project we create is rooted in genuine purpose and human connection.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      title: "Creativity",
      description: "Innovation begins with imagination. We explore every idea, reimagine boundaries, and transform visions into powerful creative realities.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "Collaboration",
      description: "We don't just work for our clients we grow with them. Partnership, trust, and shared passion are at the core of everything we build together.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: "Integrity",
      description: "Every decision we make is guided by trust, transparency, and responsibility. We value doing what's right not what's easy.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "Innovation",
      description: "The world changes fast and we evolve faster. We embrace new technologies, ideas, and possibilities to keep your brand always ahead of the curve.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      )
    },
    {
      title: "Client-Centricity",
      description: "Our clients are at the heart of everything we do. We listen, understand, and co-create building solutions that reflect their goals, values, and vision for growth.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];

  return (
    <section aria-label="Core Values Section" className="relative py-20 overflow-hidden">
      {/* Background Elements */}
      <div aria-label="Background Decorations" className="absolute inset-0 overflow-hidden">
        <div aria-label="Background Blur Circle 1" className="absolute -top-32 -left-32 w-64 h-64 rounded-full blur-3xl" />
        <div aria-label="Background Blur Circle 2" className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full blur-3xl" />
        <div aria-label="Background Blur Circle 3" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div aria-label="Core Values Container" className="container mx-auto px-6 relative z-10">
        <div aria-label="Core Values Content" className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div aria-label="Core Values Header" className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Our Core Values
            </h1>
            </div>

          {/* Values Grid */}
          <div aria-label="Values Grid" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-purple-400/30 transition-all duration-300 hover:transform hover:scale-105 group"
              >
                <div aria-label="Value Item" className="flex items-start space-x-4">
                  <div aria-label="Value Icon" className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
                    <div aria-hidden="true" className="text-white">
                      {value.icon}
                    </div>
                  </div>
                  <div aria-label="Value Content" className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-3 transition-all duration-300">
                      {value.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}