import React from "react";
import FeaturedPost from "@/app/(components)/FeaturedPost";
import BlogPosts from "@/app/(components)/BlogPosts";

export default function Blog() {
  return (   
     <div className="min-h-screen py-8 md:py-16 px-4">
      <div className="max-w-4xl mx-auto mt-8 md:mt-10"></div>
    <div className="text-center mb-8 md:mb-12">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
        Ideas. Inspiration. Impact.
      </h1>
      <p className="text-purple-200 text-base md:text-lg max-w-2xl mx-auto">
        At Combine Zenith, every idea begins with curiosity and every story ends with impact. Our blog is where creativity meets clarity a place where we share insights, trends, and real lessons that help brands grow, evolve, and reach the peak of success.
        From branding to technology, strategy to storytelling explore thoughts that inspire action and innovation.
      </p>
      <FeaturedPost />
      <BlogPosts />
    </div>
    </div>
  );
}