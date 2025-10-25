import React from "react";
import FeaturedPost from "@/app/(components)/FeaturedPost";
import BlogPosts from "@/app/(components)/BlogPosts";

export default function Blog() {
  return (
    <div className="bg-gradient-to-br from-indigo-950 via-purple-950 to-indigo-900">
      <FeaturedPost />
      <BlogPosts />
    </div>
  );
}