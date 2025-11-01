"use client";

import Link from "next/link";
import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { getBlogBySlug, Blog } from '../lib/blogApi';
import Image from "next/image";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface BlogPostDetailProps {
  slug: string;
}

export default function BlogPostDetail({ slug }: BlogPostDetailProps) {
  const [post, setPost] = useState<Blog | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      const fetchedPost = await getBlogBySlug(slug);
      setPost(fetchedPost);
    };
    fetchPost();
  }, [slug]);

  // If no post found, show error
  if (!post) {
    return (
      <div aria-label="" className="min-h-screen flex items-center justify-center px-4">
        <div aria-label="" className="text-center">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">Post Not Found</h1>
          <p className="text-purple-300 mb-6 text-sm md:text-base">The blog post you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/blog" className="text-purple-300 hover:text-white underline text-sm md:text-base">
            Back to all posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div aria-label="" className="min-h-screen">
      {/* Hero Image Section */}
      <div aria-label="" className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
        <Image
          src={post.image || "/placeholder-image.jpg"}
          alt={post.title || "Blog post"}
          width={1200}
          height={400}
          className="w-full h-full object-cover"
        />
        <div aria-label="" className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/50 to-indigo-950"></div>
      </div>

      {/* Content Section */}
      <div aria-label="" className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12 -mt-20 md:-mt-32 relative z-10">
        {/* Back Button */}
        <Link href="/blog" className="mt-35 flex items-center">
          <button className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to all posts</span>
          </button>
        </Link>

        {/* Article Container */}
        <article className="rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-purple-200 mb-8 md:mb-12 leading-relaxed">
            {post.description}
          </p>

          {/* Introduction Paragraph */}
          {post.content?.introduction && (
            <div aria-label={post.title} className="mb-8 md:mb-12 prose prose-invert prose-purple max-w-none">
              <div className="text-purple-100 text-base md:text-lg leading-relaxed space-y-4 [&>h1]:text-xl [&>h1]:font-bold [&>h2]:text-lg [&>h2]:font-semibold [&>h3]:text-base [&>h3]:font-semibold [&>ul]:list-disc [&>ul]:pl-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>blockquote]:border-l-4 [&>blockquote]:border-purple-400 [&>blockquote]:pl-4 [&>blockquote]:italic [&>p]:mb-4">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {post.content.introduction}
              </ReactMarkdown>
            </div>
            </div>
          )}

          {/* Quote Section */}
          {post.content?.quote && post.content.quote.text && (
            <div aria-label="" className="bg-purple-800/30 border-l-4 border-purple-400 pl-4 md:pl-6 py-4 my-6 md:my-8">
              <div className="prose prose-invert prose-purple max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {post.content.quote.text}
                </ReactMarkdown>
              </div>
              <p className="text-purple-300 text-sm md:text-base mt-2">
                - {post.content.quote.author}
              </p>
            </div>
          )}

          {/* Dynamic Sections */}
          {post.content?.sections && post.content.sections.map((section, index) => (
            <div aria-label="" key={index} className="mb-8 md:mb-10">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 md:mb-4">
                {section.heading}
              </h2>
              <p className="text-purple-100/80 leading-relaxed text-base md:text-lg mb-4 md:mb-6">
                {section.content}
              </p>
            </div>
          ))}

          {/* Conclusion */}
          {post.content?.conclusion && (
            <div aria-label="" className="mb-8 md:mb-12 prose prose-invert prose-purple max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content.conclusion}
              </ReactMarkdown>
            </div>
          )}

          {/* Author Section */}
          {post.author && (
            <div aria-label="" className="flex items-center gap-3 md:gap-4 pt-6 md:pt-8 border-t border-purple-700/30">
              <Image
                src={post.author.avatar || "/placeholder-avatar.jpg"}
                alt={post.author.name || "Author"}
                width={56}
                height={56}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover"
              />
              <div>
                <h3 className="text-white font-semibold text-sm md:text-base">{post.author.name}</h3>
                <p className="text-purple-300 text-xs md:text-sm">{post.author.role}</p>
                <p className="text-purple-400 text-xs mt-1">Updated on {post.author?.updatedAt || "Unknown"}</p>
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}