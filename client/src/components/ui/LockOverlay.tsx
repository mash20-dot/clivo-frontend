"use client";

import { signIn } from "next-auth/react";
import { Lock } from "lucide-react";

export default function LockOverlay() {
  return (
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl text-white p-4">
      <Lock className="w-8 h-8 mb-2" />
      <p className="text-sm mb-3 text-center">Sign in to view the full post</p>
      <button
        onClick={() => signIn()}
        className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
      >
        Sign In / Sign Up
      </button>
    </div>
  );
}