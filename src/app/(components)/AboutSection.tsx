'use client';

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
          </div>
        </div>
      </div>
    </section>
  );
}