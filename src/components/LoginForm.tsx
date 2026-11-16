"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "./Spinner";

const DEMO_USERS = [
  { email: "alice@ajaia.dev", label: "Alice (owner)" },
  { email: "bob@ajaia.dev", label: "Bob (editor)" },
  { email: "cara@ajaia.dev", label: "Cara (viewer)" },
];

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("alice@ajaia.dev");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const busy = loading || isPending;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }
      startTransition(() => {
        router.push("/dashboard");
        router.refresh();
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="panel w-full max-w-md space-y-4 p-5 sm:p-6"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)] lg:hidden">
          Ajaia assignment
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Ajaia Docs</h1>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          Collaborative editing with sharing, imports, version history, and Markdown export.
        </p>
      </div>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium">Email</span>
        <input
          className="input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium">Password</span>
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </label>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-[var(--danger)]">{error}</p>
      )}

      <button className="btn btn-primary w-full" type="submit" disabled={busy}>
        {busy ? (
          <>
            <Spinner /> {isPending ? "Opening dashboard..." : "Signing in..."}
          </>
        ) : (
          "Sign in"
        )}
      </button>

      <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)]">
          Seeded demo accounts
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {DEMO_USERS.map((user) => (
            <button
              key={user.email}
              type="button"
              className="badge border border-[var(--line)] bg-white"
              onClick={() => {
                setEmail(user.email);
                setPassword("password123");
              }}
            >
              {user.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-[var(--ink-soft)]">Password for all: password123</p>
      </div>
    </form>
  );
}
