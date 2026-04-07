"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";

interface Blog {
  id: number;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

export default function FeedsLogic() {
  const {
    data: blogs,
    isPending,
    error,
  } = useQuery<Blog[]>({
    queryKey: ["blogs"],
    queryFn: async () => {
      const res = await axios.get("/api/blog/view/all");
      return res.data.data;
    },
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  if (isPending)
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <span className="text-zinc-400 text-sm">Loading blogs...</span>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <span className="text-red-400 text-sm">Failed to load blogs.</span>
      </div>
    );

  const publishedBlogs = blogs?.filter((b) => b.published) ?? [];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-zinc-900 dark:text-white">
              Fresh Feeds
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              {publishedBlogs.length} published{" "}
              {publishedBlogs.length === 1 ? "post" : "posts"}
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Empty state */}
        {publishedBlogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-zinc-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
                />
              </svg>
            </div>
            <p className="text-zinc-500 text-sm font-medium">No posts yet</p>
            <p className="text-zinc-400 text-xs mt-1">
              Published posts will appear here
            </p>
            <Link href="/new">
              <button className="mt-4 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg text-sm font-medium hover:opacity-80 transition">
                Write your first post
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {publishedBlogs.map((blog) => (
              <Link key={blog.id} href="#">
                <div className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all cursor-pointer h-full flex flex-col">
                  {/* Top — title + excerpt */}
                  <div className="flex-1">
                    <h2 className="text-base font-semibold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                      {blog.title}
                    </h2>
                    <p className="text-sm text-zinc-500 leading-relaxed line-clamp-3">
                      {blog.content}
                    </p>
                  </div>

                  {/* Bottom — author + date */}
                  <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {/* Author initials avatar */}
                      <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-medium text-blue-700 dark:text-blue-300 flex-shrink-0">
                        {blog.user?.name
                          ? blog.user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)
                          : "?"}
                      </div>
                      <span className="text-xs text-zinc-500 truncate">
                        {blog.user?.name ?? "Unknown"}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-400 flex-shrink-0">
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
