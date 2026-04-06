// app/page.tsx
"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="mx-auto w-16 h-16 bg-zinc-900 dark:bg-white rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 stroke-white dark:stroke-zinc-900 fill-none stroke-2"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 2L2 12h4v8h4v-6h4v6h4v-8h4z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
          Welcome to MyApp
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">
          Your next-gen app experience starts here. Login or register to
          continue.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-4">
          <Link
            href="/login"
            className="py-3 px-6 rounded-lg text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 text-lg font-medium hover:bg-zinc-700 dark:hover:bg-zinc-200 transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="py-3 px-6 rounded-lg text-zinc-900 dark:text-white border border-zinc-900 dark:border-white text-lg font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
