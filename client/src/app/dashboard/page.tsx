"use client";

import { useQuery } from "@tanstack/react-query";
import Posts from "@/components/cards/post-card";
import PostSkeleton from "@/components/skeletons/PostSkeleton";
import { Button } from "@/components/ui/button";
import { useSession, signIn } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();

  // Fetch posts via React Query
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await fetch("/api/posts");
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
  });

  return (
    <section className="grid gap-6">
      <h2 className="text-2xl font-semibold">
        Welcome back, {session?.user?.name ?? "Friend"}
      </h2>
      <p className="text-gray-600">
        Here are the latest posts curated for you.
      </p>

      {/* Posts Section */}
      <div className="grid gap-4">
        {isLoading ? (
          // Show skeleton loader while fetching
          Array.from({ length: 3 }).map((_, idx) => <PostSkeleton key={idx} />)
        ) : isError ? (
          <p className="text-red-500">Failed to load posts. Try again later.</p>
        ) : posts?.length > 0 ? (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          posts.map((post: any) => (
            <div key={post.id} className="relative">
              <Posts post={post} />

              {/* Lock overlay if user is not signed in */}
              {!session && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex flex-col items-center justify-center rounded-2xl">
                  <p className="text-white font-medium mb-2 text-center px-4">
                    Sign in to view full posts and interact
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => signIn()}
                    className="shadow-md"
                  >
                    Sign In
                  </Button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No posts available yet.</p>
        )}
      </div>
    </section>
  );
}