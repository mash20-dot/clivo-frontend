"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import Footer from "@/components/landing/Footer";

const dummyPosts = [
  {
    id: "1",
    title: "Overcoming Anxiety: Steps That Worked For Me",
    description:
      "Discover simple techniques and daily habits that helped me conquer anxiety and regain my confidence. You are not alone, and small steps can make a big difference.",
    author: { name: "Sarah Ahmed" },
    date: "September 1, 2025",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    tag: "Mental Health",
    content: [
      {
        heading: "My Journey",
        text: "Anxiety used to control my days. What changed for me was building a daily practice of self-kindness, mindfulness, and reaching out to supportive friends.",
      },
      {
        heading: "Small Steps Matter",
        text: "I learned that even tiny actions—like taking a walk, writing my thoughts, or breathing deeply—can transform a difficult moment.",
      },
      {
        heading: "You're Not Alone",
        text: "The Clivo community was my lifeline. There are people out there who truly care.",
      },
    ],
  },
  {
    id: "2",
    title: "Finding Motivation in Tough Times",
    description:
      "When life gets challenging, staying motivated can feel impossible. Here are my favorite affirmations and tips for rediscovering hope and joy every day.",
    author: { name: "James Williams" },
    date: "August 25, 2025",
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
    tag: "Motivation",
    content: [
      {
        heading: "Affirmations",
        text: "Each morning, I repeat: 'I am strong, I am resilient, I am capable.' This simple routine lifts my spirits.",
      },
      {
        heading: "Tips for Motivation",
        text: "Set small goals. Celebrate progress. Surround yourself with positive voices.",
      },
    ],
  },
  {
    id: "3",
    title: "The Power of Community Support",
    description:
      "Connecting with others who understand your struggles can bring healing and comfort. This is how our community helped me feel seen, heard, and empowered.",
    author: { name: "Helen Johnson" },
    date: "August 10, 2025",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    tag: "Community",
    content: [
      {
        heading: "Why Community Matters",
        text: "When I joined Clivo, I realized I wasn’t alone. Shared stories and encouragement gave me strength.",
      },
      {
        heading: "How We Support Each Other",
        text: "We cheer for each other’s wins and offer comfort in tough times. That’s the magic of real community.",
      },
    ],
  },
];

// Extract id from the URL (in real Next.js file-based routing, use params)
function getPostById(id: string) {
  return dummyPosts.find((post) => post.id === id);
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function SinglePostPage({ params }: { params: { id: string } }) {
  const post = getPostById(params.id);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<
    { name: string; message: string; date: string }[]
  >([
    {
      name: "David O'Neal",
      message: "Thank you for sharing! This is so encouraging.",
      date: "03 September 2025",
    },
    {
      name: "Emily Carter",
      message: "I needed to read this today. Appreciate your openness.",
      date: "01 September 2025",
    },
  ]);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  if (!post) {
    return (
      <motion.div
        className="text-center text-gray-500 py-10"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        Post not found.
      </motion.div>
    );
  }

  // Simulate not-logged-in for demo purposes
  const isLoggedIn = false; // Replace this with your auth logic later

  function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoggedIn) {
      setShowAuthPrompt(true);
      return;
    }
    setComments([
      ...comments,
      {
        name: "You",
        message: comment,
        date: new Date().toLocaleDateString("en-US", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
      },
    ]);
    setComment("");
  }

  return (
    <main className="bg-gradient-to-br from-teal-50 via-white to-blue-50 min-h-screen">
      <section className="max-w-3xl mx-auto px-4 py-10">
        <Link
          href="/posts"
          className="text-teal-600 text-sm underline mb-6 inline-block"
        >
          &larr; Back to all posts
        </Link>
        <motion.div
          className="bg-white rounded-2xl shadow-2xl border border-teal-100 overflow-hidden"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.7 }}
        >
          <div className="relative w-full h-72">
            <Image
              src={post.image}
              alt={post.title}
              width={900}
              height={400}
              className="object-cover w-full h-full"
            />
            <span className="absolute top-5 left-5 bg-teal-600/90 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
              {post.tag}
            </span>
          </div>
          <div className="p-8">
            <h1 className="text-3xl font-bold text-teal-700 mb-3">
              {post.title}
            </h1>
            <p className="text-lg text-gray-600 mb-6">{post.description}</p>
            <div className="flex items-center gap-4 mb-7">
              <span className="text-sm font-medium text-teal-600">
                {post.author.name}
              </span>
              <span className="text-xs text-gray-400">{post.date}</span>
            </div>
            <div className="space-y-6">
              {post.content.map((section, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
                  className="bg-teal-50/50 rounded-xl p-5"
                >
                  <h3 className="text-xl font-semibold text-teal-700 mb-2">
                    {section.heading}
                  </h3>
                  <p className="text-gray-700">{section.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        {/* Comments Section */}
        <motion.div
          className="bg-white rounded-xl shadow-2xl p-7 mt-10 border border-teal-100"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold mb-6 text-teal-700">Comments</h2>
          <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="Add your comment..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm shadow"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={showAuthPrompt}
            />
            <button
              type="submit"
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 text-sm font-medium shadow"
            >
              Post
            </button>
          </form>
          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((c, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + idx * 0.1 }}
                className="bg-teal-50 rounded-lg p-4 text-sm shadow"
              >
                <p className="text-gray-800">{c.message}</p>
                <span className="text-xs text-gray-400">
                  — {c.name}, {c.date}
                </span>
              </motion.div>
            ))}
          </div>
          {/* Auth Prompt Modal */}
          {showAuthPrompt && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center max-w-xs mx-auto border border-teal-200 animate-fadeIn">
                <h3 className="text-lg font-semibold mb-2 text-teal-700">
                  Sign in or Sign up
                </h3>
                <p className="mb-4 text-gray-500 text-sm">
                  You need to be signed in to comment on posts.
                </p>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/auth/login"
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 font-semibold transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-white text-teal-700 border border-teal-600 px-4 py-2 rounded-lg hover:bg-teal-50 font-semibold transition"
                  >
                    Sign Up
                  </Link>
                  <button
                    className="mt-2 text-xs text-gray-400 underline"
                    onClick={() => setShowAuthPrompt(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </section>
      <Footer />
    </main>
  );
}
