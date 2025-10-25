import React from 'react';
import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';
import { blogPosts } from './blogData';
import Image from 'next/image';

export default function FeaturedPost() {
  const featuredPost = blogPosts.find(post => post.featured);

  if (!featuredPost) return null;

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto mt-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our Latest Insights
          </h1>
          <p className="text-purple-200 text-lg max-w-2xl mx-auto">
            Stay informed with Combine Zenith&apos;s expertise. Explore articles, strategies, and industry news crafted to elevate your business.
          </p>
        </div>

        {/* Featured Card */}
        <Link href={`/blog/${featuredPost.slug}`}>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 group cursor-pointer">
            {/* Image Container */}
            <div className="relative overflow-hidden">
              <Image
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Featured Tag */}
              <div className="absolute top-6 left-6">
                <span className="bg-indigo-900/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-indigo-700">
                  {featuredPost.tag}
                </span>
              </div>
            </div>

            {/* Content Container */}
            <div className="bg-purple-900/40 backdrop-blur-md p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                {featuredPost.title}
              </h2>
              <p className="text-purple-100/80 text-base md:text-lg mb-6 leading-relaxed">
                {featuredPost.description}
              </p>

              {/* Meta Information */}
              <div className="flex items-center gap-6 text-purple-200/70 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{featuredPost.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
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