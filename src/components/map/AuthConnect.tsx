"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Camera, Heart, LayoutDashboard, LogIn, UserRound, X } from "lucide-react";
import type { PublicUser } from "@/types/auth";

export function AuthConnect() {
  const [isOpen, setOpen] = useState(false);
  const [user, setUser] = useState<PublicUser | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((response) => response.json())
      .then((payload: { user: PublicUser | null }) => setUser(payload.user))
      .catch(() => setUser(null));
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="pointer-events-auto inline-flex h-12 items-center gap-2 rounded-lg border border-black/10 bg-white/78 px-3 text-sm font-semibold text-zinc-900 shadow-[0_18px_45px_rgba(15,23,42,0.18)] backdrop-blur-2xl transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_24px_60px_rgba(15,23,42,0.24)] dark:border-white/10 dark:bg-zinc-950/76 dark:text-zinc-100 dark:hover:bg-zinc-900/90"
      >
        <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-emerald-50 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-200">
          {user?.avatarUrl ? (
            <Image src={user.avatarUrl} alt="" fill sizes="32px" unoptimized className="object-cover" />
          ) : user ? (
            <UserRound size={17} />
          ) : (
            <LogIn size={17} />
          )}
        </span>
        <span className="hidden sm:inline">{user ? user.name.split(" ")[0] : "Connect"}</span>
      </button>

      {isOpen ? (
        <div className="pointer-events-auto absolute right-0 top-14 z-40 w-[min(92vw,340px)] rounded-lg border border-black/10 bg-white/92 p-4 text-zinc-900 shadow-[0_24px_70px_rgba(15,23,42,0.24)] backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-950/92 dark:text-zinc-50">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                Account
              </p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight">
                {user ? `Welcome, ${user.name.split(" ")[0]}` : "Sign in to contribute"}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Close account panel"
            >
              <X size={17} />
            </button>
          </div>

          <div className="mt-4 grid gap-2">
            {!user ? (
              <>
                <Link
                  href="/signin"
                  className="flex h-11 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                >
                  <LogIn size={17} />
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="flex h-11 items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white/70 px-4 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:hover:bg-white/10"
                >
                  <UserRound size={17} />
                  Create account
                </Link>
              </>
            ) : null}
            <Link
              href="/dashboard"
              className="flex h-11 items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200"
            >
              <LayoutDashboard size={17} />
              Dashboard
            </Link>
          </div>

          <div className="mt-4 grid gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-2 rounded-lg bg-zinc-50 p-3 dark:bg-white/5">
              <Camera size={17} className="text-emerald-700 dark:text-emerald-300" />
              Upload place images after signing in.
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-zinc-50 p-3 dark:bg-white/5">
              <Heart size={17} className="text-rose-600 dark:text-rose-300" />
              Your profile will track reviews, ratings, and reactions.
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
