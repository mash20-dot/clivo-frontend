import { useState } from "react";
import { Save } from "lucide-react";
import toast from "react-hot-toast";

export default function EditPostForm({
  content,
  onSave,
  onCancel,
  isPending,
}: {
  content: string;
  onSave: (newContent: string) => Promise<void> | void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [editContent, setEditContent] = useState(content);

  async function handleSaveClick() {
    try {
      await onSave(editContent);
      toast.success("Post updated successfully!");
    } catch (err) {
      toast.error("Failed to update post.");
    }
  }

  return (
    <div className="mb-3">
      <textarea
        rows={2}
        className="w-full resize-none bg-white border border-teal-200 rounded-xl px-3 py-2 text-sm font-medium mb-2"
        value={editContent}
        onChange={e => setEditContent(e.target.value)}
        disabled={isPending}
      />
      <div className="flex gap-2">
        <button
          className="bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-1"
          onClick={handleSaveClick}
          disabled={isPending}
        >
          {isPending ? (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save
        </button>
        <button
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}