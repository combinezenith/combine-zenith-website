"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';
import { collection, getDocs, DocumentData } from 'firebase/firestore';
import { db } from '../config/firebase';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface BlogPost {
  id: string;
  slug?: string;
  title?: string;
  description?: string;
  image?: string;
  date?: string;
  readTime?: string;
  tag?: string;
  featured?: boolean;
}

export default function BlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const blogsSnapshot = await getDocs(collection(db, 'blogs'));
        const blogs: BlogPost[] = blogsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as DocumentData),
        })) as BlogPost[];

        // Find the most recent featured blog
        const featured = blogs.find(post => post.featured);
        // Exclude the most recent featured blog from the list
        const nonFeaturedPosts = blogs.filter(post => post.id !== featured?.id);
        setPosts(nonFeaturedPosts);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    if (posts.length > 0 && gridRef.current) {
      // Animate cards on scroll
      gsap.fromTo(gridRef.current.children,
        {
          opacity: 0,
          y: 50,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, [posts]);

  return (
    <div aria-label='' className="min-h-screen py-16 px-4">
      <div aria-label='' className="max-w-7xl mx-auto">
        {/* Grid Layout */}
        <div
          ref={gridRef}
          aria-label=''
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <div aria-label='' className=" rounded-2xl overflow-hidden border border-purple-700/30 hover:border-purple-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-purple-500/20 group flex flex-col cursor-pointer h-full relative">
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Image Container */}
                <div aria-label='' className="relative overflow-hidden h-48 w-full">
                  <Image
                    src={post.image || "/placeholder-image.jpg"}
                    alt={post.title || "Blog post"}
                    width={400}
                    height={192}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Overlay Effects */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Content Container */}
                <div aria-label='' className="p-6 flex flex-col flex-grow relative z-10">
                  <h3 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-purple-300 transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-purple-200/70 text-sm mb-4 leading-relaxed flex-grow line-clamp-3 group-hover:text-purple-100 transition-colors duration-300">
                    {post.description}
                  </p>

                  {/* Meta Information */}
                  <div aria-label='' className="flex items-center gap-4 text-purple-300/60 text-xs mb-4">
                    <div aria-label='' className="flex items-center gap-1.5 group-hover:text-purple-200 transition-colors duration-300">
                      <Calendar className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-300" />
                      <span>{post.date}</span>
                    </div>
                    <div aria-label='' className="flex items-center gap-1.5 group-hover:text-purple-200 transition-colors duration-300">
                      <Clock className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-300" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  {/* Read More Button */}
                  <button className="text-white text-sm font-medium hover:text-purple-300 transition-colors self-start group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-2">
                    Read More
                    <span className="text-purple-400 group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </button>
                </div>

                {/* Hover Reveal Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
