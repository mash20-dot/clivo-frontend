"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/UserContext";
import { useProfile } from "@/lib/userProfile";
import Footer from "@/components/landing/Footer";
import { Heart, MessageCircle, Share2, Smile } from "lucide-react";
import { toast } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_BASE || "https://mindspace-backend-gusv.onrender.com";

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

function getFirstNameInitial(profile: any): string {
  if (!profile) return "U";
  if (profile.role === "user" && profile.firstname) return profile.firstname[0].toUpperCase();
  if (profile.role === "counselor" && profile.fullname) return profile.fullname[0].toUpperCase();
  return "U";
}

export default function SinglePostPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [composer, setComposer] = useState("");
  const [replyValue, setReplyValue] = useState("");
  const [replies, setReplies] = useState<Reply[]>([]);
  const [repliesCount, setRepliesCount] = useState<{ [postId: string]: number }>({});
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [authError, setAuthError] = useState(false);

  // Unwrap params for Next.js v14+
  const { id } = React.use(params);

  // Fetch all posts, all replies, filter for post and replies count
  useEffect(() => {
    async function loadPostAndReplies() {
      setLoading(true);
      setAuthError(false);
      try {
        // Fetch posts
        const postsRes = await fetch(`${API_URL}/express/get_comment`);
        const posts: Post[] = await postsRes.json();
        const found = posts.find((p) => String(p.id) === String(id)) || null;
        setPost(found);
        setLikes(found?.likes || 0);

        // Fetch all replies (with token)
        let repliesData: Reply[] = [];
        if (user?.access_token) {
          const repliesRes = await fetch(`${API_URL}/express/get_reply`, {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              "Content-Type": "application/json",
            },
          });
          if (repliesRes.ok) {
            repliesData = await repliesRes.json();
            setAuthError(false);
          } else {
            setAuthError(true);
            repliesData = [];
          }
        } else {
          setAuthError(true);
          repliesData = [];
        }

        // Count replies for each post
        const counts: { [postId: string]: number } = {};
        repliesData.forEach((reply) => {
          const pid = String(reply.post_id);
          counts[pid] = (counts[pid] || 0) + 1;
        });
        setRepliesCount(counts);

        // Filter replies for current post
        setReplies(repliesData.filter((r) => String(r.post_id) === String(id)));
      } catch (err) {
        setPost(null);
        setReplies([]);
        setRepliesCount({});
        setAuthError(false);
      }
      setLoading(false);
    }
    loadPostAndReplies();
  }, [id, user?.access_token]);

  // Like post handler
  async function handleLike() {
    if (!user?.access_token || !post) return;
    try {
      const res = await fetch(`${API_URL}/express/likes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access_token}`,
        },
        body: JSON.stringify({ id: post.id }),
      });
      const data = await res.json();
      setLikes(data.likes);
      setLiked(data.liked);
    } catch {
      toast.error("Failed to update like!");
    }
  }

  // Create reply handler
  async function handleReply() {
    if (!user?.access_token || !replyValue.trim() || !post) return;
    try {
      const res = await fetch(`${API_URL}/express/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access_token}`,
        },
        body: JSON.stringify({ post_id: post.id, content: replyValue }),
      });
      const newReply = await res.json();
      setReplies([newReply, ...replies]);
      setReplyValue("");
      setRepliesCount((prev) => ({
        ...prev,
        [String(post.id)]: (prev[String(post.id)] || 0) + 1,
      }));
      toast.success("Reply posted!");
    } catch {
      toast.error("Failed to post reply!");
    }
  }

  // Create post handler (composer at top)
  async function handlePostSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.access_token || !composer.trim()) return;
    try {
      const res = await fetch(`${API_URL}/express/post_comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access_token}`,
        },
        body: JSON.stringify({ content: composer }),
      });
      await res.json();
      setComposer("");
      toast.success("Post delivered!");
    } catch {
      toast.error("Failed to post!");
    }
  }

  // Sharing logic (simple copy link)
  function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!post) return <div className="p-8 text-center text-red-500">Post not found (404)</div>;

  return (
    <main className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-blue-50 flex flex-col">
      <section className="max-w-2xl w-full mx-auto flex-1 py-4 px-2 sm:px-4 md:px-0">
        {/* Single Post Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-teal-100 p-3 sm:p-4 md:p-6 mb-8">
          <div className="flex gap-2 sm:gap-3 md:gap-4 items-start">
            <div className="rounded-full object-cover border-2 border-teal-200 w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 flex items-center justify-center bg-teal-600 text-white font-bold text-lg md:text-xl select-none">
              {post.username[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-bold text-teal-700 text-base sm:text-lg md:text-xl">{post.username}</span>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-3 whitespace-pre-line font-medium break-words">
                {post.content}
              </p>
              <div className="flex items-center gap-4 sm:gap-5 md:gap-6 text-teal-500 mt-2 text-xs sm:text-sm relative">
                <button
                  className="flex items-center gap-1 hover:bg-teal-50 p-1 sm:p-2 rounded transition font-semibold"
                  aria-label="Comment"
                  title="Comment"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{repliesCount[String(post.id)] || 0}</span>
                </button>
                <button
                  className={`flex items-center gap-1 hover:bg-teal-50 p-1 sm:p-2 rounded transition font-semibold ${
                    liked ? "text-teal-600" : "text-teal-500"
                  }`}
                  onClick={handleLike}
                  title={liked ? "Unlike" : "Like"}
                  disabled={!user?.access_token}
                >
                  <Heart
                    className="w-5 h-5"
                    color={liked ? "#14b8a6" : "#14b8a6"}
                    fill={liked ? "#14b8a6" : "none"}
                  />
                  <span>{likes}</span>
                </button>
                <button
                  className="flex items-center gap-1 hover:bg-teal-50 p-1 sm:p-2 rounded font-semibold"
                  onClick={handleShare}
                  title="Share"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Replies Section */}
        <div className="bg-white rounded-2xl shadow border border-teal-100 p-2 sm:p-4 md:p-6">
          <h3 className="text-teal-700 font-bold mb-3 sm:mb-4 text-base sm:text-lg">Replies</h3>
          {authError ? (
            <div className="text-red-500 text-sm mb-6">
              You must be logged in to view and post replies.
            </div>
          ) : (
            <>
              <div className="mb-4">
                <textarea
                  value={replyValue}
                  onChange={(e) => setReplyValue(e.target.value)}
                  rows={2}
                  maxLength={400}
                  className="w-full resize-none bg-white border-2 border-teal-100 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 rounded-xl py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 font-medium shadow-sm outline-none"
                  placeholder="Write a thoughtful reply…"
                  disabled={!user?.access_token}
                />
                <button
                  onClick={handleReply}
                  className="mt-2 bg-gradient-to-tr from-teal-500 to-blue-400 hover:from-teal-600 hover:to-blue-500 text-white px-4 sm:px-6 py-2 rounded-xl font-bold shadow-md transition text-xs sm:text-sm"
                  disabled={!replyValue || replyValue.trim() === "" || !user?.access_token}
                >
                  <Smile className="w-5 h-5 inline mr-1" />
                  Reply
                </button>
              </div>
              {!replies.length ? (
                <div className="text-gray-400 text-xs">No replies yet.</div>
              ) : (
                <ul className="space-y-2 sm:space-y-3">
                  {replies.map((reply, idx) => (
                    <li
                      key={reply.id ?? `${reply.user_id}_${idx}_${reply.content}`}
                      className="bg-white border border-teal-100 rounded-xl px-2 py-2 sm:px-4 sm:py-3 shadow flex items-start gap-2 sm:gap-3"
                    >
                      <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-300 flex items-center justify-center font-bold text-white text-base sm:text-lg">
                        {(reply.username || "A")[0].toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-semibold text-teal-700 text-xs sm:text-sm">
                          {reply.username || "Anon"}
                        </span>
                        <p className="text-gray-700 font-medium text-xs sm:text-sm mt-1 whitespace-pre-wrap break-words">
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
            </>
          )}
        </div>
      </section>
      <Footer />
      {/* Mobile/tablet responsive styles */}
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
          .p-4 {
            padding: 0.7rem !important;
          }
          .p-3 {
            padding: 0.5rem !important;
          }
        }
      `}</style>
    </main>
  );
}