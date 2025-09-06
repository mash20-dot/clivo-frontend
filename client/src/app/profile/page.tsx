"use client";
import { useProfile } from "@/lib/userProfile";
import { useAuth } from "@/lib/UserContext";
import Link from "next/link";
import {
  LogOut,
  Pencil,
  BadgeCheck,
  MapPin,
  Mail,
  User as UserIcon,
  Loader2,
} from "lucide-react";
import React from "react";

// Decorative tags for role/license
const Tag = ({ label, color }: { label: string; color: string }) => (
  <span
    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${color} bg-opacity-10 border border-transparent`}
  >
    {label}
  </span>
);

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { data: profile, isLoading, error } = useProfile();

  // Get initials for avatar
  const getInitial = () => {
    if (profile?.role === "counselor" && profile?.fullname)
      return profile.fullname[0]?.toUpperCase();
    if (profile?.firstname) return profile.firstname[0]?.toUpperCase();
    if (profile?.lastname) return profile.lastname[0]?.toUpperCase();
    return "U";
  };

  // Get full name
  const getFullName = () => {
    if (profile?.role === "counselor" && profile?.fullname)
      return profile.fullname;
    if (profile?.firstname || profile?.lastname)
      return [profile.firstname, profile.lastname].filter(Boolean).join(" ");
    return "User";
  };

  // Get role as tag
  const getRole = () => {
    if (profile?.role)
      return profile.role === "counselor"
        ? "Certified Counselor"
        : "Community Member";
    if (user?.role)
      return user.role === "counselor"
        ? "Certified Counselor"
        : "Community Member";
    return "Community Member";
  };

  const getEmail = () => profile?.email || user?.email || "";
  const getLicense = () => profile?.license_number || "";
  const getLocation = () => profile?.location || "";
  const getAbout = () =>
    profile?.about ||
    (getRole() === "Certified Counselor"
      ? "Certified and passionate counselor ready to help others reach their best selves."
      : "Welcome to Clivo! Start your journey to mental wellness and community inspiration.");

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 via-white to-blue-100 px-2 py-8 relative overflow-hidden">
      {/* Decorative floating shapes */}
      <div className="absolute top-12 left-3 w-8 h-8 bg-teal-200 rounded-full opacity-30 blur-lg animate-bounce" />
      <div className="absolute bottom-10 right-12 w-12 h-12 bg-green-300 rounded-full opacity-30 blur-lg animate-pulse" />
      <div className="absolute bottom-16 left-24 w-6 h-6 bg-blue-300 rounded-full opacity-30 blur-lg animate-bounce" />
      <div className="w-full max-w-xl mx-auto bg-white/80 shadow-2xl rounded-3xl px-4 py-6 md:px-10 md:py-12 flex flex-col items-center relative border border-teal-100">
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 rounded-3xl flex flex-col items-center justify-center z-10">
            <Loader2 className="w-8 h-8 text-teal-600 animate-spin mb-3" />
            <span className="text-teal-600 font-bold text-lg">
              Loading profile...
            </span>
          </div>
        )}
        {/* Error State */}
        {!isLoading && error && (
          <div className="absolute inset-0 bg-white/80 rounded-3xl flex flex-col items-center justify-center z-10">
            <span className="text-red-600 font-bold text-lg px-3">
              Could not load profile. Please try again later.
            </span>
          </div>
        )}
        {/* Avatar & Actions */}
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="relative">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-teal-500 to-green-500 flex items-center justify-center text-white font-extrabold text-3xl md:text-5xl shadow-xl border-4 border-white">
              {getInitial()}
            </div>
            <Link
              href="/profile/edit"
              className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow hover:bg-teal-100 transition"
              aria-label="Edit Profile"
            >
              <Pencil className="w-5 h-5 text-teal-600" />
            </Link>
          </div>
          <h1 className="mt-4 text-3xl md:text-4xl font-extrabold text-teal-700 text-center drop-shadow-lg">
            {getFullName()}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            {getRole() === "Certified Counselor" ? (
              <Tag label="Counselor" color="text-green-700 bg-green-200" />
            ) : (
              <Tag label="Member" color="text-teal-700 bg-teal-200" />
            )}
            {getLicense() && (
              <Tag
                label={`License: ${getLicense()}`}
                color="text-blue-700 bg-blue-200"
              />
            )}
          </div>
        </div>

        {/* Info Section */}
        <section className="mt-8 w-full flex flex-col gap-6 items-center md:items-start">
          <div className="flex flex-col md:flex-row gap-6 w-full justify-center md:justify-start">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-teal-400" />
              <span className="text-gray-700 text-base md:text-lg font-medium">
                {getEmail()}
              </span>
            </div>
            {getLocation() && (
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700 text-base md:text-lg font-medium">
                  {getLocation()}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* About Section */}
        <section className="mt-10 w-full">
          <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl p-5 md:p-8 shadow flex flex-col gap-2 border border-teal-100">
            <h2 className="text-lg md:text-xl font-bold text-teal-700 flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              About
            </h2>
            <p className="text-gray-700 text-base md:text-lg font-medium leading-relaxed">
              {getAbout()}
            </p>
          </div>
        </section>

        {/* Actions */}
        <div className="mt-10 w-full flex flex-col gap-3 items-center md:items-end">
          <button
            onClick={logout}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-teal-600 to-green-500 shadow hover:from-teal-700 hover:to-green-600 transition text-lg"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}
