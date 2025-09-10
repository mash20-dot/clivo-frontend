import { Heart, MessageCircle, Repeat2, Share2 } from "lucide-react";

interface PostActionsProps {
  likes: number;
  liked: boolean;
  onLike: () => void;
  repliesCount: number;
  onComment: () => void;
  onShare: () => void;
  isLoggedIn: boolean;
  likePending: boolean;
}

const tealColor = "#14b8a6";

export default function PostActions({
  likes,
  liked,
  onLike,
  repliesCount,
  onComment,
  onShare,
  isLoggedIn,
  likePending,
}: PostActionsProps) {
  return (
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
        className={`flex items-center gap-1 hover:bg-teal-50 p-2 rounded transition font-semibold ${liked ? "text-teal-600" : "text-teal-500"}`}
        disabled={!isLoggedIn || likePending}
        onClick={onLike}
        tabIndex={-1}
        title={liked ? "Unlike" : "Like"}
      >
        <Heart
          className="w-5 h-5"
          color={liked ? tealColor : tealColor}
          fill={liked ? tealColor : "none"}
        />
        <span>{likes}</span>
      </button>
      <button
        className="flex items-center gap-1 px-2 py-1.5 rounded transition font-semibold hover:bg-teal-100 focus:ring-2 focus:ring-teal-200 focus:outline-none"
        tabIndex={-1}
        title="Share"
        onClick={onShare}
      >
        <Share2 className="w-5 h-5" color={tealColor} />
        <span>Share</span>
      </button>
    </div>
  );
}