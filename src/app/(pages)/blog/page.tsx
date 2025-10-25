import React from "react";
import FeaturedPost from "@/app/(components)/FeaturedPost";
import BlogPosts from "@/app/(components)/BlogPosts";

export default function Blog() {
  return (
    <div className="">
      <FeaturedPost />
      <BlogPosts />
    </div>
  );
}