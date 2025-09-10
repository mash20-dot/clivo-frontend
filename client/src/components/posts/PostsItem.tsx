import { useState } from "react";
import { Edit2 } from "lucide-react";
import EditPostForm from "./EditPostForm";
import PostActions from "./PostActions";

export interface Post {
  id: string;
  user_id: string | number;
  content: string;
  username: string | null;
  likes: number;
}

interface PostItemProps {
  post: Post;
  userId: string | undefined;
  liked: boolean;
  likes: number;
  repliesCount: number;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onSaveEdit: (postId: string, newContent: string) => Promise<void> | void;
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
  onShare,
  onSaveEdit,
  editPending,
}: PostItemProps) {
  const [editing, setEditing] = useState<boolean>(false);

  // Debug: Show values and types
  console.log(
    "post.user_id", post.user_id, typeof post.user_id, 
    "userId", userId, typeof userId,
    "equal", String(post.user_id) === String(userId)
  );

  function handleEdit() {
    setEditing(true);
  }

  async function handleSave(newContent: string) {
    await onSaveEdit(post.id, newContent);
    setEditing(false);
  }

  function handleCancel() {
    setEditing(false);
  }

  // Only show pencil icon for owner
  const isOwner = String(post.user_id) === String(userId);

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-teal-100 p-4 sm:p-6 relative">
      {/* Edit icon top-right for owner */}
      {isOwner && !editing && (
        <button
          className="absolute top-5 right-6 z-10 bg-teal-50 hover:bg-teal-100 p-2 rounded-full shadow transition"
          onClick={handleEdit}
          title="Edit post"
          style={{
            boxShadow: "0 2px 8px rgba(20,184,166,.12)"
          }}
        >
          <Edit2 className="w-5 h-5 text-teal-700" />
        </button>
      )}

      <div className="flex gap-3 sm:gap-4 items-start">
        <div className="rounded-full object-cover border-2 border-teal-200 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center bg-teal-600 text-white font-bold text-xl select-none">
          {post.username ? post.username[0].toUpperCase() : "U"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-bold text-teal-700 text-base sm:text-lg">
              {post.username || "Anonymous"}
            </span>
          </div>
          {editing ? (
            <EditPostForm
              content={post.content}
              onSave={handleSave}
              onCancel={handleCancel}
              isPending={editPending}
            />
          ) : (
            <p className="text-sm sm:text-base text-gray-700 mb-3 whitespace-pre-line font-medium break-words">
              {post.content}
            </p>
          )}
          <PostActions
            likes={likes}
            liked={liked}
            onLike={onLike}
            repliesCount={repliesCount}
            onComment={onComment}
            onShare={onShare}
            isLoggedIn={!!userId}
            likePending={editPending}
          />
        </div>
      </div>
    </div>
  );
}