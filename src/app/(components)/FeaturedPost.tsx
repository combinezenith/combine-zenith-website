import React from 'react';
import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';
import { blogPosts } from './blogData';
import Image from 'next/image';

export default function FeaturedPost() {
  const featuredPost = blogPosts.find(post => post.featured);

  if (!featuredPost) return null;

  return (
    <div className="min-h-screen py-8 md:py-16 px-4">
      <div className="max-w-4xl mx-auto mt-8 md:mt-10">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Our Latest Insights
          </h1>
          <p className="text-purple-200 text-base md:text-lg max-w-2xl mx-auto">
            Stay informed with Combine Zenith&apos;s expertise. Explore articles, strategies, and industry news crafted to elevate your business.
          </p>
        </div>

        {/* Featured Card */}
        <Link href={`/blog/${featuredPost.slug}`}>
          <div className="mx-0 md:mr-[-195px] md:ml-[-195px] rounded-xl md:rounded-2xl overflow-hidden border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 group cursor-pointer">
            {/* Image Container */}
            <div className="relative overflow-hidden">
              <Image
                src={featuredPost.image}
                alt={featuredPost.title}
                width={800}
                height={400}
                className="w-full h-48 md:h-64 lg:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Featured Tag */}
              <div className="absolute top-4 left-4 md:top-6 md:left-6">
                <span className="text-white px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium border border-indigo-700">
                  {featuredPost.tag}
                </span>
              </div>
            </div>

            {/* Content Container */}
            <div className="p-6 md:p-8">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 md:mb-4 group-hover:text-purple-300 transition-colors">
                {featuredPost.title}
              </h2>
              <p className="text-purple-100/80 text-sm md:text-base lg:text-lg mb-4 md:mb-6 leading-relaxed">
                {featuredPost.description}
              </p>

              {/* Meta Information */}
              <div className="flex items-center gap-4 md:gap-6 text-purple-200/70 text-xs md:text-sm">
                <div className="flex items-center gap-1 md:gap-2">
                  <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                  <span>{featuredPost.date}</span>
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  <Clock className="w-3 h-3 md:w-4 md:h-4" />
                  <span>{featuredPost.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}