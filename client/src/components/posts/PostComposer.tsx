import { useState } from "react";
import { useCreatePost } from "@/lib/mutations";
import { useAuth } from "@/lib/UserContext";
import { useProfile, Profile } from "@/lib/userProfile";
import { Image as ImageIcon, Smile, FileText, Bold, Italic } from "lucide-react";

const tealColor = "#14b8a6";

function getFirstNameInitial(profile: Profile | null | undefined): string {
  if (!profile) return "U";
  if (
    profile.role === "user" &&
    profile.firstname &&
    profile.firstname.length > 0
  ) {
    return profile.firstname[0].toUpperCase();
  }
  if (
    profile.role === "counselor" &&
    profile.fullname &&
    profile.fullname.length > 0
  ) {
    return profile.fullname[0].toUpperCase();
  }
  return "U";
}

export default function PostComposer() {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const [composer, setComposer] = useState("");
  const createPost = useCreatePost(user?.access_token);

  function handlePostSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (composer.trim() === "") return;

    createPost.mutate(
      { content: composer },
      {
        onSuccess: () => {
          setComposer("");
        },
      }
    );
  }

  return (
    <form onSubmit={handlePostSubmit} className="bg-white rounded-3xl shadow-lg border border-teal-100 mb-6 p-4 sm:p-6">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="rounded-full object-cover border-2 border-teal-200 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center bg-teal-600 text-white font-bold text-xl select-none">
          {getFirstNameInitial(profile)}
        </div>
        <div className="w-full flex flex-col">
          <textarea
            rows={2}
            className="w-full resize-none bg-transparent focus:outline-none text-[0.92rem] sm:text-base placeholder:text-gray-400 font-medium border border-teal-100 rounded-xl px-3 py-2 transition focus:ring-2 focus:ring-teal-200 focus:bg-white min-h-[48px] sm:min-h-[56px] text-black"
            placeholder="Share your story or thought for today..."
            value={composer}
            onChange={(e) => setComposer(e.target.value)}
            disabled={!user || createPost.isPending}
            style={{
              cursor: user && !createPost.isPending ? "text" : "not-allowed",
              color: "#111",
            }}
            tabIndex={0}
          />
          <div className="flex items-center gap-2 sm:gap-3 mt-3 flex-wrap">
            <button type="button" className="p-2 rounded hover:bg-teal-50 transition" tabIndex={-1} title="Add image">
              <ImageIcon className="w-5 h-5" color={tealColor} />
            </button>
            <button type="button" className="p-2 rounded hover:bg-teal-50 transition" tabIndex={-1} title="Add emoji">
              <Smile className="w-5 h-5" color={tealColor} />
            </button>
            <button type="button" className="p-2 rounded hover:bg-teal-50 transition" tabIndex={-1} title="Attach file">
              <FileText className="w-5 h-5" color={tealColor} />
            </button>
            <button type="button" className="p-2 rounded hover:bg-teal-50 transition" tabIndex={-1} title="Bold">
              <Bold className="w-5 h-5" color={tealColor} />
            </button>
            <button type="button" className="p-2 rounded hover:bg-teal-50 transition" tabIndex={-1} title="Italic">
              <Italic className="w-5 h-5" color={tealColor} />
            </button>
            <button
              type="submit"
              className="ml-auto bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 sm:px-7 py-2 rounded-full shadow transition text-sm sm:text-base disabled:bg-teal-200 flex items-center gap-2"
              disabled={!user || composer.trim() === "" || createPost.isPending}
            >
              {createPost.isPending ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Posting...
                </>
              ) : (
                "Post"
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}