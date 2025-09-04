"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Mail,
  MapPin,
  BadgeCheck,
  Lock,
  EyeOff,
  Eye,
} from "lucide-react";
import { motion } from "framer-motion";

export default function CounselorSignupPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    location: "",
    licenseNumber: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    // Submit logic goes here!
  }

  return (
    <main className="min-h-screen w-full flex flex-col justify-between bg-gradient-to-br from-teal-100 via-white to-blue-100 py-8 px-4">
      <div className="flex flex-1 items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md w-full rounded-3xl bg-white/80 backdrop-blur-md shadow-2xl border border-teal-100 p-8 md:p-12 flex flex-col items-center"
        >
          {/* Logo */}
          <Link
            href="/"
            className="mb-6 text-3xl font-extrabold text-green-600 tracking-tight drop-shadow-lg"
          >
            Clivo
          </Link>
          {/* Illustration */}
          <div className="mb-8 w-28 h-28 flex items-center justify-center">
            <Image
              src="https://i.postimg.cc/bNj8dDst/profile-image.jpg"
              alt="Signup Illustration"
              className="rounded-full object-cover border-4 border-teal-200 shadow-lg"
              width={112}
              height={112}
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Counselor Sign Up
          </h2>
          <p className="text-gray-600 mb-6 text-center text-sm">
            Join Clivo as a certified counselor and help others on their
            journey.
          </p>
          <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
              Full Name
              <div className="relative">
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full rounded-lg border border-teal-200 bg-white/60 py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition shadow-sm"
                  required
                  autoComplete="name"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
              </div>
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
              Email
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
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
                  autoComplete="new-password"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-500"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
              Confirm Password
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full rounded-lg border border-teal-200 bg-white/60 py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 transition shadow-sm"
                  required
                  autoComplete="new-password"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-500"
                  onClick={() => setShowConfirm((v) => !v)}
                >
                  {showConfirm ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
              Location
              <div className="relative">
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Your location"
                  className="w-full rounded-lg border border-teal-200 bg-white/60 py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition shadow-sm"
                  required
                  autoComplete="address-level2"
                />
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
              </div>
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
              License Number
              <div className="relative">
                <input
                  type="text"
                  name="licenseNumber"
                  value={form.licenseNumber}
                  onChange={handleChange}
                  placeholder="License number"
                  className="w-full rounded-lg border border-teal-200 bg-white/60 py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition shadow-sm"
                  required
                  autoComplete="off"
                />
                <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
              </div>
            </label>
            <button
              type="submit"
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-lg transition"
            >
              Sign Up
            </button>
          </form>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-green-600 text-center mt-3"
            >
              Thanks for signing up as a counselor! We will review your info.
            </motion.div>
          )}
          <div className="mt-6 w-full flex flex-col items-center text-sm">
            <span className="text-gray-500">Already have an account?</span>
            <Link
              href="/auth/login"
              className="mt-1 text-green-600 font-semibold hover:underline"
            >
              Sign in
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
