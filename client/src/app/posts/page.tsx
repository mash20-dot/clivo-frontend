"use client";

import { useState } from "react";
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
} from "lucide-react";
import Footer from "@/components/landing/Footer";
import { useAuth } from "@/lib/UserContext";
import { useProfile, Profile } from "@/lib/userProfile";
import Image from "next/image";

// App's primary teal color
const tealColor = "#14b8a6";

// Helper for avatar initial (same logic as navbar)
function getFirstNameInitial(profile: Profile | null | undefined): string {
  if (!profile) return "U";
  if (profile.role === "user" && profile.firstname && profile.firstname.length > 0) {
    return profile.firstname[0].toUpperCase();
  }
  if (profile.role === "counselor" && profile.fullname && profile.fullname.length > 0) {
    return profile.fullname[0].toUpperCase();
  }
  return "U";
}

// Dummy user fallback
const currentUser = {
  name: "Clivo User",
  avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=80&q=80",
};

// Dummy posts and comments
const dummyPosts = [
  {
    id: "1",
    author: {
      name: "Sarah Ahmed",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80",
    },
    createdAt: "Just now",
    content:
      "✨ Just wanted to say: It’s okay to ask for help. You matter. Today I reached out to a counselor on Clivo and it felt *so* good to talk.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    comments: [
      {
        id: "c1",
        name: "James Williams",
        avatar: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=80&q=80",
        text: "Proud of you Sarah! 💚",
        time: "2m",
      },
    ],
    likes: 87,
    shares: 14,
    reposts: 4,
  },
  {
    id: "2",
    author: {
      name: "Emily Carter",
      avatar: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=80&q=80",
    },
    createdAt: "8m",
    content:
      "Taking time for self-care is not selfish. I meditated for 10 minutes today and my anxiety went down a lot.",
    image: "",
    comments: [
      {
        id: "c2",
        name: "Helen Johnson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80",
        text: "Thanks for sharing, Emily! Mindfulness helps me too.",
        time: "3m",
      },
    ],
    likes: 45,
    shares: 9,
    reposts: 1,
  },
  {
    id: "3",
    author: {
      name: "Michael Brown",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80",
    },
    createdAt: "15m",
    content:
      "My therapist taught me about grounding techniques for panic attacks. Counting things in my room really helps.",
    image: "",
    comments: [],
    likes: 21,
    shares: 3,
    reposts: 0,
  },
  {
    id: "4",
    author: {
      name: "Lisa Green",
      avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=80&q=80",
    },
    createdAt: "30m",
    content:
      "Just finished a gratitude journal entry. Focusing on positives helps me reframe my day.",
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
    comments: [
      {
        id: "c4",
        name: "Sarah Ahmed",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80",
        text: "Love this idea!",
        time: "12m",
      },
    ],
    likes: 32,
    shares: 5,
    reposts: 2,
  },
  {
    id: "5",
    author: {
      name: "Chris Lee",
      avatar: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=80&q=80",
    },
    createdAt: "1h",
    content:
      "If you’re struggling today, remember: You are not alone. Clivo community is here for you. 💚",
    image: "",
    comments: [],
    likes: 19,
    shares: 2,
    reposts: 0,
  },
];

export default function PostsFeedPage() {
  const { user } = useAuth();
  const { data: profile } = useProfile();

  const isLoggedIn = !!user;

  const [composer, setComposer] = useState("");
  const [showComment, setShowComment] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [promptAuth, setPromptAuth] = useState(false);

  function handlePostSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoggedIn) {
      setPromptAuth(true);
      return;
    }
    setComposer("");
    // Add post logic here when backend is ready
  }

  function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoggedIn) {
      setPromptAuth(true);
      return;
    }
    setCommentText("");
    setShowComment(null);
    // Add comment logic here when backend is ready
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
              {/* Avatar initial */}
              <div className="rounded-full object-cover border-2 border-teal-200 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center bg-teal-600 text-white font-bold text-xl select-none">
                {getFirstNameInitial(profile)}
              </div>
              <div className="w-full flex flex-col">
                <textarea
                  rows={2}
                  className="w-full resize-none bg-transparent focus:outline-none text-[0.92rem] sm:text-base placeholder:text-gray-400 font-medium border border-teal-100 rounded-xl px-3 py-2 transition focus:ring-2 focus:ring-teal-200 focus:bg-white min-h-[48px] sm:min-h-[56px] text-black"
                  placeholder="Share your story or thought for today..."
                  value={composer}
                  onChange={e => setComposer(e.target.value)}
                  disabled={!isLoggedIn}
                  style={{
                    cursor: isLoggedIn ? "text" : "not-allowed",
                    color: "#111", // make text black always
                  }}
                  tabIndex={0}
                />
                <div className="flex items-center gap-2 sm:gap-3 mt-3 flex-wrap">
                  <button type="button" className="p-2 rounded hover:bg-teal-50 transition" tabIndex={-1} title="Add image"><ImageIcon className="w-5 h-5" color={tealColor} /></button>
                  <button type="button" className="p-2 rounded hover:bg-teal-50 transition" tabIndex={-1} title="Add emoji"><Smile className="w-5 h-5" color={tealColor} /></button>
                  <button type="button" className="p-2 rounded hover:bg-teal-50 transition" tabIndex={-1} title="Attach file"><FileText className="w-5 h-5" color={tealColor} /></button>
                  <button type="button" className="p-2 rounded hover:bg-teal-50 transition" tabIndex={-1} title="Bold"><Bold className="w-5 h-5" color={tealColor} /></button>
                  <button type="button" className="p-2 rounded hover:bg-teal-50 transition" tabIndex={-1} title="Italic"><Italic className="w-5 h-5" color={tealColor} /></button>
                  <button
                    type="submit"
                    className="ml-auto bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 sm:px-7 py-2 rounded-full shadow transition text-sm sm:text-base disabled:bg-teal-200"
                    disabled={!isLoggedIn || composer.trim() === ""}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
            {/* Only show sign-in message if not logged in */}
            {!isLoggedIn && (
              <p className="mt-2 text-xs sm:text-sm text-teal-600 font-semibold">
                Sign in to post your thoughts!
              </p>
            )}
          </form>
        </motion.div>
        {/* Feed */}
        <div className="flex flex-col gap-4 sm:gap-7">
          {dummyPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl shadow-lg border border-teal-100 p-4 sm:p-6"
            >
              <div className="flex gap-3 sm:gap-4 items-start">
                {/* Avatar initial for post author */}
                <div className="rounded-full object-cover border-2 border-teal-200 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center bg-teal-600 text-white font-bold text-xl select-none">
                  {post.author.name[0]?.toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-teal-700 text-base sm:text-lg">{post.author.name}</span>
                    <span className="text-xs text-gray-400 font-semibold">{post.createdAt}</span>
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 mb-3 whitespace-pre-line font-medium break-words">{post.content}</p>
                  {post.image && (
                    <div className="rounded-xl overflow-hidden border border-teal-100 mb-4">
                      <Image
                        src={post.image}
                        alt="Post"
                        width={600}
                        height={320}
                        className="object-cover w-full max-h-60 sm:max-h-72"
                        loading="lazy"
                      />
                    </div>
                  )}
                  {/* Actions */}
                  <div className="flex items-center gap-3 sm:gap-6 text-teal-500 mt-2 text-xs sm:text-sm">
                    <button
                      className="flex items-center gap-1 hover:bg-teal-50 p-2 rounded transition font-semibold"
                      onClick={() => setShowComment(post.id)}
                      aria-label="Comment"
                      title="Comment"
                    >
                      <MessageCircle className="w-5 h-5" color={tealColor} />
                      <span>{post.comments.length}</span>
                    </button>
                    <button className="flex items-center gap-1 hover:bg-teal-50 p-2 rounded transition font-semibold" tabIndex={-1} title="Repost">
                      <Repeat2 className="w-5 h-5" color={tealColor} />
                      <span>{post.reposts}</span>
                    </button>
                    <button className="flex items-center gap-1 hover:bg-teal-50 p-2 rounded transition font-semibold" tabIndex={-1} title="Like">
                      <Heart className="w-5 h-5" color={tealColor} />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 hover:bg-teal-50 p-2 rounded transition font-semibold" tabIndex={-1} title="Share">
                      <Share2 className="w-5 h-5" color={tealColor} />
                      <span>{post.shares}</span>
                    </button>
                  </div>
                  {/* Comments Feed */}
                  <div className="mt-5">
                    {post.comments.length > 0 && (
                      <div className="flex flex-col gap-3">
                        {post.comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="flex items-center gap-2 bg-teal-50 rounded-lg px-2 py-2 sm:px-3"
                          >
                            {/* Avatar initial for comment author */}
                            <div className="rounded-full object-cover border border-teal-200 w-7 h-7 flex items-center justify-center bg-teal-600 text-white font-bold text-base select-none">
                              {comment.name[0]?.toUpperCase() || "U"}
                            </div>
                            <span className="text-xs font-semibold text-teal-700">{comment.name}</span>
                            <span className="text-xs text-gray-400">{comment.time}</span>
                            <p className="text-xs text-gray-600 ml-2 break-words">{comment.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Comment Section Modal */}
                  <AnimatePresence>
                    {showComment === post.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-2"
                      >
                        <div className="bg-white rounded-2xl p-5 sm:p-7 max-w-sm w-full shadow-2xl border border-teal-100">
                          <h3 className="text-base sm:text-lg font-bold mb-3 text-teal-700">
                            Add a comment
                          </h3>
                          <form onSubmit={handleCommentSubmit} className="flex flex-col gap-3">
                            <textarea
                              rows={2}
                              className="w-full border rounded-lg px-3 py-2 text-sm shadow focus:outline-teal-500 resize-none"
                              placeholder="Write your comment..."
                              value={commentText}
                              onChange={e => setCommentText(e.target.value)}
                            />
                            <div className="flex gap-2">
                              <button
                                type="submit"
                                className="bg-teal-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-teal-700 transition"
                              >
                                Send
                              </button>
                              <button
                                type="button"
                                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full font-semibold hover:bg-gray-200 transition"
                                onClick={() => { setShowComment(null); setCommentText(""); }}
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {/* Auth Modal */}
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
      {/* Responsive tweaks for mobile/tablet */}
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