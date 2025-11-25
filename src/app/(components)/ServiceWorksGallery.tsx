import Link from 'next/link';
import React from 'react';

type WorkItem = {
  id: string;
  image: string;
  link: string;
};

type ServiceWorksGalleryProps = {
  works: WorkItem[];
};

const ServiceWorksGallery: React.FC<ServiceWorksGalleryProps> = ({ works }) => {
  if (!works || works.length === 0) {
    return (
      <section className="py-12 text-center text-gray-400">
        No works available to display.
      </section>
    );
  }

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">Works Gallery</h2>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {works.map((work) => (
          <div
            key={work.id}
            className="bg-white p-6 rounded-lg shadow-lg overflow-hidden hover:shadow-purple-500 transition-shadow duration-300 cursor-pointer"
          >
            <Link href={work.link} passHref>
            <div className="relative w-full h-48">
              <img
                src={work.image}
                alt={work.id}
                className="object-cover w-full h-full"
              />
            </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServiceWorksGallery;
