import Image, { StaticImageData } from 'next/image';
import { IconType } from 'react-icons';
import { LuLightbulb, LuTarget, LuPalette, LuVideo, LuSearch, LuTrendingUp, LuCode, LuPrinter } from 'react-icons/lu';

interface Service {
  name: string;
  description: string;
  icon: IconType;
  image?: StaticImageData | string
}

const services: Service[] = [
  {
    name: 'Branding Identity',
    description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam, amet obcaecati tenetur reiciendis sunt numquam,distinctio fuga! Veniam aliquam reiciendis libero magni?",
    icon: LuLightbulb,
  },
  {
    name: 'Creative Strategy',
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, Quisquam, voluptatum. Quisquam, voluptatum.",
    icon: LuTarget,
  },
  {
    name: 'Creative Work',
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, Quisquam, voluptatum. Quisquam, voluptatum.",
    icon: LuPalette,
  },
  {
    name: 'Ai Videos',
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, Quisquam, voluptatum. Quisquam, voluptatum.",
    icon: LuVideo,
  },
  {
    name: 'SEO',
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, Quisquam, voluptatum. Quisquam, voluptatum.",
    icon: LuSearch,
  },
  {
    name: 'Performance Marketing',
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, Quisquam, voluptatum. Quisquam, voluptatum.",
    icon: LuTrendingUp,
  },
  {
    name: 'Website Development',
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, Quisquam, voluptatum. Quisquam, voluptatum.",
    icon: LuCode,
  },
  {
    name: 'All Print Productions',
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, Quisquam, voluptatum. Quisquam, voluptatum.",
    icon: LuPrinter,
  },
];
 
export default function ServiceCard() {
  return (
    // Use 1 column on small screens and 3 columns on large (laptop/desktop)
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-4 md:mx-8 lg:mx-12 my-8 p-4 md:p-6 text-center justify-center items-center ">
      {services.map((service, index) => {
        const Icon = service.icon;
        return (
          <div
            key={index}
            className="group relative bg-[#685885] backdrop-blur rounded-2xl transition-all duration-300 hover:scale-105 overflow-hidden flex flex-col"
          >
            {/* Top image with fixed height for consistent cards */}
            <div className="w-full h-44 md:h-48 lg:h-48 relative">
              <Image
                src={service.image || '/logo.jpg'}
                alt={service.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </div>

            <div className="p-4 md:p-6 flex-1 flex flex-col">
              {/* Icon + Title */}
              <div className="mb-4 flex items-center gap-3 justify-center"> 
                <div className="h-12 w-12 bg-[#b5a6d0] rounded-lg flex items-center justify-center">
                 <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </div>               
                <h3 className="text-lg md:text-xl font-bold text-white">
                  {service.name}
                </h3>
              </div>

              {/* Description */}
              <p className="text-purple-200 text-sm leading-relaxed mb-6">
                {service.description}
              </p>

              <div className="mt-auto">
                <button className="bg-[#b5a6d0] w-full p-3 rounded-full text-sm font-medium">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
