import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../config/firebase";
import { Timestamp } from "firebase/firestore";

export interface Blog {
  id?: string;
  slug?: string;
  tag?: string;
  image?: string;
  title?: string;
  description?: string;
  date?: string;
  readTime?: string;
  featured?: boolean;
  content?: {
    introduction?: string;
    sections?: { heading: string; content: string }[];
    quote?: { text: string; author: string };
    conclusion?: string;
  };
  author?: {
    name?: string;
    role?: string;
    avatar?: string;
    updatedAt?: string;
  };
  status?: "published" | "draft";
  createdAt?: Timestamp;
}

export async function getBlogs(): Promise<Blog[]> {
  try {
    const q = query(collection(db, "blogs"));
    const querySnapshot = await getDocs(q);
    const blogs: Blog[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Blog;
      if (data.status === "published") {
        blogs.push({ id: doc.id, ...data });
      }
    });
    // Sort by createdAt descending
    blogs.sort((a, b) => {
      const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return bTime - aTime;
    });
    return blogs;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  try {
    const q = query(collection(db, "blogs"));
    const querySnapshot = await getDocs(q);
    const blog = querySnapshot.docs.find(doc => {
      const data = doc.data() as Blog;
      return data.slug === slug && data.status === "published";
    });
    if (blog) {
      return { id: blog.id, ...blog.data() } as Blog;
    }
    return null;
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    return null;
  }
}
