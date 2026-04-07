"use client";

import { useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfileLogic() {
  const router = useRouter();

  const [name, setName] = useState("Ada Okafor");
  const [email, setEmail] = useState("ada@example.com");
  const [bio, setBio] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [notifications, setNotifications] = useState({
    email: true,
    marketing: false,
    security: true,
  });

  // update profile
  const updateProfileMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; bio: string }) => {
      const res = await axios.put("/api/auth/profile", data);
      return res.data;
    },
    onSuccess: () => alert("Profile updated!"),
    onError: (error: any) =>
      alert(error.response?.data?.message || "Update failed"),
  });

  // change password
  const changePasswordMutation = useMutation({
    mutationFn: async (data: {
      currentPassword: string;
      newPassword: string;
    }) => {
      const res = await axios.put("/api/auth/password", data);
      return res.data;
    },
    onSuccess: () => {
      alert("Password updated!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error: any) =>
      alert(error.response?.data?.message || "Password change failed"),
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return alert("Name and email are required");
    updateProfileMutation.mutate({ name, email, bio });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword)
      return alert("Fill all fields");
    if (newPassword !== confirmPassword) return alert("Passwords do not match");
    if (newPassword.length < 8)
      return alert("Password must be at least 8 characters");
    changePasswordMutation.mutate({ currentPassword, newPassword });
  };

  const handleLogout = async () => {
    await axios.post("/api/auth/logout");
    router.push("/login");
  };

  const inputClass =
    "px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white w-full";
  const cardClass =
    "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 mb-4";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/dashboard"
            className="text-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition flex items-center gap-1"
          >
            ← Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm text-zinc-400 hover:text-red-500 transition"
          >
            Logout
          </button>
        </div>

        {/* Avatar card */}
        <div className={`${cardClass} flex items-center gap-4`}>
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xl font-semibold text-blue-700 dark:text-blue-300 flex-shrink-0">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <div>
            <p className="text-base font-semibold text-zinc-900 dark:text-white">
              {name}
            </p>
            <p className="text-sm text-zinc-500">{email}</p>
            <p className="text-xs text-zinc-400 mt-1">
              Member since January 2025
            </p>
          </div>
        </div>

        {/* Personal info */}
        <div className={cardClass}>
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            Personal information
          </h2>
          <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                  Full name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                Bio
              </label>
              <input
                type="text"
                placeholder="Tell us about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg text-sm font-medium hover:opacity-80 transition disabled:opacity-50"
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Change password */}
        <div className={cardClass}>
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            Change password
          </h2>
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                Current password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                  New password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                  Confirm
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            {confirmPassword && (
              <p
                className={`text-xs ${newPassword === confirmPassword ? "text-green-500" : "text-red-500"}`}
              >
                {newPassword === confirmPassword
                  ? "Passwords match"
                  : "Passwords do not match"}
              </p>
            )}
            <button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="w-fit px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg text-sm font-medium hover:opacity-80 transition disabled:opacity-50"
            >
              {changePasswordMutation.isPending
                ? "Updating..."
                : "Update password"}
            </button>
          </form>
        </div>

        {/* Notifications */}
        <div className={cardClass}>
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            Notifications
          </h2>
          <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
            {[
              {
                key: "email",
                label: "Email notifications",
                desc: "Receive updates about your posts",
              },
              {
                key: "marketing",
                label: "Marketing emails",
                desc: "Tips, product news and offers",
              },
              {
                key: "security",
                label: "Security alerts",
                desc: "Notify me of unusual sign-in activity",
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">
                    {item.label}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">{item.desc}</p>
                </div>
                <button
                  onClick={() =>
                    setNotifications((prev) => ({
                      ...prev,
                      [item.key]: !prev[item.key as keyof typeof prev],
                    }))
                  }
                  className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ${
                    notifications[item.key as keyof typeof notifications]
                      ? "bg-zinc-900 dark:bg-white"
                      : "bg-zinc-200 dark:bg-zinc-700"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full transition-all ${
                      notifications[item.key as keyof typeof notifications]
                        ? "left-5 bg-white dark:bg-zinc-900"
                        : "left-1 bg-white dark:bg-zinc-400"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Danger zone */}
        <div className={`${cardClass} border-red-200 dark:border-red-900/40`}>
          <h2 className="text-sm font-semibold text-red-500 mb-2 pb-3 border-b border-red-100 dark:border-red-900/30">
            Danger zone
          </h2>
          <p className="text-sm text-zinc-500 mb-4">
            Once you delete your account, all your data will be permanently
            removed. This cannot be undone.
          </p>
          <button className="px-5 py-2.5 border border-red-300 dark:border-red-800 text-red-500 rounded-lg text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition">
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
}
