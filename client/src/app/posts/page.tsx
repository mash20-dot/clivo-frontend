"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Heart,
  Repeat2,
  Share2,
  Smile,
  Image as ImageIcon,
  FileText,
  Bold,
  Italic,
  X as XIcon,
  Facebook,
  Linkedin,
  Clipboard,
} from "lucide-react";
import Footer from "@/components/landing/Footer";
import { useAuth } from "@/lib/UserContext";
import { useProfile, Profile } from "@/lib/userProfile";
import { useQueryClient } from "@tanstack/react-query";
import { fetchPosts } from "@/lib/api";
import {
  useCreatePost,
  useLikePost,
  useFetchReplies,
  useCreateReply,
} from "@/lib/mutations";
import { io, Socket } from "socket.io-client";
import { toast } from "react-hot-toast";

const tealColor = "#14b8a6";

function getFirstNameInitial(profile: Profile | null | undefined): string {
  if (!profile) return "U";
  if (
    profile.role === "user" &&
    profile.firstname &&
    profile.firstname.length > 0
  ) {
    return profile.firstname[0].toUpperCase();
  }
  if (
    profile.role === "counselor" &&
    profile.fullname &&
    profile.fullname.length > 0
  ) {
    return profile.fullname[0].toUpperCase();
  }
  return "U";
}

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://mindspace-backend-gusv.onrender.com";

type Post = {
  id: string;
  user_id: string;
  content: string;
  username: string;
  likes: number;
};

type Reply = {
  id?: string;
  post_id: string | number;
  user_id: string | number;
  content: string;
  username?: string;
  anonymous?: string;
  created_at?: string;
};

function PostReplies({
  postId,
  token,
  replyValue,
  setReplyValue,
  onCancel,
  createReplyMutation,
  onRepliesLoaded,
  onReplyPosted,
}: {
  postId: string;
  token?: string;
  replyValue: string;
  setReplyValue: (v: string) => void;
  onCancel: () => void;
  createReplyMutation: ReturnType<typeof useCreateReply>;
  onRepliesLoaded: (count: number) => void;
  onReplyPosted: () => void;
}) {
  const { data: allReplies = [], isPending } = useFetchReplies(postId, token);

  const replies = useMemo(
    () =>
      allReplies
        .filter((r) => String(r.post_id) === String(postId))
        .sort((a, b) => Number(b.id) - Number(a.id)),
    [allReplies, postId]
  );

  // Only call onRepliesLoaded when count actually changes
  const lastCountRef = useRef<number>(-1);
  useEffect(() => {
    if (replies.length !== lastCountRef.current) {
      onRepliesLoaded(replies.length);
      lastCountRef.current = replies.length;
    }
    // eslint-disable-next-line
  }, [replies.length, onRepliesLoaded]);

  return (
    <div className="mt-5 border-t pt-5 bg-gradient-to-r from-teal-50 via-white to-blue-50 rounded-2xl">
      <div className="flex flex-col sm:flex-row gap-3 items-start">
        <div className="hidden sm:flex flex-shrink-0 items-center justify-center w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-400 rounded-full shadow-lg">
          <Smile className="w-6 h-6 text-white" />
        </div>
        <div className="w-full">
          <div className="relative">
            <textarea
              value={replyValue}
              onChange={(e) => setReplyValue(e.target.value)}
              rows={2}
              maxLength={400}
              className="w-full resize-none bg-white border-2 border-teal-100 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 rounded-2xl py-3 px-4 text-sm text-gray-800 placeholder:text-gray-400 font-medium shadow-sm transition duration-200 outline-none"
              placeholder="Write a thoughtful reply…"
              style={{
                minHeight: "46px",
                boxShadow:
                  "0 2px 12px 0 rgba(20,184,166,.05), 0 1.5px 0 #d1fae5 inset",
              }}
              disabled={createReplyMutation.isPending}
            />
            <span className="absolute bottom-3 right-4 text-xs text-gray-400 select-none">
              {replyValue.length}/400
            </span>
          </div>
          <div className="flex gap-2 mt-4 justify-end">
            <button
              type="button"
              className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-xl font-semibold shadow hover:bg-gray-200 transition text-sm"
              onClick={onCancel}
              disabled={createReplyMutation.isPending}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!token) return;
                if (!replyValue || replyValue.trim() === "") return;
                createReplyMutation.mutate(
                  { post_id: String(postId), content: replyValue },
                  {
                    onSuccess: () => {
                      setReplyValue("");
                      onReplyPosted();
                    },
                  }
                );
              }}
              className={`bg-gradient-to-tr from-teal-500 to-blue-400 hover:from-teal-600 hover:to-blue-500 text-white px-6 py-1.5 rounded-xl font-bold shadow-md transition text-base flex items-center gap-2 ${
                (!replyValue ||
                  replyValue.trim() === "" ||
                  createReplyMutation.isPending) &&
                "opacity-60 cursor-not-allowed"
              }`}
              style={{
                boxShadow:
                  "0 2px 8px 0 rgba(20,184,166,.10), 0 1.5px 0 #a7f3d0 inset",
              }}
              disabled={
                !replyValue ||
                replyValue.trim() === "" ||
                createReplyMutation.isPending
              }
            >
              {createReplyMutation.isPending ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Replying…
                </>
              ) : (
                <>
                  <Smile className="w-5 h-5 -ml-1" />
                  Reply
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="mt-5">
        {isPending ? (
          <div className="text-gray-400 text-xs">Loading replies...</div>
        ) : !replies.length ? (
          <div className="text-gray-400 text-xs">No replies yet.</div>
        ) : (
          <ul className="space-y-3">
            {replies.map((reply, idx) => (
              <li
                key={reply.id ?? `${reply.user_id}_${idx}_${reply.content}`}
                className="bg-white border border-teal-100 rounded-xl px-4 py-3 shadow flex items-start gap-3"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-300 flex items-center justify-center font-bold text-white text-lg">
                  {(reply.username || "A")[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-semibold text-teal-700 text-sm">
                    {reply.username || "Anon"}
                  </span>
                  <p className="text-gray-700 font-medium text-sm mt-1 whitespace-pre-wrap break-words">
                    {reply.content}
                  </p>
                  {reply.created_at && (
                    <span className="text-xs text-gray-400 mt-1 block">
                      {new Date(reply.created_at).toLocaleString()}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// Helper to create a shareable URL for a post
function getPostUrl(postId: string) {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/posts/${postId}`;
  }
  // fallback for SSR, won't actually be used
  return `/posts/${postId}`;
}

// Utility to fetch all replies (not per post), for counting
async function fetchAllReplies(token?: string): Promise<Reply[]> {
  const API_URL =
    process.env.NEXT_PUBLIC_API_BASE ||
    "https://mindspace-backend-gusv.onrender.com";
  const res = await fetch(
    `${API_URL}/express/get_reply`,
    token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : undefined
  );
  if (!res.ok) throw new Error("Failed to fetch replies");
  return await res.json();
}

export default function PostsFeedPage() {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const isLoggedIn = !!user;
  const queryClient = useQueryClient();

  const [composer, setComposer] = useState("");
  const [showComment, setShowComment] = useState<string | null>(null);
  const [replyInputs, setReplyInputs] = useState<{ [postId: string]: string }>(
    {}
  );
  const [promptAuth, setPromptAuth] = useState(false);

  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [likesCount, setLikesCount] = useState<{ [postId: string]: number }>(
    {}
  );
  const [repliesCount, setRepliesCount] = useState<{
    [postId: string]: number;
  }>({});

  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const [openShareId, setOpenShareId] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);

  const createPost = useCreatePost(user?.access_token);
  const likePostMutation = useLikePost(user?.access_token);
  const createReplyMutation = useCreateReply(user?.access_token);

  // Fetch posts and all replies ONCE, then count replies per post
  useEffect(() => {
    async function fetchData() {
      setLoadingPosts(true);
      try {
        let postsData: Post[] = await fetchPosts();

        // Sort by id DESCENDING (latest to oldest)
        postsData = [...postsData].sort((a, b) => Number(b.id) - Number(a.id));
        setPosts(postsData);

        // Like counts
        const likeCounts: { [postId: string]: number } = {};
        postsData.forEach((post) => {
          likeCounts[post.id] = post.likes;
        });
        setLikesCount(likeCounts);

        // Replies count - fetch all replies, map by post_id
        let repliesData: Reply[] = [];
        try {
          repliesData = await fetchAllReplies(user?.access_token);
        } catch (err) {
          repliesData = [];
        }
        const replyCounts: { [postId: string]: number } = {};
        repliesData.forEach((reply) => {
          const pid = String(reply.post_id);
          replyCounts[pid] = (replyCounts[pid] || 0) + 1;
        });
        setRepliesCount(replyCounts);
      } catch (err) {
        setPosts([]);
        setLikesCount({});
        setRepliesCount({});
      }
      setLoadingPosts(false);
    }
    fetchData();
  }, [user?.access_token]);

  // Stable callbacks to avoid infinite loops
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
    if (!isLoggedIn || likePostMutation.isPending || !user?.access_token) {
      if (!isLoggedIn) setPromptAuth(true);
      return;
    }
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

  // Share logic
  function handleShare(platform: string, post: Post) {
    const url = getPostUrl(post.id);
    const text = encodeURIComponent(post.content);
    const encodedUrl = encodeURIComponent(url);

    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
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

  useEffect(() => {
    if (!socketRef.current) {
      const socket = io(API_URL, {
        transports: ["websocket"],
      });
      socketRef.current = socket;

      socket.on("new_post", (newPost: Post) => {
        setPosts((old) => {
          const filtered = old
            ? old.filter((post) => !String(post.id).startsWith("temp-"))
            : [];
          // Add newPost at the top (latest)
          return [newPost, ...filtered];
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
        "reply_update",
        ({ postId, count }: { postId: string; count: number }) => {
          setRepliesCount((prev) => ({ ...prev, [postId]: count }));
        }
      );

      socket.on("disconnect", () => {});
    }
    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  function handlePostSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoggedIn) {
      setPromptAuth(true);
      return;
    }
    if (composer.trim() === "") return;

    const tempId = "temp-" + Date.now();
    const optimisticPost: Post = {
      id: tempId,
      user_id: user?.id || "optimistic",
      content: composer,
      username:
        profile?.role === "user"
          ? profile.firstname || "You"
          : profile?.role === "counselor"
          ? profile.fullname || "You"
          : "You",
      likes: 0,
    };
    setPosts((old) => [optimisticPost, ...old]);
    const toastId = toast.loading("Posting...");
    createPost.mutate(
      { content: composer },
      {
        onSuccess: () => {
          setComposer("");
          toast.success("Post delivered!", { id: toastId });
          setLoadingPosts(true);
          fetchPosts().then((postsData) => {
            postsData = [...postsData].sort(
              (a, b) => Number(b.id) - Number(a.id)
            );
            setPosts(postsData);
            setLoadingPosts(false);
          });
        },
        onError: () => {
          toast.error("Failed to post. Please try again.", { id: toastId });
          setLoadingPosts(true);
          fetchPosts().then((postsData) => {
            postsData = [...postsData].sort(
              (a, b) => Number(b.id) - Number(a.id)
            );
            setPosts(postsData);
            setLoadingPosts(false);
          });
        },
      }
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-blue-50 flex flex-col">
      <section className="max-w-2xl w-full mx-auto flex-1 py-4 px-1 sm:px-3 md:px-0">
        {/* Post composer */}
        <motion.div
          className="bg-white rounded-3xl shadow-lg border border-teal-100 mb-6 p-4 sm:p-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <form onSubmit={handlePostSubmit}>
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="rounded-full object-cover border-2 border-teal-200 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center bg-teal-600 text-white font-bold text-xl select-none">
                {getFirstNameInitial(profile)}
              </div>
              <div className="w-full flex flex-col">
                <textarea
                  rows={2}
                  className="w-full resize-none bg-transparent focus:outline-none text-[0.92rem] sm:text-base placeholder:text-gray-400 font-medium border border-teal-100 rounded-xl px-3 py-2 transition focus:ring-2 focus:ring-teal-200 focus:bg-white min-h-[48px] sm:min-h-[56px] text-black"
                  placeholder="Share your story or thought for today..."
                  value={composer}
                  onChange={(e) => setComposer(e.target.value)}
                  disabled={!isLoggedIn || createPost.isPending}
                  style={{
                    cursor:
                      isLoggedIn && !createPost.isPending
                        ? "text"
                        : "not-allowed",
                    color: "#111",
                  }}
                  tabIndex={0}
                />
                <div className="flex items-center gap-2 sm:gap-3 mt-3 flex-wrap">
                  <button
                    type="button"
                    className="p-2 rounded hover:bg-teal-50 transition"
                    tabIndex={-1}
                    title="Add image"
                  >
                    <ImageIcon className="w-5 h-5" color={tealColor} />
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded hover:bg-teal-50 transition"
                    tabIndex={-1}
                    title="Add emoji"
                  >
                    <Smile className="w-5 h-5" color={tealColor} />
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded hover:bg-teal-50 transition"
                    tabIndex={-1}
                    title="Attach file"
                  >
                    <FileText className="w-5 h-5" color={tealColor} />
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded hover:bg-teal-50 transition"
                    tabIndex={-1}
                    title="Bold"
                  >
                    <Bold className="w-5 h-5" color={tealColor} />
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded hover:bg-teal-50 transition"
                    tabIndex={-1}
                    title="Italic"
                  >
                    <Italic className="w-5 h-5" color={tealColor} />
                  </button>
                  <button
                    type="submit"
                    className="ml-auto bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 sm:px-7 py-2 rounded-full shadow transition text-sm sm:text-base disabled:bg-teal-200 flex items-center gap-2"
                    disabled={
                      !isLoggedIn ||
                      composer.trim() === "" ||
                      createPost.isPending
                    }
                  >
                    {createPost.isPending ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          />
                        </svg>
                        Posting...
                      </>
                    ) : (
                      "Post"
                    )}
                  </button>
                </div>
              </div>
            </div>
            {!isLoggedIn && (
              <p className="mt-2 text-xs sm:text-sm text-teal-600 font-semibold">
                Sign in to post your thoughts!
              </p>
            )}
          </form>
        </motion.div>
        {/* Feed */}
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
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl shadow-lg border border-teal-100 p-4 sm:p-6 relative"
              >
                <div className="flex gap-3 sm:gap-4 items-start">
                  <div className="rounded-full object-cover border-2 border-teal-200 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center bg-teal-600 text-white font-bold text-xl select-none">
                    {post.username[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-bold text-teal-700 text-base sm:text-lg">
                        {post.username}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-gray-700 mb-3 whitespace-pre-line font-medium break-words">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-3 sm:gap-6 text-teal-500 mt-2 text-xs sm:text-sm relative">
                      <button
                        className="flex items-center gap-1 hover:bg-teal-50 p-2 rounded transition font-semibold"
                        onClick={() =>
                          setShowComment(
                            showComment === post.id ? null : post.id
                          )
                        }
                        aria-label="Comment"
                        title="Comment"
                      >
                        <MessageCircle className="w-5 h-5" color={tealColor} />
                        <span>{repliesCount[post.id] || 0}</span>
                      </button>
                      <button
                        className="flex items-center gap-1 hover:bg-teal-50 p-2 rounded transition font-semibold"
                        tabIndex={-1}
                        title="Repost"
                      >
                        <Repeat2 className="w-5 h-5" color={tealColor} />
                        <span>0</span>
                      </button>
                      <button
                        className={`flex items-center gap-1 hover:bg-teal-50 p-2 rounded transition font-semibold ${
                          likedPosts.has(post.id)
                            ? "text-teal-600"
                            : "text-teal-500"
                        }`}
                        disabled={!isLoggedIn || likePostMutation.isPending}
                        onClick={() => handleLike(post.id)}
                        tabIndex={-1}
                        title={likedPosts.has(post.id) ? "Unlike" : "Like"}
                      >
                        <Heart
                          className="w-5 h-5"
                          color={
                            likedPosts.has(post.id) ? "#14b8a6" : tealColor
                          }
                          fill={likedPosts.has(post.id) ? "#14b8a6" : "none"}
                        />
                        <span>{likesCount[post.id] ?? post.likes}</span>
                      </button>
                      {/* Share Button */}
                      <div className="relative inline-block">
                        <button
                          className={`flex items-center gap-1 px-2 py-1.5 rounded transition font-semibold
                            hover:bg-teal-100 focus:ring-2 focus:ring-teal-200 focus:outline-none
                            ${openShareId === post.id ? "bg-teal-50" : ""}
                          `}
                          tabIndex={-1}
                          title="Share"
                          onClick={() =>
                            setOpenShareId(
                              openShareId === post.id ? null : post.id
                            )
                          }
                        >
                          <Share2 className="w-5 h-5" color={tealColor} />
                          <span>Share</span>
                        </button>
                        {/* Share menu */}
                        <AnimatePresence>
                          {openShareId === post.id && (
                            <motion.div
                              initial={{ opacity: 0, y: 12, scale: 0.97 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 12, scale: 0.97 }}
                              transition={{
                                type: "spring",
                                stiffness: 350,
                                damping: 26,
                              }}
                              className="absolute z-50 right-0 mt-2"
                            >
                              {/* Caret Arrow */}
                              <div className="flex justify-end pr-6">
                                <div className="w-3 h-3 bg-white border-t border-l border-gray-200 rotate-45 -mt-2 mr-2 shadow-sm"></div>
                              </div>
                              <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl p-2 min-w-[210px] max-w-xs flex flex-col gap-1 transition relative">
                                {typeof navigator !== "undefined" &&
                                  typeof navigator.share === "function" && (
                                    <button
                                      className="flex items-center gap-2 px-3 py-2 rounded-xl transition hover:bg-teal-50 text-gray-900 font-medium group"
                                      onClick={() =>
                                        handleShare("webshare", post)
                                      }
                                    >
                                      <Share2 className="w-4 h-4 text-teal-500 group-hover:text-teal-700" />
                                      Share Post
                                    </button>
                                  )}
                                <button
                                  className="flex items-center gap-2 px-3 py-2 rounded-xl transition hover:bg-[#F5F8FA] text-[#1DA1F2] font-medium group"
                                  onClick={() => handleShare("twitter", post)}
                                >
                                  <XIcon className="w-4 h-4 text-[#1DA1F2] group-hover:text-[#0a85d9]" />
                                  Share on X (Twitter)
                                </button>
                                <button
                                  className="flex items-center gap-2 px-3 py-2 rounded-xl transition hover:bg-[#F0F2F5] text-[#1877F3] font-medium group"
                                  onClick={() => handleShare("facebook", post)}
                                >
                                  <Facebook className="w-4 h-4 text-[#1877F3] group-hover:text-[#145cb7]" />
                                  Share on Facebook
                                </button>
                                <button
                                  className="flex items-center gap-2 px-3 py-2 rounded-xl transition hover:bg-[#e9f5ec] text-[#25D366] font-medium group"
                                  onClick={() => handleShare("whatsapp", post)}
                                >
                                  <Share2 className="w-4 h-4 text-[#25D366] group-hover:text-[#1ebc59]" />
                                  Share on WhatsApp
                                </button>
                                <button
                                  className="flex items-center gap-2 px-3 py-2 rounded-xl transition hover:bg-[#eef3f8] text-[#0077B5] font-medium group"
                                  onClick={() => handleShare("linkedin", post)}
                                >
                                  <Linkedin className="w-4 h-4 text-[#0077B5] group-hover:text-[#005983]" />
                                  Share on LinkedIn
                                </button>
                                <div className="my-1 border-t border-gray-100" />
                                <button
                                  className="flex items-center gap-2 px-3 py-2 rounded-xl transition hover:bg-teal-50 text-gray-900 font-medium group"
                                  onClick={() => handleShare("copy", post)}
                                >
                                  <Clipboard className="w-4 h-4 text-gray-400 group-hover:text-teal-600" />
                                  Copy Link
                                </button>
                                <button
                                  className="absolute top-2 right-3 text-gray-400 text-xl font-bold hover:text-teal-600 transition"
                                  onClick={() => setOpenShareId(null)}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    padding: 0,
                                  }}
                                  aria-label="Close"
                                >
                                  ×
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    {showComment === post.id && (
                      <PostReplies
                        postId={String(post.id)}
                        token={user?.access_token}
                        replyValue={replyInputs[post.id] || ""}
                        setReplyValue={(val) =>
                          setReplyInputs((prev) => ({
                            ...prev,
                            [post.id]: val,
                          }))
                        }
                        onCancel={() => setShowComment(null)}
                        createReplyMutation={createReplyMutation}
                        onRepliesLoaded={(count) =>
                          handleRepliesFetched(post.id, count)
                        }
                        onReplyPosted={() => handleReplyPosted(post.id)}
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
        <AnimatePresence>
          {promptAuth && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-2"
            >
              <div className="bg-white rounded-xl shadow-lg p-6 text-center max-w-xs mx-auto border border-teal-100">
                <h3 className="text-lg font-semibold mb-2 text-teal-700">
                  Sign in or Sign up
                </h3>
                <p className="mb-4 text-gray-500 text-sm">
                  You must be signed in to post or comment.
                </p>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/auth/login"
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 font-semibold transition"
                    onClick={() => setPromptAuth(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-white text-teal-700 border border-teal-600 px-4 py-2 rounded-lg hover:bg-teal-50 font-semibold transition"
                    onClick={() => setPromptAuth(false)}
                  >
                    Sign Up
                  </Link>
                  <button
                    className="mt-2 text-xs text-gray-400 underline"
                    onClick={() => setPromptAuth(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
      <Footer />
      <style jsx global>{`
        @media (max-width: 640px) {
          .rounded-3xl {
            border-radius: 1.25rem !important;
          }
          .rounded-2xl {
            border-radius: 1rem !important;
          }
          .rounded-xl {
            border-radius: 0.75rem !important;
          }
          .p-6 {
            padding: 1rem !important;
          }
          .p-7 {
            padding: 1.2rem !important;
          }
        }
      `}</style>
    </main>
  );
}