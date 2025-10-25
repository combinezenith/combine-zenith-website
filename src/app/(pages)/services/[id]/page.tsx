import Image from 'next/image';
import services from '@/app/data/services.json';
import { notFound } from 'next/navigation';
import ServicePillars from '@/app/(components)/ServicePillars';
import ServiceApproach from '@/app/(components)/FAQ';
import CTASectionEnhanced from '@/app/(components)/CTASection';

type Props = {
  // params can be provided synchronously or as a Promise in some Next.js runtimes
  params: { id: string } | Promise<{ id: string }>;
};

export default async function DynamicServices({ params }: Props) {
  const { id } = (await params) as { id: string };
  // Define a lightweight type for services we expect to render here
  type ApproachStep = { id: string; title: string; content: string };
  type Service = { slug: string; name: string; description?: string; image?: string; skills?: string[]; approach?: ApproachStep[] };

  const isService = (s: unknown): s is Service => {
    if (typeof s !== 'object' || s === null) return false;
    const maybe = s as { slug?: unknown; name?: unknown };
    return typeof maybe.slug === 'string' && typeof maybe.name === 'string';
  };

  const service = (services as unknown[]).find((s): s is Service => isService(s) && s.slug === id);
  if (!service) return notFound();

  return (
    <section aria-labelledby="service-title" className="relative w-full">
      <div className="mt-20">
        <Image
          src={service.image || '/laptop-hero.jpg'}
          alt={service.name}
          width={900}
          height={900}
          className="object-cover w-full h-96 block"
          priority
        />
      </div>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 id="service-title" className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight">
              {service.name}
            </h1>
            <p className="text-[#b589fc] text-center sm:text-lg md:text-xl">
              {service.description}
            </p>
          </div>
        </div>

      {/* Service-specific pillars */}
      <ServicePillars slugs={service.skills} />

  {/* Proven approach / accordion */}
  <ServiceApproach approach={service.approach} />

  <CTASectionEnhanced/>

    </section>
  );
}
