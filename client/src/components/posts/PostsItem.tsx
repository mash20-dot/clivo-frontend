import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share2,
  X as XIcon,
  Facebook,
  Linkedin,
  Clipboard,
} from "lucide-react";
import type { ReplyResponse } from "@/lib/mutations";
import RepliesSection from "./RepliesSection";

const tealColor = "#14b8a6";

export interface Post {
  id: string;
  user_id: string;
  content: string;
  username: string | null;
  likes: number;
  replies?: ReplyResponse[];
}

export interface PostItemProps {
  post: Post;
  userId: string | undefined;
  liked: boolean;
  likes: number;
  repliesCount: number;
  onLike: () => void;
  onComment: () => void;
  showReplySection: boolean;
  replyValue: string;
  setReplyValue: (v: string) => void;
  onReplyCancel: () => void;
  onRepliesLoaded: (count: number) => void;
  onReplyPosted: () => void;
  token?: string;
  openShareId: string | null;
  setOpenShareId: (id: string | null) => void;
  onShare: (platform: string, post: Post) => void;
  onSaveEdit: (postId: string, newContent: string) => Promise<void>;
  editPending: boolean;
}

export default function PostItem({
  post,
  userId,
  liked,
  likes,
  repliesCount,
  onLike,
  onComment,
  showReplySection,
  replyValue,
  setReplyValue,
  onReplyCancel,
  onRepliesLoaded,
  onReplyPosted,
  token,
  openShareId,
  setOpenShareId,
  onShare,
  onSaveEdit,
  editPending,
}: PostItemProps) {
  const [editing, setEditing] = useState<boolean>(false);
  const [editContent, setEditContent] = useState<string>(post.content);

  const isOwner = String(post.user_id) === String(userId);

  function handleEdit() {
    setEditing(true);
    setEditContent(post.content);
  }

  async function handleSave() {
    await onSaveEdit(post.id, editContent);
    setEditing(false);
  }

  function handleCancelEdit() {
    setEditing(false);
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-teal-100 p-4 sm:p-6 relative">
      {/* Edit icon top-right for owner, responsive and smaller on mobile */}
      {isOwner && !editing && (
        <button
          className={`
            absolute z-10
            right-3 top-3
            sm:right-6 sm:top-5
            bg-teal-50 hover:bg-teal-100
            p-1.5 sm:p-2
            rounded-full shadow transition
            flex items-center justify-center
            border border-teal-200
            active:scale-95
          `}
          onClick={handleEdit}
          title="Edit post"
          style={{
            boxShadow: "0 2px 8px rgba(20,184,166,.12)",
            fontSize: "1.1rem",
          }}
        >
          <svg
            className="text-teal-700 w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
          </svg>
        </button>
      )}

      <div className="flex gap-3 sm:gap-4 items-start">
        <div className="rounded-full object-cover border-2 border-teal-200 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center bg-teal-600 text-white font-bold text-xl select-none">
          {post.username && post.username[0]
            ? post.username[0].toUpperCase()
            : "U"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-bold text-teal-700 text-base sm:text-lg">
              {post.username || "Anonymous"}
            </span>
          </div>
          {editing ? (
            <div>
              <textarea
                className="w-full resize-none bg-white border-2 border-teal-100 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 rounded-2xl py-3 px-4 text-sm text-gray-800 placeholder:text-gray-400 font-medium shadow-sm transition duration-200 outline-none"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
                disabled={editPending}
              />
              <div className="flex gap-2 mt-2">
                <button
                  className="bg-teal-600 text-white px-4 py-1.5 rounded-xl font-semibold shadow hover:bg-teal-700 transition text-sm"
                  onClick={handleSave}
                  disabled={editPending}
                >
                  {editPending ? "Saving..." : "Save"}
                </button>
                <button
                  className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-xl font-semibold shadow hover:bg-gray-200 transition text-sm"
                  onClick={handleCancelEdit}
                  disabled={editPending}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm sm:text-base text-gray-700 mb-3 whitespace-pre-line font-medium break-words">
              {post.content}
            </p>
          )}
          <div className="flex items-center gap-3 sm:gap-6 text-teal-500 mt-2 text-xs sm:text-sm relative">
            <button
              className="flex items-center gap-1 hover:bg-teal-50 p-2 rounded transition font-semibold"
              onClick={onComment}
              aria-label="Comment"
              title="Comment"
            >
              <MessageCircle className="w-5 h-5" color={tealColor} />
              <span>{repliesCount}</span>
            </button>
            <button
              className="flex items-center gap-1 hover:bg-teal-50 p-2 rounded transition font-semibold"
              tabIndex={-1}
              title="Repost"
            >
              <Repeat2 className="w-5 h-5" color={tealColor} />
              <span>0</span>
            </button>
            <button
              className={`flex items-center gap-1 hover:bg-teal-50 p-2 rounded transition font-semibold ${
                liked ? "text-teal-600" : "text-teal-500"
              }`}
              disabled={!userId}
              onClick={onLike}
              tabIndex={-1}
              title={liked ? "Unlike" : "Like"}
            >
              <Heart
                className="w-5 h-5"
                color={tealColor}
                fill={liked ? tealColor : "none"}
              />
              <span>{likes}</span>
            </button>
            <div className="relative inline-block">
              <button
                className={`flex items-center gap-1 px-2 py-1.5 rounded transition font-semibold
                  hover:bg-teal-100 focus:ring-2 focus:ring-teal-200 focus:outline-none
                  ${openShareId === post.id ? "bg-teal-50" : ""}
                `}
                tabIndex={-1}
                title="Share"
                onClick={() =>
                  setOpenShareId(openShareId === post.id ? null : post.id)
                }
              >
                <Share2 className="w-5 h-5" color={tealColor} />
                <span>Share</span>
              </button>
              {openShareId === post.id && (
                <div className="absolute z-50 right-0 mt-2">
                  <div className="flex justify-end pr-6">
                    <div className="w-3 h-3 bg-white border-t border-l border-gray-200 rotate-45 -mt-2 mr-2 shadow-sm"></div>
                  </div>
                  <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl p-2 min-w-[210px] max-w-xs flex flex-col gap-1 transition relative">
                    <button
                      className="flex items-center gap-2 px-3 py-2 rounded-xl transition hover:bg-teal-50 text-gray-900 font-medium group"
                      onClick={() => onShare("webshare", post)}
                    >
                      <Share2 className="w-4 h-4 text-teal-500 group-hover:text-teal-700" />
                      Share Post
                    </button>
                    <button
                      className="flex items-center gap-2 px-3 py-2 rounded-xl transition hover:bg-[#F5F8FA] text-[#1DA1F2] font-medium group"
                      onClick={() => onShare("twitter", post)}
                    >
                      <XIcon className="w-4 h-4 text-[#1DA1F2] group-hover:text-[#0a85d9]" />
                      Share on X (Twitter)
                    </button>
                    <button
                      className="flex items-center gap-2 px-3 py-2 rounded-xl transition hover:bg-[#F0F2F5] text-[#1877F3] font-medium group"
                      onClick={() => onShare("facebook", post)}
                    >
                      <Facebook className="w-4 h-4 text-[#1877F3] group-hover:text-[#145cb7]" />
                      Share on Facebook
                    </button>
                    <button
                      className="flex items-center gap-2 px-3 py-2 rounded-xl transition hover:bg-[#eef3f8] text-[#0077B5] font-medium group"
                      onClick={() => onShare("linkedin", post)}
                    >
                      <Linkedin className="w-4 h-4 text-[#0077B5] group-hover:text-[#005983]" />
                      Share on LinkedIn
                    </button>
                    <div className="my-1 border-t border-gray-100" />
                    <button
                      className="flex items-center gap-2 px-3 py-2 rounded-xl transition hover:bg-teal-50 text-gray-900 font-medium group"
                      onClick={() => onShare("copy", post)}
                    >
                      <Clipboard className="w-4 h-4 text-gray-400 group-hover:text-teal-600" />
                      Copy Link
                    </button>
                    <button
                      className="absolute top-2 right-3 text-gray-400 text-xl font-bold hover:text-teal-600 transition"
                      onClick={() => setOpenShareId(null)}
                      aria-label="Close"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {showReplySection && (
            <RepliesSection
              postId={post.id}
              token={token}
              replyValue={replyValue}
              setReplyValue={setReplyValue}
              onCancel={onReplyCancel}
              onRepliesLoaded={onRepliesLoaded}
              onReplyPosted={onReplyPosted}
              replies={post.replies || []}
            />
          )}
        </div>
      </div>
    </div>
  );
}