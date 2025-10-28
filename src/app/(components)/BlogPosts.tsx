import React from 'react';
import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';
import { blogPosts } from './blogData';
import Image from 'next/image';

export default function BlogPosts() {
  // Get all non-featured posts
  const posts = blogPosts.filter(post => !post.featured);

  return (
    <div aria-label='' className="min-h-screen py-16 px-4">
      <div aria-label='' className="max-w-7xl mx-auto">
        {/* Grid Layout */}
        <div aria-label='' className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <div aria-label='' className="bg-[#685885] rounded-2xl overflow-hidden border border-purple-700/30 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 group flex flex-col cursor-pointer h-full">
                {/* Image Container */}
                <div aria-label='' className="relative overflow-hidden h-48 w-full">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={400}
                    height={192}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Content Container */}
                <div aria-label='' className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-purple-300 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-purple-200/70 text-sm mb-4 leading-relaxed flex-grow line-clamp-3">
                    {post.description}
                  </p>

                  {/* Meta Information */}
                  <div aria-label='' className="flex items-center gap-4 text-purple-300/60 text-xs mb-4">
                    <div aria-label='' className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{post.date}</span>
                    </div>
                    <div aria-label='' className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  {/* Read More Button */}
                  <button className="text-white text-sm font-medium hover:text-purple-300 transition-colors self-start">
                    Read More
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}