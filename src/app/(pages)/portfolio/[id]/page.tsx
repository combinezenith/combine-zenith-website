import { notFound } from 'next/navigation';
import { collection, getDocs, doc, getDoc, DocumentData } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import Image from 'next/image';
import Link from 'next/link';

type PortfolioItem = {
  id: string;
  title: string;
  category?: string;
  description: string;
  imageUrl: string;
  overview?: string;
  client?: {
    name: string;
    industry: string;
    location: string;
  };
  highlights?: string[];
  technologies?: string[];
  metrics?: {
    efficiency: string;
    satisfaction: string;
    rating: string;
  };
};

type Params = {
  params: { id: string };
};

export async function generateStaticParams() {
  try {
    const snapshot = await getDocs(collection(db, "portfolios"));
    return snapshot.docs.map((doc) => ({ id: doc.id }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function PortfolioDetail({ params }: Params) {
  const id = params.id;
  let item: PortfolioItem | null = null;

  try {
    const docRef = doc(db, "portfolios", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      item = { id: docSnap.id, ...(docSnap.data() as DocumentData) } as PortfolioItem;
    }
  } catch (error) {
    console.error("Error fetching portfolio:", error);
  }

  if (!item) return notFound();

  return (
    <div className="min-h-screen text-white px-4 py-12">
      <div className="w-full mb-12">
        <div className="relative animate-fadeIn">
          <Image
            src={item.imageUrl || '/logo.jpg'}
            alt={item.title}
            width={1600}
            height={600}
            className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-xl"
          />
            {/* Large left title + right info */}
            <div className=" rounded-xl flex flex-col md:flex-row items-center md:items-center">
              <div className="flex-1 px-6 py-8 text-center md:text-left">
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-tight text-white/95 animate-slideInLeft">Project Details</h2>
              </div>
              <div className="w-full md:w-1/2 px-6 py-8 text-center md:text-left animate-slideInRight">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-100">{item.title}</h1>
                <p className="mt-4 text-gray-300 text-sm sm:text-base">{item.overview || item.description}</p>
              </div>
            </div>


        </div>
      </div>
      <div className="max-w-7xl mx-auto animate-slideUp">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Column - Client Info & Key Highlights */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Client Information */}
            {item.client && (
              <div className="bg-[#685885] bg-opacity-20 rounded-xl p-4 md:p-6 animate-scaleIn">
                <h2 className="text-xl md:text-2xl font-semibold mb-4">Client Information</h2>
                <div className="space-y-3">
                  <p><span className="text-[#200053]">Company:</span> {item.client.name}</p>
                  <p><span className="text-[#200053]">Industry:</span> {item.client.industry}</p>
                  <p><span className="text-[#200053]">Location:</span> {item.client.location}</p>
                </div>
              </div>
            )}

            {/* Key Project Highlights */}
            {item.highlights && item.highlights.length > 0 && (
              <div className="bg-[#685885] bg-opacity-50 rounded-xl p-4 md:p-6 animate-scaleIn">
                <h2 className="text-xl md:text-2xl font-semibold mb-6">Key Project Highlights</h2>
                <ul className="space-y-6">
                  {item.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-6 animate-slideInLeft" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="shrink-0 w-12 h-12 rounded-full bg-purple-700 flex items-center justify-center font-semibold text-white text-lg">
                        {index + 1}
                      </div>
                      <div className="text-gray-100 font-semibold">{highlight}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column - Technologies & Results */}
          <div className="space-y-6 md:space-y-8">
            {/* Technologies & Frameworks */}
            {item.technologies && item.technologies.length > 0 && (
              <div className="bg-[#685885] bg-opacity-50 rounded-xl p-4 md:p-6 animate-scaleIn">
                <h2 className="text-xl md:text-2xl font-semibold mb-4">Technologies & Frameworks</h2>
                <div className="flex flex-wrap gap-2">
                  {item.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-300 text-[#200053] rounded-full text-sm animate-fadeIn"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Results & Impact */}
            {item.metrics && (
              <div className="bg-[#685885] bg-opacity-50 rounded-xl p-4 md:p-6 animate-scaleIn">
                <h2 className="text-xl md:text-2xl font-semibold mb-4">Results & Impact</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-purple-900 bg-opacity-50 rounded-lg animate-slideUp" style={{ animationDelay: '0.1s' }}>
                    <div className="text-2xl font-bold text-white">{item.metrics.efficiency}</div>
                    <div className="text-sm text-gray-300">Efficiency</div>
                  </div>
                  <div className="text-center p-4 bg-purple-900 bg-opacity-50 rounded-lg animate-slideUp" style={{ animationDelay: '0.2s' }}>
                    <div className="text-2xl font-bold text-white">{item.metrics.satisfaction}</div>
                    <div className="text-sm text-gray-300">ROI</div>
                  </div>
                  <div className="text-center p-4 bg-purple-900 bg-opacity-50 rounded-lg animate-slideUp" style={{ animationDelay: '0.3s' }}>
                    <div className="text-2xl font-bold text-white">{item.metrics.rating}</div>
                    <div className="text-sm text-gray-300">Client Rating</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 animate-fadeIn">
          <Link
            href="/portfolio"
            className="inline-flex items-center px-6 py-3 bg-purple-900 hover:bg-purple-700 rounded-lg text-white transition-colors duration-300 hover:scale-105"
          >
            ← Back to Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
