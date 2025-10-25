import Link from "next/link";
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { blogPosts } from './blogData';

interface BlogPostDetailProps {
  slug: string;
}

export default function BlogPostDetail({ slug }: BlogPostDetailProps) {
  // Find the blog post by slug
  const post = blogPosts.find(p => p.slug === slug);

  // If no post found, show error
  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
          <p className="text-purple-300 mb-6">The blog post you're looking for doesn't exist.</p>
          <Link href="/blog" className="text-purple-300 hover:text-white underline">
            Back to all posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-indigo-900">
      {/* Hero Image Section */}
      <div className="relative w-full h-[400px] overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/50 to-indigo-950"></div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-6 py-12 -mt-32 relative z-10">
        {/* Back Button */}
        <Link href="/blog" className="flex items-center">
          <button className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to all posts</span>
          </button>
        </Link>

        {/* Article Container */}
        <article className="bg-purple-900/30 backdrop-blur-sm rounded-3xl border border-purple-700/30 p-8 md:p-12">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-purple-200 mb-12 leading-relaxed">
            {post.description}
          </p>

          {/* Introduction Paragraph */}
          {post.content?.introduction && (
            <div className="mb-12">
              <p className="text-purple-100/80 leading-relaxed mb-4">
                {post.content.introduction}
              </p>
            </div>
          )}

          {/* Dynamic Sections */}
          {post.content?.sections && post.content.sections.map((section, index) => (
            <div key={index} className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {section.heading}
              </h2>
              <p className="text-purple-100/80 leading-relaxed mb-6">
                {section.content}
              </p>
              
              {/* Add quote after second section if it exists */}
              {index === 1 && post.content?.quote && (
                <div className="bg-purple-800/30 border-l-4 border-purple-400 pl-6 py-4 my-8">
                  <p className="text-purple-100 italic text-lg leading-relaxed mb-2">
                    "{post.content.quote.text}"
                  </p>
                  <p className="text-purple-300 text-sm">
                    - {post.content.quote.author}
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Conclusion */}
          {post.content?.conclusion && (
            <div className="mb-12">
              <p className="text-purple-100/80 leading-relaxed">
                {post.content.conclusion}
              </p>
            </div>
          )}

          {/* Author Section */}
          {post.author && (
            <div className="flex items-center gap-4 pt-8 border-t border-purple-700/30">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <h3 className="text-white font-semibold">{post.author.name}</h3>
                <p className="text-purple-300 text-sm">{post.author.role}</p>
                <p className="text-purple-400 text-xs mt-1">Updated on {post.author.updatedAt}</p>
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}