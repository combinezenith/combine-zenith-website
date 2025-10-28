'use client';

export default function AboutSection() {
  return (
    <section aria-label="About Section" className="py-20 px-6">
      <div aria-label="About Container" className="container mx-auto max-w-6xl">
        {/* About Content */}
        <div aria-label="About Content" className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Driven by Creativity. Defined by Connection.
          </h2>
          <p className="text-purple-200 text-lg md:text-xl leading-relaxed max-w-4xl mx-auto">
            At Combine Zenith, we&apos;re more than just a creative agency we&apos;re a collective of dreamers, thinkers, and makers who believe that every brand has a story worth telling. We listen deeply, think boldly, and create passionately blending imagination with strategy to turn ideas into powerful experiences. Our work goes beyond visuals and campaigns it&apos;s about building meaning, trust, and impact that last. From shaping your identity to creating measurable growth, we walk beside you as true partners crafting stories that inspire, connect, and make a difference.
          </p>
        </div>

        {/* Trusted By Section */}
        <div aria-label="Trusted Companies" className="bg-purple-800/30 backdrop-blur-sm rounded-3xl p-12 md:p-16 overflow-hidden">
          <h3 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Trusted by Industry Leaders.
          </h3>

          {/* Row 1 - moves left */}
          <div aria-label="Logo Row 1" className="relative overflow-hidden">
            <div aria-label="Scrolling Logos" className="flex animate-marquee-left gap-12">
              {[...Array(6)].map((_, index) => (
                <div
                  key={`row1-${index}`}
                  className="w-48 h-24 bg-[#b5a6d0] rounded-xl flex items-center justify-center text-white font-semibold text-lg"
                >
                  Logo {index + 1}
                </div>
              ))}
              {/* Duplicate for smooth loop */}
              {[...Array(6)].map((_, index) => (
                <div
                  key={`row1-copy-${index}`}
                  className="w-48 h-24 bg-[#b5a6d0] rounded-xl flex items-center justify-center text-white font-semibold text-lg"
                >
                  Logo {index + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 - moves right */}
          <div aria-label="Logo Row 2" className="relative overflow-hidden mt-12">
            <div aria-label="Scrolling Logos Reverse" className="flex animate-marquee-right gap-12">
              {[...Array(6)].map((_, index) => (
                <div
                  key={`row2-${index}`}
                  className="w-48 h-24 bg-[#b5a6d0] rounded-xl flex items-center justify-center text-white font-semibold text-lg"
                >
                  Logo {index + 1}
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {[...Array(6)].map((_, index) => (
                <div
                  key={`row2-copy-${index}`}
                  className="w-48 h-24 bg-[#b5a6d0] rounded-xl flex items-center justify-center text-white font-semibold text-lg"
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
          animation: marquee-left 15s linear infinite;
          width: max-content;
        }
        .animate-marquee-right {
          animation: marquee-right 15s linear infinite;
          width: max-content;
        }
      `}</style>
    </section>
  );
}