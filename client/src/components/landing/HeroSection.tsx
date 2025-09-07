"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/lib/UserContext";
import { useProfile } from "@/lib/userProfile";

export default function HeroSection() {
  const { user } = useAuth();
  const { data: profile } = useProfile();

  // Determine which button to show
  let button: React.ReactNode = null;
  if (user && profile) {
    // Signed in: show based on role
    if (profile.role === "counselor") {
      button = (
        <Link
          href="/dashboard"
          className="bg-teal-600 hover:bg-teal-700 transition text-white font-semibold py-3 px-8 rounded-xl shadow-md"
        >
          Go to Dashboard
        </Link>
      );
    } else {
      button = (
        <Link
          href="/posts"
          className="bg-teal-600 hover:bg-teal-700 transition text-white font-semibold py-3 px-8 rounded-xl shadow-md"
        >
          Make a Post
        </Link>
      );
    }
  } else {
    // Not signed in: show make a post (will prompt login if needed)
    button = (
      <Link
        href="/posts"
        className="bg-teal-600 hover:bg-teal-700 transition text-white font-semibold py-3 px-8 rounded-xl shadow-md"
      >
        Make a Post
      </Link>
    );
  }

  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-teal-200 via-teal-50 to-blue-50 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="max-w-7xl w-full flex flex-col md:flex-row items-center gap-12 px-6 py-16 z-10"
      >
        <div className="flex-1">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-10 h-10 text-teal-500 animate-bounce" />
            Your Path to Mental Wellness
          </h1>
          <p className="mb-8 text-lg md:text-2xl text-gray-700 max-w-lg">
            Motivation, community, and professional support at your fingertips.
          </p>
          <div className="flex gap-4">{button}</div>
        </div>
        <motion.div
          className="flex-1 flex justify-center relative min-h-[320px] w-full md:max-w-md"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        >
          <Image
            src="https://i.postimg.cc/wgvN2Crs/hero-image.jpg"
            alt="Mental wellness"
            fill
            sizes="(max-width: 768px) 80vw, 400px"
            className="rounded-3xl object-cover shadow-2xl"
            priority
          />
        </motion.div>
      </motion.div>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <svg width="100%" height="100%" viewBox="0 0 900 600" fill="none">
          <circle cx="200" cy="100" r="140" fill="#bae6fd" fillOpacity="0.17" />
          <circle cx="700" cy="500" r="180" fill="#d1f7e2" fillOpacity="0.13" />
        </svg>
      </div>
    </section>
  );
}