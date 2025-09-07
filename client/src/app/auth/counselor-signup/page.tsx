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
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSignupCounselor } from "@/lib/mutations";
import { useAuth } from "@/lib/UserContext";

export default function CounselorSignupPage() {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    confirm_password: "",
    location: "",
    license_number: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const router = useRouter();
  const mutation = useSignupCounselor();
  const { setUser } = useAuth();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (form.password.trim() !== form.confirm_password.trim()) {
      toast.error("Passwords do not match.");
      return;
    }

    mutation.mutate(
      {
        fullname: form.fullname.trim(),
        email: form.email.trim(),
        password: form.password,
        confirm_password: form.confirm_password,
        location: form.location.trim(),
        license_number: form.license_number.trim(),
      },
      {
        onSuccess: (data) => {
          if (data.access_token) {
            setUser({
              access_token: data.access_token,
              email: form.email,
              username: data.username,
              role: "counselor",
            });
          }
          setSubmitted(true);
          toast.success(
            "Thanks for signing up as a counselor! We will review your info."
          );
          router.push("/auth/login");
        },
        onError: (err: unknown) => {
          let message = "Could not create account. Please try again.";
          if (err && typeof err === "object" && "response" in err) {
            const errorObj = err as {
              response?: { data?: { message?: string } };
            };
            if (errorObj.response?.data?.message) {
              message = errorObj.response.data.message;
            }
          }
          toast.error(message);
        },
      }
    );
  }

  const isFormValid =
    form.fullname.trim() &&
    form.email.trim() &&
    form.password.trim() &&
    form.confirm_password.trim() &&
    form.location.trim() &&
    form.license_number.trim();

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
                  name="fullname"
                  value={form.fullname}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full rounded-lg border border-teal-200 bg-white/60 py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition shadow-sm"
                  required
                  autoComplete="name"
                  disabled={mutation.isPending}
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
                  disabled={mutation.isPending}
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
              </div>
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
              Password
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full rounded-lg border border-teal-200 bg-white/60 py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 transition shadow-sm"
                  required
                  autoComplete="new-password"
                  disabled={mutation.isPending}
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-500"
                  onClick={() => setShowPassword((v) => !v)}
                  disabled={mutation.isPending}
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
                  name="confirm_password"
                  value={form.confirm_password}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="w-full rounded-lg border border-teal-200 bg-white/60 py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 transition shadow-sm"
                  required
                  autoComplete="new-password"
                  disabled={mutation.isPending}
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-500"
                  onClick={() => setShowConfirm((v) => !v)}
                  disabled={mutation.isPending}
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
                  disabled={mutation.isPending}
                />
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
              </div>
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
              License Number
              <div className="relative">
                <input
                  type="text"
                  name="license_number"
                  value={form.license_number}
                  onChange={handleChange}
                  placeholder="License number"
                  className="w-full rounded-lg border border-teal-200 bg-white/60 py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition shadow-sm"
                  required
                  autoComplete="off"
                  disabled={mutation.isPending}
                />
                <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
              </div>
            </label>
            <button
              type="submit"
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-lg transition flex items-center justify-center gap-2"
              disabled={mutation.isPending || !isFormValid}
            >
              {mutation.isPending ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : null}
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