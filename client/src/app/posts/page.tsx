"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import Footer from "@/components/landing/Footer";
import { useAuth } from "@/lib/UserContext";
import { fetchPostsWithReplies } from "@/lib/api";
import { useLikePost, useUpdatePost, ReplyResponse } from "@/lib/mutations";
import PostComposer from "@/components/posts/PostComposer";
import PostItem, { Post } from "@/components/posts/PostsItem";
import toast from "react-hot-toast";

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://mindspace-backend-gusv.onrender.com";

export default function PostsFeedPage() {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const [showComment, setShowComment] = useState<string | null>(null);
  const [replyInputs, setReplyInputs] = useState<{ [postId: string]: string }>(
    {}
  );
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [likesCount, setLikesCount] = useState<{ [postId: string]: number }>(
    {}
  );
  const [repliesCount, setRepliesCount] = useState<{
    [postId: string]: number;
  }>({});
  const [posts, setPosts] = useState<(Post & { replies?: ReplyResponse[] })[]>(
    []
  );
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [openShareId, setOpenShareId] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);

  const likePostMutation = useLikePost(user?.access_token || "");
  const updatePostMutation = useUpdatePost(user?.access_token || "");

  // Fetch posts and reply counts using new endpoint (with replies array)
  useEffect(() => {
    async function fetchData() {
      setLoadingPosts(true);
      try {
        const postsData: (Post & { replies?: ReplyResponse[] })[] =
          await fetchPostsWithReplies(user?.access_token || "");
        // Sort posts so the latest (highest id) is first
        postsData.sort((a, b) => Number(b.id) - Number(a.id));
        setPosts(postsData);

        const likeCounts: { [postId: string]: number } = {};
        const repliesCounts: { [postId: string]: number } = {};
        postsData.forEach((post) => {
          likeCounts[post.id] = post.likes;
          repliesCounts[post.id] = Array.isArray(post.replies)
            ? post.replies.length
            : 0;
        });
        setLikesCount(likeCounts);
        setRepliesCount(repliesCounts);
      } catch (err) {
        setPosts([]);
        setLikesCount({});
        setRepliesCount({});
      }
      setLoadingPosts(false);
    }
    fetchData();
  }, [user?.access_token]);

  // Live update reply count after posting or fetching
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
    if (!isLoggedIn || likePostMutation.isPending || !user?.access_token)
      return;
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

  // PATCH: handleSaveEdit to accept { message, new_content, post_id } response
  async function handleSaveEdit(postId: string, newContent: string) {
    return new Promise<void>((resolve, reject) => {
      updatePostMutation.mutate(
        { post_id: postId, new_content: newContent },
        {
          onSuccess: (
            data: {
              message: string;
              new_content: string;
              post_id: string | number;
            },
            _variables,
            _context
          ) => {
            setPosts(
              (old) =>
                old.map((p) =>
                  String(p.id) === String(data.post_id)
                    ? { ...p, content: data.new_content }
                    : p
                ) as (Post & { replies?: ReplyResponse[] })[]
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

  // Share logic
  function handleShare(platform: string, post: Post) {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/posts/${post.id}`
        : `/posts/${post.id}`;
    const text = encodeURIComponent(post.content);
    const encodedUrl = encodeURIComponent(url);

    if (platform === "copy") {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      }
      setOpenShareId(null);
      return;
    }

    if (
      platform === "webshare" &&
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function"
    ) {
      navigator.share({
        title: "Check out this post!",
        text: post.content,
        url,
      });
      setOpenShareId(null);
      return;
    }

    let shareUrl = "";
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${text}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${text}%20${encodedUrl}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      default:
        return;
    }
    window.open(shareUrl, "_blank", "noopener,noreferrer");
    setOpenShareId(null);
  }

  // WebSocket real-time updates
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
          return [{ ...newPost }, ...filtered];
        });
      });
      socket.on(
        "like_update",
        ({
          postId,
          likes,
          likedByMe,
        }: {
          postId: string;
          likes: number;
          likedByMe?: boolean;
        }) => {
          setLikesCount((prev) => ({ ...prev, [postId]: likes }));
          if (likedByMe !== undefined) {
            setLikedPosts((prev) => {
              const updated = new Set(prev);
              if (likedByMe) updated.add(postId);
              else updated.delete(postId);
              return updated;
            });
          }
        }
      );
      socket.on(
        "update_post",
        (data: { new_content: string; post_id: string | number }) => {
          setPosts(
            (old) =>
              old.map((p) =>
                String(p.id) === String(data.post_id)
                  ? { ...p, content: data.new_content }
                  : p
              ) as (Post & { replies?: ReplyResponse[] })[]
          );
        }
      );
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
            posts.map((post, idx) => (
              <PostItem
                key={post.id ?? `temp-${idx}`}
                post={post}
                userId={user?.id}
                liked={likedPosts.has(post.id)}
                likes={likesCount[post.id] ?? post.likes}
                repliesCount={repliesCount[post.id] || 0}
                onLike={() => handleLike(post.id)}
                onComment={() =>
                  setShowComment(showComment === post.id ? null : post.id)
                }
                showReplySection={showComment === post.id}
                replyValue={replyInputs[post.id] || ""}
                setReplyValue={(val: string) =>
                  setReplyInputs((prev) => ({
                    ...prev,
                    [post.id]: val,
                  }))
                }
                onReplyCancel={() => setShowComment(null)}
                onRepliesLoaded={(count: number) =>
                  handleRepliesFetched(post.id, count)
                }
                onReplyPosted={() => handleReplyPosted(post.id)}
                token={user?.access_token || ""}
                openShareId={openShareId}
                setOpenShareId={setOpenShareId}
                onShare={handleShare}
                onSaveEdit={handleSaveEdit}
                editPending={updatePostMutation.isPending}
              />
            ))
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}