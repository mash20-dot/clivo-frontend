"use client";

import { useSession } from "next-auth/react";
import LockOverlay from "@/components/ui/LockOverlay";
import { MessageSquare } from "lucide-react";

interface Reply {
  id: string;
  content: string;
  author: { name: string };
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: { name: string };
  replies?: Reply[];
}

export default function PostCard({ post }: { post: Post }) {
  const { data: session } = useSession();

  return (
    <div className="relative bg-white rounded-xl shadow p-5 hover:shadow-lg transition">
      {/* Post Title */}
      <h2 className="text-lg font-semibold">{post.title}</h2>

      {/* Post Content */}
      <p className="text-gray-600 mt-2">
        {session
          ? post.content
          : post.content.length > 150
          ? `${post.content.slice(0, 150)}...`
          : post.content}
      </p>

      {/* Post Author */}
      <p className="mt-3 text-sm text-gray-500">
        By {post.author?.name ?? "Anonymous"}
      </p>

      {/* Replies */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
          <MessageSquare className="w-4 h-4" />
          <span>{post.replies?.length || 0} replies</span>
        </div>

        {session ? (
          post.replies && post.replies.length > 0 ? (
            post.replies.map((reply) => (
              <div
                key={reply.id}
                className="bg-gray-50 border rounded-lg p-2 text-sm"
              >
                <p className="text-gray-700">{reply.content}</p>
                <span className="text-xs text-gray-400">
                  — {reply.author?.name ?? "Anonymous"}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400 italic">No replies yet</p>
          )
        ) : (
          <div className="relative bg-gray-100 rounded-lg p-3 text-gray-400 text-sm">
            Replies are locked.
            <LockOverlay />
          </div>
        )}
      </div>

      {/* Lock overlay for the whole post if not signed in */}
      {!session && <LockOverlay />}
    </div>
  );
}