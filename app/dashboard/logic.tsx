"use client";

import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useMe } from "@/hooks/useMe";

interface BlogPost {
  id: number;
  title: string;
  author: string;
  published: boolean;
  createdAt: string;
}

export default function DashboardLogic() {
  const { data: user } = useMe();

  const router = useRouter();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data, isPending, error } = useQuery<BlogPost[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await axios.get("/api/blog/view/");
      return res.data.data;
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`/api/blog/${id}/delete`);
    },
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<BlogPost[]>(["posts"], (old) =>
        old?.filter((post) => post.id !== deletedId),
      );
      setDeletingId(null);
    },
    onError: () => setDeletingId(null),
  });

  const handleDelete = (id: number) => {
    if (confirm("Delete this post?")) {
      setDeletingId(id);
      deletePostMutation.mutate(id);
    }
  };

  const handleLogout = async () => {
    await axios.post("/api/auth/logout");
    queryClient.clear();
    router.push("/login");
  };

  const published = data?.filter((p) => p.published).length ?? 0;
  const drafts = data?.filter((p) => !p.published).length ?? 0;

  if (isPending)
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <span className="text-zinc-400 text-sm">Loading...</span>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <span className="text-red-400 text-sm">Failed to load posts.</span>
      </div>
    );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
              Hi, {user?.name ?? "..."}👋
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/feeds">
              <button className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-green-600 text-white dark:text-white rounded-lg text-sm font-sans hover:opacity-80 transition">
                Fresh Feeds :)
              </button>
            </Link>
            <Link href="/new">
              <button className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg text-sm font-medium hover:opacity-80 transition">
                + New post
              </button>
            </Link>
            <Link href="/profile">
              <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-sm font-medium text-blue-700 dark:text-blue-300 cursor-pointer hover:opacity-80 transition">
                {user?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="cursor-pointer px-3 py-2 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-white border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "Total posts",
              value: data?.length ?? 0,
              delta: "+3 this week",
            },
            {
              label: "Published",
              value: published,
              delta: `${Math.round((published / (data?.length || 1)) * 100)}% published`,
            },
            { label: "Drafts", value: drafts, delta: "Pending review" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4"
            >
              <p className="text-xs text-zinc-400 uppercase tracking-wide mb-1">
                {stat.label}
              </p>
              <p className="text-3xl font-semibold text-zinc-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-xs text-zinc-400 mt-1">{stat.delta}</p>
            </div>
          ))}
        </div>

        {/* Posts table */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
            <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Recent posts
            </h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wide">
                  Title
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wide">
                  Date
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wide">
                  Status
                </th>
                <th className="text-right px-6 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-12 text-zinc-400 text-sm"
                  >
                    No posts yet.{" "}
                    <Link
                      href="/new"
                      className="text-zinc-600 dark:text-zinc-300 underline"
                    >
                      Create your first post
                    </Link>
                  </td>
                </tr>
              ) : (
                data?.map((post) => (
                  <tr
                    key={post.id}
                    className="border-t border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/post/${post.id}`}
                        className="font-medium text-zinc-900 dark:text-white hover:text-blue-600 hover:underline transition-colors"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-zinc-400 text-xs">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                          post.published
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link href={`/edit/${post.id}`}>
                        <button className="px-3 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={deletingId === post.id}
                        className="px-3 py-1.5 text-xs rounded-lg border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50"
                      >
                        {deletingId === post.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
