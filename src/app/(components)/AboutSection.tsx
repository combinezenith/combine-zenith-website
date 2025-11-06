'use client';

<<<<<<< HEAD
=======
import Image from 'next/image';
>>>>>>> 7bd70a4a52f52ccacd1b5a00122f607bd90d4e2d
import TextType from './TextType';
import Masonry from './Masonry';

export default function AboutSection() {
  const items = [
    {
      id: "1",
      img: "/partners/1.jpg",
      url: "#",
      height: 200,
    },
    {
      id: "2",
      img: "/partners/2.jpg",
      url: "#",
      height: 200,
    },
    {
      id: "3",
      img: "/partners/3.jpg",
      url: "#",
      height: 200,
    },
    {
      id: "4",
      img: "/partners/4.jpg",
      url: "#",
      height: 200,
    },
    {
      id: "5",
      img: "/partners/5.jpg",
      url: "#",
      height: 200,
    },
    {
      id: "6",
      img: "/partners/6.jpg",
      url: "#",
      height: 200,
    },
    {
      id: "7",
      img: "/partners/7.jpg",
      url: "#",
      height: 200,
    },
    {
      id: "8",
      img: "/partners/8.jpg",
      url: "#",
      height: 200,
    },
    {
      id: "9",
      img: "/partners/9.jpg",
      url: "#",
      height: 200,
    },
    {
      id: "10",
      img: "/partners/10.jpg",
      url: "#",
      height: 200,
    },
    {
      id: "11",
      img: "/partners/11.jpg",
      url: "#",
      height: 200,
    },
    {
      id: "12",
      img: "/partners/12.jpg",
      url: "#",
      height: 200,
    },
    {
      id: "13",
      img: "/partners/13.jpg",
      url: "#",
      height: 200,
    },
    {
      id: "14",
      img: "/partners/14.jpg",
      url: "#",
      height: 200,
    },
    {
      id: "15",
      img: "/partners/15.jpg",
      url: "#",
      height: 200,
    },
    {
      id: "16",
      img: "/partners/16.jpg",
      url: "#",
      height: 200,
    },
    {
      id: "17",
      img: "/partners/17.jpg",
      url: "#",
      height: 200,
    },
    {
      id: "18",
      img: "/partners/18.jpg",
      url: "#",
      height: 200,
    },
    {
      id: "19",
      img: "/partners/19.jpg",
      url: "#",
      height: 200,
    },
    {
      id: "20",
      img: "/partners/20.jpg",
      url: "#",
      height: 200,
    },
    {
      id: "21",
      img: "/partners/21.jpg",
      url: "#",
      height: 200,
    },
    {
      id: "22",
      img: "/partners/22.jpg",
      url: "#",
      height: 200,
    },
    {
      id: "23",
      img: "/partners/23.jpg",
      url: "#",
      height: 200,
    },
    {
      id: "24",
      img: "/partners/24.jpg",
      url: "#",
      height: 200,
    },
    {
      id: "25",
      img: "/partners/25.jpg",
      url: "#",
      height: 200,
    },
  ];

<<<<<<< HEAD
=======
  // Split logos into two groups for the two rows
  const row1Logos = logos.slice(0, 13);
  const row2Logos = logos.slice(13, 25);

>>>>>>> 7bd70a4a52f52ccacd1b5a00122f607bd90d4e2d
  return (
    <section aria-label="About Section" className="py-8 md:py-20 px-4 sm:px-6">
      <div aria-label="About Container" className="container mx-auto max-w-6xl">
        {/* About Content */}
        <div aria-label="About Content" className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-5xl font-bold text-white mb-4 md:mb-8">
            <TextType 
              text={["Driven by Creativity.", "Defined by Connection."]}
              typingSpeed={75}
              pauseDuration={1500}
              showCursor={true}
              cursorCharacter="|"
            />
          </h2>
          <p className="text-purple-200 text-sm md:text-xl leading-relaxed max-w-4xl mx-auto">
            At Combine Zenith, we&apos;re more than just a creative agency we&apos;re a collective of dreamers, thinkers, and makers who believe that every brand has a story worth telling. We listen deeply, think boldly, and create passionately blending imagination with strategy to turn ideas into powerful experiences. Our work goes beyond visuals and campaigns it&apos;s about building meaning, trust, and impact that last. From shaping your identity to creating measurable growth, we walk beside you as true partners crafting stories that inspire, connect, and make a difference.
          </p>
        </div>

        {/* Trusted By Section */}
        <div aria-label="Trusted Companies" className="bg-purple-800/30 backdrop-blur-sm rounded-xl md:rounded-3xl p-4 md:p-16 min-h-[600px] md:min-h-[1000px] flex flex-col">
          <h3 className="text-xl md:text-4xl font-bold text-white text-center mb-6 md:mb-12">
            Trusted by Industry Leaders.
          </h3>

<<<<<<< HEAD
          <div className="flex-1 relative min-h-[400px] md:min-h-[300px]">
            <Masonry
              items={items}
              ease="power3.out"
              duration={0.6}
              stagger={0.05}
              animateFrom="bottom"
              scaleOnHover={true}
              hoverScale={0.95}
              blurToFocus={true}
              colorShiftOnHover={false}
            />
=======
          {/* Row 1 - moves left */}
          <div aria-label="Logo Row 1" className="relative overflow-hidden">
            <div aria-label="Scrolling Logos" className="flex animate-marquee-left gap-12">
              {row1Logos.map((logo, index) => (
                <div
                  key={`row1-${index}`}
                  className="w-48 h-24 flex items-center justify-center bg-white/10 rounded-xl p-4"
                >
                  <Image
                    src={logo}
                    alt={`Partner Company ${index + 1}`}
                    fill
                    className="object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              ))}
              {/* Duplicate for smooth loop */}
              {row1Logos.map((logo, index) => (
                <div
                  key={`row1-copy-${index}`}
                  className="w-48 h-24 flex items-center justify-center bg-white/10 rounded-xl p-4"
                >
                  <Image
                    src={logo}
                    alt={`Partner Company ${index + 1}`}
                    fill
                    className="object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 - moves right */}
          <div aria-label="Logo Row 2" className="relative overflow-hidden mt-12">
            <div aria-label="Scrolling Logos Reverse" className="flex animate-marquee-right gap-12">
              {row2Logos.map((logo, index) => (
                <div
                  key={`row2-${index}`}
                  className="w-48 h-24 flex items-center justify-center bg-white/10 rounded-xl p-4"
                >
                  <Image
                    src={logo}
                    alt={`Partner Company ${index + 14}`}
                    fill
                    className="object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {row2Logos.map((logo, index) => (
                <div
                  key={`row2-copy-${index}`}
                  className="w-48 h-24 flex items-center justify-center bg-white/10 rounded-xl p-4"
                >
                  <Image
                    src={logo}
                    alt={`Partner Company ${index + 14}`}
                    fill
                    className="object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              ))}
            </div>
>>>>>>> 7bd70a4a52f52ccacd1b5a00122f607bd90d4e2d
          </div>
        </div>
      </div>
    </section>
  );
}