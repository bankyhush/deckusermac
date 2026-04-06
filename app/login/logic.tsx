"use client";

import { useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginLogic() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: async (creds: { email: string; password: string }) => {
      const res = await axios.post("/api/auth/login", creds);
      return res.data;
    },
    onSuccess: () => router.push("/dashboard"),
    onError: (error: any) =>
      alert(error.response?.data?.message || "Login failed"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return alert("Fill all fields");
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="w-10 h-10 bg-zinc-900 dark:bg-white rounded-xl flex items-center justify-center mb-6">
          <svg
            className="w-5 h-5 stroke-white dark:stroke-zinc-900 fill-none stroke-2"
            viewBox="0 0 18 18"
          >
            <path
              d="M9 2L2 7v9h5v-5h4v5h5V7z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-1">
          Welcome back
        </h1>
        <p className="text-sm text-zinc-500 mb-8">
          Sign in to your account to continue
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                Password
              </label>
              <span className="text-xs text-zinc-400 hover:text-zinc-600 cursor-pointer">
                Forgot password?
              </span>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
            />
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className={`w-full py-2.5 rounded-lg text-sm font-medium text-white transition ${
              loginMutation.isPending
                ? "bg-zinc-400 cursor-not-allowed"
                : "bg-zinc-900 hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            }`}
          >
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </button>

          {loginMutation.isError && (
            <p className="text-red-500 text-sm text-center">
              {(loginMutation.error as any)?.response?.data?.message ||
                "An error occurred"}
            </p>
          )}
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
          <span className="text-xs text-zinc-400">or</span>
          <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
        </div>

        <button className="w-full py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition flex items-center justify-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-sm text-zinc-500 mt-6">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-zinc-900 dark:text-white font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
