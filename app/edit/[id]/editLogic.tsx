"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Blog {
  id: number;
  title: string;
  content: string;
  published: boolean;
}

export default function EditPostLogic() {
  const router = useRouter();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);

  // fetch existing blog to pre-fill form
  const { data: blog, isPending: isFetching } = useQuery<Blog>({
    queryKey: ["blog", id],
    queryFn: async () => {
      const res = await axios.get(`/api/blog/${id}`);
      return res.data.data;
    },
    staleTime: 0,
  });

  // ✅ pre-fill form once data loads
  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setContent(blog.content);
      setPublished(blog.published);
    }
  }, [blog]);

  const editPostMutation = useMutation({
    mutationFn: async (updated: {
      title: string;
      content: string;
      published: boolean;
    }) => {
      const res = await axios.put(`/api/blog/${id}`, updated);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // refresh dashboard list
      queryClient.invalidateQueries({ queryKey: ["blog", id] }); // refresh this blog cache
      router.push("/dashboard");
    },
    onError: (error: any) =>
      alert(error.response?.data?.message || "Failed to update post"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return alert("Fill all fields");
    editPostMutation.mutate({ title, content, published });
  };

  const inputClass =
    "px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white w-full";

  if (isFetching)
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <span className="text-zinc-400 text-sm">Loading post...</span>
      </div>
    );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/dashboard"
          className="text-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition mb-6 inline-block"
        >
          ← Back to dashboard
        </Link>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-white mb-1">
            Edit post
          </h1>
          <p className="text-sm text-zinc-400 mb-6">
            Update your post details below
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
                  Published
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Turn off to revert to draft
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
            {editPostMutation.isError && (
              <p className="text-red-500 text-sm">
                {(editPostMutation.error as any)?.response?.data?.message ||
                  "An error occurred"}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={editPostMutation.isPending}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium text-white transition ${
                  editPostMutation.isPending
                    ? "bg-zinc-400 cursor-not-allowed"
                    : "bg-zinc-900 hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                }`}
              >
                {editPostMutation.isPending
                  ? "Saving..."
                  : published
                    ? "Save & publish"
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
