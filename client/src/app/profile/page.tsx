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

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { data: profile, isLoading, error } = useProfile();

  // Helper to get initials for avatar
  const getInitial = () => {
    if (profile?.username) return profile.username[0].toUpperCase();
    if (profile?.fullname) return profile.fullname[0].toUpperCase();
    if (profile?.firstname) return profile.firstname[0].toUpperCase();
    if (profile?.email) return profile.email[0].toUpperCase();
    if (user?.username) return user.username[0].toUpperCase();
    if (user?.email) return user.email[0].toUpperCase();
    return "U";
  };

  // Helper to display full name
  const getFullName = () => {
    if (profile?.fullname) return profile.fullname;
    if (profile?.firstname || profile?.lastname)
      return [profile?.firstname, profile?.lastname].filter(Boolean).join(" ");
    if (profile?.username) return profile.username;
    if (user?.username) return user.username;
    if (user?.email) return user.email;
    return "User";
  };

  // Helper to display role
  const getRole = () => {
    if (profile?.role) return profile.role === "counselor" ? "Certified Counselor" : "Community Member";
    if (user?.role) return user.role === "counselor" ? "Certified Counselor" : "Community Member";
    return "Community Member";
  };

  // Helper for email
  const getEmail = () => profile?.email || user?.email || "";

  // Helper for license number
  const getLicense = () => profile?.license_number || "";

  // Helper for location
  const getLocation = () => profile?.location || "";

  // Helper for about
  const getAbout = () =>
    profile?.about ||
    (getRole() === "Certified Counselor"
      ? "Certified and passionate counselor ready to help others reach their best selves."
      : "Welcome to Clivo! Start your journey to mental wellness and community inspiration.");

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 via-white to-blue-100 px-2 py-8">
      <div className="w-full max-w-xl mx-auto bg-white/80 shadow-xl rounded-3xl px-4 py-6 md:px-8 md:py-10 flex flex-col items-center relative">
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 rounded-3xl flex flex-col items-center justify-center z-10">
            <Loader2 className="w-8 h-8 text-teal-600 animate-spin mb-3" />
            <span className="text-teal-600 font-bold text-lg">Loading profile...</span>
          </div>
        )}
        {/* Error State */}
        {!isLoading && error && (
          <div className="absolute inset-0 bg-white/80 rounded-3xl flex flex-col items-center justify-center z-10">
            <span className="text-red-600 font-bold text-lg px-3">Could not load profile. Please try again later.</span>
          </div>
        )}
        {/* Avatar & Actions */}
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="relative">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-teal-500 to-green-500 flex items-center justify-center text-white font-extrabold text-3xl md:text-4xl shadow-lg">
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
          <h1 className="mt-3 text-2xl md:text-3xl font-bold text-teal-700 text-center">
            {getFullName()}
          </h1>
          <span className="text-md md:text-lg text-gray-500 font-medium text-center">
            {getRole()}
          </span>
        </div>

        {/* Info Section */}
        <section className="mt-6 w-full flex flex-col gap-4 items-center md:items-start">
          <div className="flex flex-col md:flex-row gap-4 w-full justify-center md:justify-start">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-teal-400" />
              <span className="text-gray-700 text-base md:text-lg font-medium">
                {getEmail()}
              </span>
            </div>
            {getLicense() && (
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 text-base md:text-lg font-medium">
                  License: {getLicense()}
                </span>
              </div>
            )}
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
        <section className="mt-8 w-full">
          <div className="bg-teal-50 rounded-xl p-4 md:p-6 shadow flex flex-col gap-2">
            <h2 className="text-lg md:text-xl font-bold text-teal-700 flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              About
            </h2>
            <p className="text-gray-700 text-base md:text-lg font-medium">
              {getAbout()}
            </p>
          </div>
        </section>

        {/* Actions */}
        <div className="mt-8 w-full flex flex-col gap-3 items-center md:items-end">
          <button
            onClick={logout}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-teal-600 to-green-500 shadow hover:from-teal-700 hover:to-green-600 transition text-lg"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}