import Image, { StaticImageData } from 'next/image';
import { LuFolder } from 'react-icons/lu';
import Link from 'next/link';
import portfolioData from '@/app/data/portfolio.json';

interface LocalPortfolio {
  slug: string;
  name: string;
  description: string;
  image?: string | StaticImageData;
}

const portfolios: LocalPortfolio[] = portfolioData as LocalPortfolio[];

export default function PortfolioCard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-4 md:mx-8 lg:mx-12 my-8 p-4 md:p-6 text-center justify-center items-center">
      {portfolios.map((portfolio, index) => {
        const Icon = LuFolder; // Default icon for portfolio items
        return (
          <div
            key={portfolio.slug || index}
            className="group relative bg-[#685885] backdrop-blur rounded-2xl transition-all duration-300 hover:scale-105 overflow-hidden flex flex-col"
          >
            <div className="w-full h-44 md:h-48 lg:h-48 relative">
              <Image
                src={portfolio.image || '/logo.jpg'}
                alt={portfolio.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </div>

            <div className="p-4 md:p-6 flex-1 flex flex-col">
              <div className="mb-4 flex items-center gap-3 justify-center">
                <div className="h-12 w-12 bg-[#b5a6d0] rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white">
                  {portfolio.name}
                </h3>
              </div>

              <p className="text-purple-200 text-sm leading-relaxed mb-6">
                {portfolio.description}
              </p>

              <div className="mt-auto">
                <Link href={`/portfolio/${portfolio.slug}`} className="block">
                  <span className="bg-[#b5a6d0] w-full p-3 rounded-full text-sm font-medium inline-block text-center">
                    View Project
                  </span>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
