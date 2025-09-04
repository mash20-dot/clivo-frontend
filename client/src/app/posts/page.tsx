"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Footer from "@/components/landing/Footer";

const dummyPosts = [
  {
    id: "1",
    title: "Overcoming Anxiety: Steps That Worked For Me",
    description: "Discover techniques and daily habits that helped me conquer anxiety and regain my confidence.",
    author: { name: "Sarah Ahmed" },
    date: "September 1, 2025",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    tag: "Mental Health",
  },
  {
    id: "2",
    title: "Finding Motivation in Tough Times",
    description: "My favorite affirmations and tips for rediscovering hope and joy every day.",
    author: { name: "James Williams" },
    date: "August 25, 2025",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
    tag: "Motivation",
  },
  {
    id: "3",
    title: "The Power of Community Support",
    description: "How our community helped me feel seen, heard, and empowered.",
    author: { name: "Helen Johnson" },
    date: "August 10, 2025",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    tag: "Community",
  },
  {
    id: "4",
    title: "Self-Care Rituals for a Happier Life",
    description: "Explore easy self-care practices that boost your mental well-being.",
    author: { name: "David O'Neal" },
    date: "July 30, 2025",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
    tag: "Self Care",
  },
  {
    id: "5",
    title: "Dealing With Stress at Work",
    description: "My strategies for managing stress and staying productive.",
    author: { name: "Emily Carter" },
    date: "July 15, 2025",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
    tag: "Stress",
  },
  {
    id: "6",
    title: "How Gratitude Changed My Perspective",
    description: "Simple gratitude journaling practices that transformed my mindset.",
    author: { name: "Michael Brown" },
    date: "June 29, 2025",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80",
    tag: "Gratitude",
  },
  {
    id: "7",
    title: "Building Confidence Step by Step",
    description: "Actionable ways to grow self-confidence and self-worth.",
    author: { name: "Lisa Green" },
    date: "June 10, 2025",
    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=80",
    tag: "Confidence",
  },
  {
    id: "8",
    title: "Mindfulness for Beginners",
    description: "How mindfulness brought peace to my everyday life.",
    author: { name: "Chris Lee" },
    date: "May 25, 2025",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80",
    tag: "Mindfulness",
  },
  {
    id: "9",
    title: "Healing After Loss",
    description: "My journey through grief and what helped me heal.",
    author: { name: "Sophia Turner" },
    date: "May 10, 2025",
    image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80",
    tag: "Healing",
  },
  {
    id: "10",
    title: "Small Wins, Big Changes",
    description: "Celebrating progress to stay motivated every day.",
    author: { name: "Robert Smith" },
    date: "April 30, 2025",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80",
    tag: "Growth",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function PostsPage() {
  return (
    <main className="bg-gradient-to-br from-teal-50 via-white to-blue-50 min-h-screen flex flex-col">
      <section className="max-w-7xl mx-auto px-4 py-10 flex-1">
        <motion.h1
          className="text-4xl font-extrabold text-center text-teal-700 mb-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Community Inspiration
        </motion.h1>
        <p className="text-center text-gray-500 mb-10 text-lg">
          Discover uplifting stories, practical tips, and encouragement from our community. Be inspired, feel empowered!
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {dummyPosts.map((post, i) => (
            <motion.div
              key={post.id}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all border border-teal-100 overflow-hidden flex flex-col"
            >
              <Link href={`/posts/${post.id}`}>
                <div className="cursor-pointer">
                  <div className="relative w-full h-56">
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={600}
                      height={320}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      style={{ borderBottomLeftRadius: "1rem", borderBottomRightRadius: "1rem" }}
                    />
                    <span className="absolute top-4 left-4 bg-teal-600/90 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                      {post.tag}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col justify-between min-h-[180px]">
                    <h2 className="text-2xl font-bold text-teal-700 group-hover:text-teal-800 mb-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 mb-5">{post.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-teal-600">{post.author.name}</span>
                        <span className="text-xs text-gray-400">{post.date}</span>
                      </div>
                      <span className="text-xs text-teal-500 font-semibold bg-teal-50 px-2 py-1 rounded-lg shadow">
                        Read More →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}