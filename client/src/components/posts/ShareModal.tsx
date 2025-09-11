import React from "react";

export default function ShareModal({ postId, onClose }: { postId: string; onClose: () => void }) {
  const postUrl = typeof window !== "undefined"
    ? `${window.location.origin}/posts/${postId}`
    : `/posts/${postId}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(postUrl);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs">
        <h2 className="text-lg font-bold mb-3">Share Post</h2>
        <input
          type="text"
          value={postUrl}
          readOnly
          className="w-full p-2 border rounded mb-3 text-gray-700"
        />
        <div className="flex gap-2 mb-2">
          <button
            className="bg-teal-600 text-white px-4 py-2 rounded"
            onClick={handleCopy}
          >Copy Link</button>
          <button
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
            onClick={onClose}
          >Close</button>
        </div>
        <div>Share on:
          <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}`} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500 underline">Twitter</a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-800 underline">Facebook</a>
        </div>
      </div>
    </div>
  );
}