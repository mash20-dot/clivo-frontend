"use client";

import React from "react";

export default function PostSkeleton() {
  return (
    <div className="w-full bg-white rounded-2xl shadow-md p-5 mb-6 animate-pulse">
      {/* User Info Skeleton */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200" />
        <div className="flex-1">
          <div className="h-3 w-32 bg-gray-200 rounded" />
          <div className="h-3 w-20 bg-gray-200 rounded mt-1" />
        </div>
      </div>

      {/* Post Content Skeleton */}
      <div className="mt-4 space-y-3">
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 rounded" />
        <div className="h-4 w-4/6 bg-gray-200 rounded" />
      </div>

      {/* Post Image Skeleton */}
      <div className="mt-4 w-full h-48 bg-gray-200 rounded-xl" />

      {/* Actions Skeleton */}
      <div className="mt-5 flex items-center gap-6">
        <div className="w-16 h-5 bg-gray-200 rounded" />
        <div className="w-16 h-5 bg-gray-200 rounded" />
        <div className="w-16 h-5 bg-gray-200 rounded" />
      </div>
    </div>
  );
}