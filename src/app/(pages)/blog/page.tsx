import React from "react";
import FeaturedPost from "@/app/(components)/FeaturedPost";
import BlogPosts from "@/app/(components)/BlogPosts";

export default function Blog() {
  return (
    <div className="min-h-screen flex flex-col pt-30 justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a]"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(139,69,193,0.1),transparent_50%)]"></div>
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)]"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-pink-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-32 left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-2000"></div>

      <div className="text-center px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Animated Title */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent animate-fade-in-up">
              Ideas. Inspiration.
            </h1>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-pink-300 to-purple-600 bg-clip-text text-transparent animate-fade-in-up animation-delay-300">
              Impact.
            </h1>
          </div>

          {/* Animated Description */}
          <div className="animate-fade-in-up animation-delay-600">
            <p className="text-gray-300 text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-3xl mx-auto mb-12">
              At Combine Zenith, every idea begins with curiosity and every story ends with impact. Our blog is where creativity meets clarity—a place where we share insights, trends, and real lessons that help brands grow, evolve, and reach the peak of success.
            </p>
            <p className="text-purple-300 text-lg sm:text-xl lg:text-2xl font-semibold italic max-w-2xl mx-auto">
              From branding to technology, strategy to storytelling—explore thoughts that inspire action and innovation.
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="flex justify-center items-center gap-4 mt-12 mb-8">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-purple-400"></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-purple-400"></div>
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <FeaturedPost />
        <BlogPosts />
      </div>
    </div>
  );
}
