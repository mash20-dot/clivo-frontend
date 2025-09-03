"use client";

import { useQuery } from "@tanstack/react-query";
import PostCard from "@/components/posts/PostCard";
import PostSkeleton from "@/components/skeletons/PostSkeleton";
import toast from "react-hot-toast";

interface Post {
  id: string;
  title: string;
  content: string;
  author: { name: string };
  replies?: { id: string; content: string; author: { name: string } }[];
}

export default function PostsPage() {
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, idx) => (
          <PostSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (isError) {
    toast.error("Failed to load posts");
    return <p className="text-center text-gray-500">Something went wrong.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Community Posts</h1>
      <div className="space-y-4">
        {posts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}