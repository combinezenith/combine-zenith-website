import React from "react";
import BlogPostDetail from "@/app/(components)/BlogDetail";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DynamicBlog({ params }: PageProps) {
  const { id } = await params;
  
  return (
    <div>
      <BlogPostDetail slug={id} />
    </div>
  );
}