'use client';
import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-teal-100 via-white to-blue-100 py-8 px-4">
      <div className="max-w-md w-full rounded-3xl bg-white/80 backdrop-blur-md shadow-2xl border border-teal-100 p-8 md:p-12 flex flex-col items-center">
        {/* Logo */}
        <Link href="/" className="mb-6 text-3xl font-extrabold text-green-600 tracking-tight drop-shadow-lg">
          Clivo
        </Link>

        {/* Illustration */}
        <div className="mb-8 w-28 h-28 flex items-center justify-center">
          <Image
            src="https://i.postimg.cc/bNj8dDst/profile-image.jpg"
            alt="Login Illustration"
            className="rounded-full object-cover border-4 border-teal-200 shadow-lg"
            width={112}
            height={112}
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Welcome Back</h2>
        <p className="text-gray-600 mb-6 text-center text-sm">Sign in to access your mental wellness on clivo</p>

        {/* Login Form */}
        <form className="w-full flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            Email
            <div className="relative">
              <input
                type="email"
                placeholder="you@email.com"
                className="w-full rounded-lg border border-teal-200 bg-white/60 py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition shadow-sm"
                required
                autoComplete="email"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
            </div>
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            Password
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full rounded-lg border border-teal-200 bg-white/60 py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 transition shadow-sm"
                required
                autoComplete="current-password"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
              <button
                type="button"
                tabIndex={-1}
                aria-label="Toggle password visibility"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-500"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </label>

          <div className="flex items-center justify-between mt-2">
            <div>
              <label className="flex items-center gap-2 text-xs text-gray-600">
                <input type="checkbox" className="accent-green-500" />
                Remember me
              </label>
            </div>
            <Link href="/auth/forgot" className="text-xs text-green-600 hover:underline font-semibold">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-lg transition"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 w-full flex flex-col items-center text-sm">
          <span className="text-gray-500">Don&apos;t have an account?</span>
          <Link href="/auth/signup" className="mt-1 text-green-600 font-semibold hover:underline">
            Create one
          </Link>
        </div>
      </div>
    </main>
  );
}