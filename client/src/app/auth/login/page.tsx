"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useLoginUser, useLoginCounselor } from "@/lib/mutations";
import { useAuth } from "@/lib/UserContext";

export default function LoginPage() {
  const [loginType, setLoginType] = useState<"user" | "counselor">("user");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();

  const { setUser } = useAuth();

  const userMutation = useLoginUser();
  const counselorMutation = useLoginCounselor();
  const mutation = loginType === "user" ? userMutation : counselorMutation;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form, {
      onSuccess: (data) => {
        if (data.access_token) {
          setUser({
            access_token: data.access_token,
            email: form.email,
            username: data.username,
            role: loginType,
          });
        }
        toast.success("Login successful!");
        router.push("/dashboard");
      },
      onError: (err: unknown) => {
        let message = "Could not login. Please check your credentials.";
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
    });
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-teal-100 via-white to-blue-100 py-8 px-4">
      <div className="max-w-md w-full rounded-3xl bg-white/80 backdrop-blur-md shadow-2xl border border-teal-100 p-8 md:p-12 flex flex-col items-center">
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
            alt="Login Illustration"
            className="rounded-full object-cover border-4 border-teal-200 shadow-lg"
            width={112}
            height={112}
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Welcome Back
        </h2>
        <p className="text-gray-600 mb-6 text-center text-sm">
          Sign in to access your mental wellness on Clivo
        </p>

        {/* Login Type Switch */}
        <div className="mb-4 flex w-full justify-center gap-2">
          <button
            type="button"
            className={`px-4 py-2 rounded-full font-semibold transition ${
              loginType === "user"
                ? "bg-green-600 text-white"
                : "bg-white text-green-600 border border-green-600"
            }`}
            onClick={() => setLoginType("user")}
            disabled={mutation.isPending}
          >
            User
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-full font-semibold transition ${
              loginType === "counselor"
                ? "bg-green-600 text-white"
                : "bg-white text-green-600 border border-green-600"
            }`}
            onClick={() => setLoginType("counselor")}
            disabled={mutation.isPending}
          >
            Counselor
          </button>
        </div>

        {/* Login Form */}
        <form
          className="w-full flex flex-col gap-4"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            Email
            <div className="relative">
              <input
                type="email"
                placeholder="you@email.com"
                className="w-full rounded-lg border border-teal-200 bg-white/60 py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition shadow-sm"
                required
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
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
                placeholder="Password"
                className="w-full rounded-lg border border-teal-200 bg-white/60 py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 transition shadow-sm"
                required
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
                autoComplete="current-password"
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

          <div className="flex items-center justify-between mt-2">
            <div>
              <label className="flex items-center gap-2 text-xs text-gray-600">
                <input
                  type="checkbox"
                  className="accent-green-500"
                  disabled={mutation.isPending}
                />
                Remember me
              </label>
            </div>
            <Link
              href="/auth/forgot"
              className="text-xs text-green-600 hover:underline font-semibold"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-lg transition flex items-center justify-center gap-2"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : null}
            Sign In
          </button>
        </form>

        <div className="mt-6 w-full flex flex-col items-center text-sm">
          <span className="text-gray-500">Don&apos;t have an account?</span>
          <Link
            href="/auth/signup"
            className="mt-1 text-green-600 font-semibold hover:underline"
          >
            Create one
          </Link>
        </div>
      </div>
    </main>
  );
}