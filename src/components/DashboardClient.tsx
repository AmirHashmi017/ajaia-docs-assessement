"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { DocumentListItem, UserSummary } from "@/lib/types";
import { UPLOAD_HELP } from "@/lib/constants";

function formatDate(value: string) {
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function DocCard({
  doc,
  badge,
}: {
  doc: DocumentListItem;
  badge: string;
}) {
  return (
    <Link
      href={`/documents/${doc.id}`}
      className="block rounded-2xl border border-[var(--line)] bg-white p-4 transition hover:-translate-y-0.5 hover:border-[var(--accent)]/30 hover:shadow-md active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 flex-1 truncate font-semibold leading-snug">{doc.title}</h3>
        <span className="badge shrink-0 bg-[#e8f5f3] text-[var(--accent-strong)]">{badge}</span>
      </div>
      <p className="mt-2 text-xs text-[var(--ink-soft)]">
        Owner: {doc.owner.name}
        <span className="mx-1 opacity-50">·</span>
        Updated {formatDate(doc.updatedAt)}
      </p>
    </Link>
  );
}

export function DashboardClient({
  user,
  owned,
  shared,
}: {
  user: UserSummary;
  owned: DocumentListItem[];
  shared: DocumentListItem[];
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function createDocument() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Untitled document" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create document");
      router.push(`/documents/${data.document.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create document");
    } finally {
      setBusy(false);
    }
  }

  async function onImport(file: File) {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/documents/import", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import failed");
      setMessage(`Imported “${data.document.title}”. Opening editor...`);
      router.push(`/documents/${data.document.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-3 py-5 sm:space-y-8 sm:px-4 sm:py-8 md:px-6">
      <section className="panel p-4 sm:p-5 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm text-[var(--ink-soft)]">Signed in as {user.name}</p>
            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Your documents</h1>
            <p className="mt-2 max-w-2xl text-sm text-[var(--ink-soft)]">{UPLOAD_HELP}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <button
              className="btn btn-primary col-span-2 sm:col-auto"
              onClick={createDocument}
              disabled={busy}
            >
              New document
            </button>
            <button
              className="btn btn-secondary col-span-2 sm:col-auto"
              onClick={() => fileRef.current?.click()}
              disabled={busy}
            >
              Import file
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".txt,.md,.docx,text/plain,text/markdown,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void onImport(file);
              }}
            />
          </div>
        </div>
        {message && <p className="mt-3 text-sm text-[var(--accent-strong)]">{message}</p>}
        {error && <p className="mt-3 text-sm text-[var(--danger)]">{error}</p>}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold sm:text-xl">Owned by you</h2>
          <span className="badge bg-white border border-[var(--line)]">{owned.length}</span>
        </div>
        {owned.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[var(--line)] bg-white/60 p-5 text-sm text-[var(--ink-soft)] sm:p-6">
            No owned documents yet. Create one or import a file.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {owned.map((doc) => (
              <DocCard key={doc.id} doc={doc} badge="Owner" />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold sm:text-xl">Shared with you</h2>
          <span className="badge bg-white border border-[var(--line)]">{shared.length}</span>
        </div>
        {shared.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[var(--line)] bg-white/60 p-5 text-sm text-[var(--ink-soft)] sm:p-6">
            Nothing shared yet. Ask Alice to share the Welcome doc, or share one of yours.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {shared.map((doc) => (
              <DocCard
                key={doc.id}
                doc={doc}
                badge={doc.access === "editor" ? "Editor" : "Viewer"}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
