'use client';

export default function AboutSection() {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* About Content */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Innovating Marketing, Inspiring Growth.
          </h2>
          <p className="text-purple-200 text-lg md:text-xl leading-relaxed max-w-4xl mx-auto">
            At Combine Zenith, we believe in the transformative power of data-driven creativity. Our
            expert team leverages cutting-edge technology and strategic insights to help businesses
            thrive in the dynamic digital landscape. We are more than just an agency; we are your
            dedicated partner in achieving sustained growth and measurable success.
          </p>
        </div>

        {/* Trusted By Section */}
        <div className="bg-purple-800/30 backdrop-blur-sm rounded-3xl p-12 md:p-16 overflow-hidden">
          <h3 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Trusted by Industry Leaders.
          </h3>

          {/* Row 1 - moves left */}
          <div className="relative overflow-hidden">
            <div className="flex animate-marquee-left gap-8">
              {[...Array(6)].map((_, index) => (
                <div
                  key={`row1-${index}`}
                  className="w-32 h-16 bg-[#b5a6d0] rounded-lg flex items-center justify-center text-white font-semibold"
                >
                  Logo {index + 1}
                </div>
              ))}
              {/* Duplicate for smooth loop */}
              {[...Array(6)].map((_, index) => (
                <div
                  key={`row1-copy-${index}`}
                  className="w-32 h-16 bg-[#b5a6d0] rounded-lg flex items-center justify-center text-white font-semibold"
                >
                  Logo {index + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 - moves right */}
          <div className="relative overflow-hidden mt-12">
            <div className="flex animate-marquee-right gap-8">
              {[...Array(12)].map((_, index) => (
                <div
                  key={`row2-${index}`}
                  className="w-32 h-16 bg-[#b5a6d0] rounded-lg flex items-center justify-center text-white font-semibold"
                >
                  Logo {index + 1}
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {[...Array(12)].map((_, index) => (
                <div
                  key={`row2-copy-${index}`}
                  className="w-32 h-16 bg-[#b5a6d0] rounded-lg flex items-center justify-center text-white font-semibold"
                >
                  Logo {index + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for marquee animations */}
      <style jsx>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes marquee-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-marquee-left {
          animation: marquee-left 30s linear infinite;
        }
        .animate-marquee-right {
          animation: marquee-right 30s linear infinite;
        }
      `}</style>
    </section>
  );
}