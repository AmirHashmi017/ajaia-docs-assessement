"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { UserSummary } from "@/lib/types";

export function AppHeader({ user }: { user: UserSummary }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(255,253,249,0.92)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-3 sm:px-4 md:px-6">
        <Link
          href="/dashboard"
          className="brand-font text-lg font-semibold tracking-tight sm:text-xl"
        >
          Ajaia Docs
        </Link>
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="min-w-0 text-right">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="hidden truncate text-xs text-[var(--ink-soft)] xs:block sm:block">
              {user.email}
            </p>
          </div>
          <button className="btn btn-secondary shrink-0 px-3 py-1.5 text-xs sm:text-sm" onClick={logout} type="button">
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
