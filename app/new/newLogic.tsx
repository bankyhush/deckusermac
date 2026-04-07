"use client";

import { useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewPostLogic() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);

  const createPostMutation = useMutation({
    mutationFn: async (post: {
      title: string;
      content: string;
      published: boolean;
    }) => {
      const res = await axios.post("/api/blog/createBlog", post);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // ✅ refresh dashboard list
      router.push("/dashboard");
    },
    onError: (error: any) =>
      alert(error.response?.data?.message || "Failed to create post"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return alert("Fill all fields");
    createPostMutation.mutate({ title, content, published });
  };

  const inputClass =
    "px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white w-full";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <Link
          href="/dashboard"
          className="text-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition mb-6 inline-block"
        >
          ← Back to dashboard
        </Link>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-white mb-1">
            Create new post
          </h1>
          <p className="text-sm text-zinc-400 mb-6">
            Fill in the details below to publish or save as draft
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                Title
              </label>
              <input
                type="text"
                placeholder="Enter post title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                Content
              </label>
              <textarea
                placeholder="Write your post content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className={`${inputClass} resize-none`}
              />
              <p className="text-xs text-zinc-400 text-right">
                {content.length} characters
              </p>
            </div>

            {/* Published toggle */}
            <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700">
              <div>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Publish immediately
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Turn off to save as draft
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPublished(!published)}
                className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ${
                  published
                    ? "bg-zinc-900 dark:bg-white"
                    : "bg-zinc-200 dark:bg-zinc-700"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full transition-all ${
                    published
                      ? "left-5 bg-white dark:bg-zinc-900"
                      : "left-1 bg-white dark:bg-zinc-400"
                  }`}
                />
              </button>
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  published ? "bg-green-500" : "bg-zinc-300"
                }`}
              />
              <span className="text-xs text-zinc-400">
                {published ? "Will be published" : "Will be saved as draft"}
              </span>
            </div>

            {/* Error */}
            {createPostMutation.isError && (
              <p className="text-red-500 text-sm">
                {(createPostMutation.error as any)?.response?.data?.message ||
                  "An error occurred"}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={createPostMutation.isPending}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium text-white transition ${
                  createPostMutation.isPending
                    ? "bg-zinc-400 cursor-not-allowed"
                    : "bg-zinc-900 hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                }`}
              >
                {createPostMutation.isPending
                  ? "Creating..."
                  : published
                    ? "Publish post"
                    : "Save as draft"}
              </button>

              <Link href="/dashboard" className="flex-1">
                <button
                  type="button"
                  className="w-full py-2.5 rounded-lg text-sm border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                  Cancel
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
