'use client';
import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, User, Loader2 } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSignupUser } from "@/lib/mutations";
import { useAuth } from "@/lib/UserContext";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const router = useRouter();

  const mutation = useSignupUser();
  const { setUser } = useAuth();

  const isFormValid =
    form.firstname.trim() &&
    form.lastname.trim() &&
    form.email.trim() &&
    form.password.trim() &&
    form.confirm_password.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Use trimmed values for both password fields
    if (form.password.trim() !== form.confirm_password.trim()) {
      toast.error("Passwords do not match.");
      return;
    }
    mutation.mutate(
      {
        firstname: form.firstname.trim(),
        lastname: form.lastname.trim(),
        email: form.email.trim(),
        password: form.password,
        confirm_password: form.confirm_password,
      },
      {
        onSuccess: (data) => {
          if (data.access_token) {
            setUser({
              access_token: data.access_token,
              email: form.email,
              username: data.username,
              role: "user",
            });
          }
          toast.success("Account created! Welcome to Clivo.");
          router.push("/dashboard");
        },
        onError: (err: unknown) => {
          let message = "Could not create account. Please try again.";
          if (err && typeof err === "object" && "response" in err) {
            const errorObj = err as { response?: { data?: { message?: string } } };
            if (errorObj.response?.data?.message) {
              message = errorObj.response.data.message;
            }
          }
          toast.error(message);
        },
      }
    );
  };

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
            alt="Signup Illustration"
            className="rounded-full object-cover border-4 border-teal-200 shadow-lg"
            width={112}
            height={112}
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Create your account</h2>
        <p className="text-gray-600 mb-6 text-center text-sm">
          Start your journey to mental wellness with Clivo.
        </p>

        {/* Signup Form */}
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit} autoComplete="off">
          <div className="flex gap-3">
            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700 w-1/2">
              First name
              <div className="relative">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full rounded-lg border border-teal-200 bg-white/60 py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition shadow-sm"
                  required
                  autoComplete="given-name"
                  value={form.firstname}
                  onChange={(e) => setForm(f => ({ ...f, firstname: e.target.value }))}
                  disabled={mutation.isPending}
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
              </div>
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700 w-1/2">
              Last name
              <div className="relative">
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full rounded-lg border border-teal-200 bg-white/60 py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition shadow-sm"
                  required
                  autoComplete="family-name"
                  value={form.lastname}
                  onChange={(e) => setForm(f => ({ ...f, lastname: e.target.value }))}
                  disabled={mutation.isPending}
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
              </div>
            </label>
          </div>

          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            Email
            <div className="relative">
              <input
                type="email"
                placeholder="you@email.com"
                className="w-full rounded-lg border border-teal-200 bg-white/60 py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition shadow-sm"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
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
                placeholder="Password"
                className="w-full rounded-lg border border-teal-200 bg-white/60 py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 transition shadow-sm"
                required
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
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
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                value={form.confirm_password}
                onChange={(e) => setForm(f => ({ ...f, confirm_password: e.target.value }))}
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
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </label>

          <button
            type="submit"
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-lg transition flex items-center justify-center gap-2"
            disabled={
              mutation.isPending ||
              !isFormValid
            }
          >
            {mutation.isPending ? <Loader2 className="animate-spin w-5 h-5" /> : null}
            Create Account
          </button>
        </form>
        <div className="mt-6 w-full flex flex-col items-center text-sm">
          <span className="text-gray-500">Already have an account?</span>
          <Link href="/auth/login" className="mt-1 text-green-600 font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}