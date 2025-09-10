"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import Footer from "@/components/landing/Footer";
import { useAuth } from "@/lib/UserContext";
import { fetchPosts } from "@/lib/api";
import { useLikePost, useUpdatePost } from "@/lib/mutations";
import PostComposer from "@/components/posts/PostComposer";
import PostItem, { Post } from "@/components/posts/PostsItem";
import RepliesSection from "@/components/posts/RepliesSection";
import toast from "react-hot-toast";

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://mindspace-backend-gusv.onrender.com";

export default function PostsFeedPage() {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const [showComment, setShowComment] = useState<string | null>(null);
  const [replyInputs, setReplyInputs] = useState<{ [postId: string]: string }>({});
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [likesCount, setLikesCount] = useState<{ [postId: string]: number }>({});
  const [repliesCount, setRepliesCount] = useState<{ [postId: string]: number }>({});
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const socketRef = useRef<Socket | null>(null);

  const likePostMutation = useLikePost(user?.access_token);
  const updatePostMutation = useUpdatePost(user?.access_token);

  useEffect(() => {
    async function fetchData() {
      setLoadingPosts(true);
      try {
        let postsData: Post[] = await fetchPosts();
        postsData = [...postsData].sort((a, b) => Number(b.id) - Number(a.id));
        setPosts(postsData);

        const likeCounts: { [postId: string]: number } = {};
        postsData.forEach((post) => {
          likeCounts[post.id] = post.likes;
        });
        setLikesCount(likeCounts);

        // Replies count: you should fetch all replies and count, similar to before
        // ... omitted for brevity, see previous code
      } catch (err) {
        setPosts([]);
        setLikesCount({});
        setRepliesCount({});
      }
      setLoadingPosts(false);
    }
    fetchData();
  }, [user?.access_token]);

  const handleRepliesFetched = useCallback((postId: string, count: number) => {
    setRepliesCount((prev) => ({ ...prev, [postId]: count }));
  }, []);
  const handleReplyPosted = useCallback((postId: string) => {
    setRepliesCount((prev) => ({
      ...prev,
      [postId]: (prev[postId] ?? 0) + 1,
    }));
  }, []);

  function handleLike(postId: string) {
    if (!isLoggedIn || likePostMutation.isPending || !user?.access_token) return;
    likePostMutation.mutate(
      { postId },
      {
        onSuccess: (data) => {
          setLikesCount((prev) => ({ ...prev, [postId]: data.likes }));
          setLikedPosts((prev) => {
            const updated = new Set(prev);
            if (data.liked) updated.add(postId);
            else updated.delete(postId);
            return updated;
          });
        },
      }
    );
  }

  async function handleSaveEdit(postId: string, newContent: string) {
    return new Promise<void>((resolve, reject) => {
      updatePostMutation.mutate(
        { post_id: postId, new_content: newContent },
        {
          onSuccess: (updated: Post) => {
            setPosts((old) =>
              old.map((p) => (p.id === updated.id ? { ...p, content: updated.content } : p))
            );
            toast.success("Post updated successfully!");
            resolve();
          },
          onError: () => {
            toast.error("Failed to update post.");
            reject();
          },
        }
      );
    });
  }

  useEffect(() => {
    if (!socketRef.current) {
      const socket = io(API_URL, {
        transports: ["websocket"],
        timeout: 60000,
      });
      socketRef.current = socket;

      socket.on("new_post", (newPost: Post) => {
        setPosts((old) => {
          const filtered = old
            ? old.filter((post) => !String(post.id).startsWith("temp-"))
            : [];
          return [newPost, ...filtered];
        });
      });
      socket.on("like_update", ({ postId, likes, likedByMe }: { postId: string; likes: number; likedByMe?: boolean }) => {
        setLikesCount((prev) => ({ ...prev, [postId]: likes }));
        if (likedByMe !== undefined) {
          setLikedPosts((prev) => {
            const updated = new Set(prev);
            if (likedByMe) updated.add(postId);
            else updated.delete(postId);
            return updated;
          });
        }
      });
      socket.on("update_post", (updatedPost: Post) => {
        setPosts((old) =>
          old.map((post) =>
            post.id === updatedPost.id ? { ...post, content: updatedPost.content } : post
          )
        );
      });
      socket.on("disconnect", () => {});
    }
    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-blue-50 flex flex-col">
      <section className="max-w-2xl w-full mx-auto flex-1 py-4 px-1 sm:px-3 md:px-0">
        <PostComposer />
        <div className="flex flex-col gap-4 sm:gap-7">
          {loadingPosts ? (
            <div className="text-center text-teal-700 py-6 font-semibold">
              Loading posts...
            </div>
          ) : posts && posts.length === 0 ? (
            <div className="text-center text-gray-400 py-6 font-medium">
              No posts yet. Be the first to share something!
            </div>
          ) : (
            posts.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                userId={user?.id}
                liked={likedPosts.has(post.id)}
                likes={likesCount[post.id] ?? post.likes}
                repliesCount={repliesCount[post.id] || 0}
                onLike={() => handleLike(post.id)}
                onComment={() =>
                  setShowComment(showComment === post.id ? null : post.id)
                }
                onShare={() => {}}
                onSaveEdit={handleSaveEdit}
                editPending={updatePostMutation.isPending}
              />
            ))
          )}
        </div>
        {showComment && (
          <RepliesSection
            postId={showComment}
            token={user?.access_token}
            replyValue={replyInputs[showComment] || ""}
            setReplyValue={(val: string) =>
              setReplyInputs((prev) => ({
                ...prev,
                [showComment]: val,
              }))
            }
            onCancel={() => setShowComment(null)}
            onRepliesLoaded={(count: number) =>
              handleRepliesFetched(showComment, count)
            }
            onReplyPosted={() => handleReplyPosted(showComment)}
          />
        )}
      </section>
      <Footer />
    </main>
  );
}