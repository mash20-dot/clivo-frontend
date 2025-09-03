"use client";

import { useSession } from "next-auth/react";
import { Lock } from "lucide-react";
import Image from "next/image";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    author?: {
      name: string;
      avatar?: string;
    };
    createdAt: string;
  };
}

export default function PostCard({ post }: PostCardProps) {
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  return (
    <div className="relative w-full bg-white rounded-2xl shadow-md p-5 mb-6 hover:shadow-lg transition-all">
      {/* Lock Overlay if not authenticated */}
      {!isAuthenticated && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-2xl z-10">
          <div className="flex flex-col items-center text-gray-700">
            <Lock className="w-8 h-8 mb-2" />
            <p className="font-medium text-sm">Sign in to view full post</p>
          </div>
        </div>
      )}

      {/* Author Info */}
      <div className="flex items-center gap-3 mb-3">
        <Image
          src={post.author?.avatar || "/default-avatar.png"}
          alt="Author Avatar"
          className="w-10 h-10 rounded-full border"
        />
        <div>
          <h4 className="font-semibold text-gray-800">
            {post.author?.name || "Anonymous"}
          </h4>
          <span className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Post Title */}
      <h3 className="text-lg font-bold text-gray-900">{post.title}</h3>

      {/* Post Content Preview */}
      <p className="mt-2 text-gray-600 line-clamp-3">
        {isAuthenticated ? post.content : "Sign in to read the full content..."}
      </p>
    </div>
  );
}