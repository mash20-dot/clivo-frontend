import { useMemo, useEffect, useRef } from "react";
import { Smile } from "lucide-react";
import { useFetchReplies, useCreateReply } from "@/lib/mutations";

export interface Reply {
  id?: string;
  post_id: string | number;
  user_id: string | number;
  content: string;
  username?: string;
  anonymous?: string;
  created_at?: string;
}

interface RepliesSectionProps {
  postId: string;
  token?: string;
  replyValue: string;
  setReplyValue: (v: string) => void;
  onCancel: () => void;
  onRepliesLoaded: (count: number) => void;
  onReplyPosted: () => void;
}

export default function RepliesSection({
  postId,
  token,
  replyValue,
  setReplyValue,
  onCancel,
  onRepliesLoaded,
  onReplyPosted,
}: RepliesSectionProps) {
  const createReplyMutation = useCreateReply(token);
  const { data: allReplies = [], isPending } = useFetchReplies(postId, token);

  const replies = useMemo<Reply[]>(
    () =>
      allReplies
        .filter((r) => String(r.post_id) === String(postId))
        .sort((a, b) => Number(b.id) - Number(a.id)),
    [allReplies, postId]
  );

  const lastCountRef = useRef<number>(-1);
  useEffect(() => {
    if (replies.length !== lastCountRef.current) {
      onRepliesLoaded(replies.length);
      lastCountRef.current = replies.length;
    }
  }, [replies.length, onRepliesLoaded]);

  return (
    <div className="mt-5 border-t pt-5 bg-gradient-to-r from-teal-50 via-white to-blue-50 rounded-2xl">
      <div className="flex flex-col sm:flex-row gap-3 items-start">
        <div className="hidden sm:flex flex-shrink-0 items-center justify-center w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-400 rounded-full shadow-lg">
          <Smile className="w-6 h-6 text-white" />
        </div>
        <div className="w-full">
          <div className="relative">
            <textarea
              value={replyValue}
              onChange={(e) => setReplyValue(e.target.value)}
              rows={2}
              maxLength={400}
              className="w-full resize-none bg-white border-2 border-teal-100 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 rounded-2xl py-3 px-4 text-sm text-gray-800 placeholder:text-gray-400 font-medium shadow-sm transition duration-200 outline-none"
              placeholder="Write a thoughtful reply…"
              style={{
                minHeight: "46px",
                boxShadow:
                  "0 2px 12px 0 rgba(20,184,166,.05), 0 1.5px 0 #d1fae5 inset",
              }}
              disabled={createReplyMutation.isPending}
            />
            <span className="absolute bottom-3 right-4 text-xs text-gray-400 select-none">
              {replyValue.length}/400
            </span>
          </div>
          <div className="flex gap-2 mt-4 justify-end">
            <button
              type="button"
              className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-xl font-semibold shadow hover:bg-gray-200 transition text-sm"
              onClick={onCancel}
              disabled={createReplyMutation.isPending}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!token) return;
                if (!replyValue || replyValue.trim() === "") return;
                createReplyMutation.mutate(
                  { post_id: String(postId), content: replyValue },
                  {
                    onSuccess: () => {
                      setReplyValue("");
                      onReplyPosted();
                    },
                  }
                );
              }}
              className={`bg-gradient-to-tr from-teal-500 to-blue-400 hover:from-teal-600 hover:to-blue-500 text-white px-6 py-1.5 rounded-xl font-bold shadow-md transition text-base flex items-center gap-2 ${
                (!replyValue ||
                  replyValue.trim() === "" ||
                  createReplyMutation.isPending) &&
                "opacity-60 cursor-not-allowed"
              }`}
              style={{
                boxShadow:
                  "0 2px 8px 0 rgba(20,184,166,.10), 0 1.5px 0 #a7f3d0 inset",
              }}
              disabled={
                !replyValue ||
                replyValue.trim() === "" ||
                createReplyMutation.isPending
              }
            >
              {createReplyMutation.isPending ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Replying…
                </>
              ) : (
                <>
                  <Smile className="w-5 h-5 -ml-1" />
                  Reply
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="mt-5">
        {isPending ? (
          <div className="text-gray-400 text-xs">Loading replies...</div>
        ) : !replies.length ? (
          <div className="text-gray-400 text-xs">No replies yet.</div>
        ) : (
          <ul className="space-y-3">
            {replies.map((reply, idx) => (
              <li
                key={reply.id ? `reply-${reply.id}` : `reply-${reply.post_id}-${idx}`}
                className="bg-white border border-teal-100 rounded-xl px-4 py-3 shadow flex items-start gap-3"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-300 flex items-center justify-center font-bold text-white text-lg">
                  {(reply.anonymous || "A")[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-semibold text-teal-700 text-sm">
                    {reply.anonymous || "Anonymous"}
                  </span>
                  <p className="text-gray-700 font-medium text-sm mt-1 whitespace-pre-wrap break-words">
                    {reply.content}
                  </p>
                  {reply.created_at && (
                    <span className="text-xs text-gray-400 mt-1 block">
                      {new Date(reply.created_at).toLocaleString()}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}