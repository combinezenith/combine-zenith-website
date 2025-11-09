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

export default function FeaturedPost() {
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFeaturedPost = async () => {
      try {
        const blogsSnapshot = await getDocs(collection(db, 'blogs'));
        const blogs: BlogPost[] = blogsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as DocumentData),
        })) as BlogPost[];

        // Find the most recent blog that is featured
        const featured = blogs.find(post => post.featured);
        setFeaturedPost(featured || null);
      } catch (error) {
        console.error('Error fetching featured post:', error);
      }
    };
    fetchFeaturedPost();
  }, []);

  useEffect(() => {
    if (featuredPost && cardRef.current) {
      gsap.fromTo(cardRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, [featuredPost]);

  if (!featuredPost) return null;

  return (
    <div className="min-h-screen py-8 md:py-16 px-4">
      <div className="max-w-4xl mx-auto mt-8 md:mt-10">
        {/* Featured Card */}
        <Link href={`/blog/${featuredPost.slug}`}>
          <div
            ref={cardRef}
            className="mx-0 md:mr-[-195px] md:ml-[-195px] rounded-xl md:rounded-2xl overflow-hidden border border-white/10 hover:border-purple-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 group cursor-pointer relative"
          >
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Image Container */}
            <div className="relative overflow-hidden">
              <Image
                src={featuredPost.image || "/placeholder-image.jpg"}
                alt={featuredPost.title || "Featured blog post"}
                width={2000}
                height={2000}
                className="w-full h-48 md:h-64 lg:h-80 object-cover group-hover:scale-110 transition-transform duration-700"
              />
              {/* Overlay Effects */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>

              {/* Featured Tag */}
              <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10">
                <span className="text-white px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium border border-indigo-700 bg-black/50 backdrop-blur-sm group-hover:bg-purple-600/80 group-hover:border-purple-400 transition-all duration-300 transform group-hover:scale-105">
                  {featuredPost.tag}
                </span>
              </div>
            </div>

            {/* Content Container */}
            <div className="p-6 md:p-8 relative z-10">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 md:mb-4 group-hover:text-purple-300 transition-colors duration-300 leading-tight">
                {featuredPost.title}
              </h2>
              <p className="text-purple-100/80 text-sm md:text-base lg:text-lg mb-4 md:mb-6 leading-relaxed group-hover:text-purple-200 transition-colors duration-300">
                {featuredPost.description}
              </p>

              {/* Meta Information */}
              <div className="flex items-center gap-4 md:gap-6 text-purple-200/70 text-xs md:text-sm">
                <div className="flex items-center gap-1 md:gap-2 group-hover:text-purple-300 transition-colors duration-300">
                  <Calendar className="w-3 h-3 md:w-4 md:h-4 group-hover:scale-110 transition-transform duration-300" />
                  <span>{featuredPost.date}</span>
                </div>
                <div className="flex items-center gap-1 md:gap-2 group-hover:text-purple-300 transition-colors duration-300">
                  <Clock className="w-3 h-3 md:w-4 md:h-4 group-hover:scale-110 transition-transform duration-300" />
                  <span>{featuredPost.readTime}</span>
                </div>
              </div>

              {/* Hover Reveal Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl md:rounded-2xl"></div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
