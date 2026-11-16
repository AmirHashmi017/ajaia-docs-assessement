"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { RichTextEditor } from "./RichTextEditor";
import { ConfirmModal } from "./ConfirmModal";
import type {
  AccessRole,
  DocumentDetail,
  ShareRole,
  UserSummary,
} from "@/lib/types";

export function DocumentEditor({
  initialDocument,
  access,
  currentUser,
  directoryUsers,
}: {
  initialDocument: DocumentDetail;
  access: AccessRole;
  currentUser: UserSummary;
  directoryUsers: UserSummary[];
}) {
  const router = useRouter();
  const canEdit = access === "owner" || access === "editor";
  const canShare = access === "owner";

  const [title, setTitle] = useState(initialDocument.title);
  const [content, setContent] = useState(initialDocument.content);
  const [document, setDocument] = useState(initialDocument);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [shareEmail, setShareEmail] = useState("bob@ajaia.dev");
  const [shareRole, setShareRole] = useState<ShareRole>("editor");
  const [busyAction, setBusyAction] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<"share" | "versions" | "files">("share");

  const dirty = useMemo(
    () => title !== document.title || content !== document.content,
    [title, content, document.title, document.content]
  );

  useEffect(() => {
    if (!canEdit || !dirty) return;
    const timer = setTimeout(() => {
      void save({ silent: true });
    }, 1200);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, canEdit, dirty]);

  async function save(options?: { silent?: boolean; createVersion?: boolean }) {
    if (!canEdit) return;
    setStatus("saving");
    if (!options?.silent) setMessage(null);

    try {
      const res = await fetch(`/api/documents/${document.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          createVersion: options?.createVersion ?? false,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setDocument(data.document);
      setTitle(data.document.title);
      setContent(data.document.content);
      setStatus("saved");
      if (!options?.silent) setMessage("Saved.");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Save failed");
    }
  }

  async function shareDocument() {
    setBusyAction(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/documents/${document.id}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: shareEmail, role: shareRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Share failed");

      setDocument((prev) => {
        const others = prev.shares.filter((s) => s.user.id !== data.share.user.id);
        return { ...prev, shares: [...others, data.share] };
      });
      setMessage(`Shared with ${data.share.user.name} as ${data.share.role}.`);
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Share failed");
    } finally {
      setBusyAction(false);
    }
  }

  async function removeShare(userId: string) {
    setBusyAction(true);
    try {
      const res = await fetch(`/api/documents/${document.id}/share`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not remove access");
      setDocument((prev) => ({
        ...prev,
        shares: prev.shares.filter((s) => s.user.id !== userId),
      }));
      setMessage("Access removed.");
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not remove access");
    } finally {
      setBusyAction(false);
    }
  }

  async function restoreVersion(versionId: string) {
    if (!canEdit) return;
    setBusyAction(true);
    try {
      const res = await fetch(`/api/documents/${document.id}/versions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Restore failed");
      setTitle(data.document.title);
      setContent(data.document.content);
      setDocument((prev) => ({
        ...prev,
        title: data.document.title,
        content: data.document.content,
      }));
      setMessage("Version restored.");
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Restore failed");
    } finally {
      setBusyAction(false);
    }
  }

  async function confirmDelete() {
    setBusyAction(true);
    try {
      const res = await fetch(`/api/documents/${document.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setDeleteOpen(false);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Delete failed");
      setBusyAction(false);
      setDeleteOpen(false);
    }
  }

  const sharePanel = (
    <div className="panel p-4 sm:p-5">
      <h2 className="font-semibold">Sharing</h2>
      <p className="mt-1 text-xs text-[var(--ink-soft)]">
        Owners manage access. Editors can edit. Viewers are read-only.
      </p>

      <ul className="mt-3 space-y-2">
        <li className="rounded-lg bg-[var(--surface-muted)] px-3 py-2.5 text-sm">
          <span className="font-medium">{document.owner.name}</span>
          <span className="ml-2 text-xs text-[var(--ink-soft)]">owner</span>
        </li>
        {document.shares.map((share) => (
          <li
            key={share.id}
            className="flex items-center justify-between gap-2 rounded-lg border border-[var(--line)] px-3 py-2.5 text-sm"
          >
            <div className="min-w-0">
              <p className="truncate font-medium">{share.user.name}</p>
              <p className="truncate text-xs text-[var(--ink-soft)]">
                {share.user.email} · {share.role}
              </p>
            </div>
            {canShare && (
              <button
                className="shrink-0 text-xs font-medium text-[var(--danger)]"
                onClick={() => void removeShare(share.user.id)}
                disabled={busyAction}
              >
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>

      {canShare && (
        <div className="mt-3 space-y-2">
          <select
            className="input"
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
          >
            {directoryUsers
              .filter((u) => u.id !== currentUser.id)
              .map((u) => (
                <option key={u.id} value={u.email}>
                  {u.name} ({u.email})
                </option>
              ))}
          </select>
          <select
            className="input"
            value={shareRole}
            onChange={(e) => setShareRole(e.target.value as ShareRole)}
          >
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
          <button
            className="btn btn-primary w-full"
            onClick={() => void shareDocument()}
            disabled={busyAction}
          >
            Share document
          </button>
        </div>
      )}
    </div>
  );

  const versionsPanel = (
    <div className="panel p-4 sm:p-5">
      <h2 className="font-semibold">Version history</h2>
      <p className="mt-1 text-xs text-[var(--ink-soft)]">
        Autosave updates the live doc. Use “Save version” for checkpoints.
      </p>
      <ul className="mt-3 max-h-64 space-y-2 overflow-auto sm:max-h-72">
        {document.versions.length === 0 && (
          <li className="text-sm text-[var(--ink-soft)]">No versions yet.</li>
        )}
        {document.versions.map((version) => (
          <li key={version.id} className="rounded-lg border border-[var(--line)] px-3 py-2.5">
            <p className="truncate text-sm font-medium">{version.title}</p>
            <p className="text-xs text-[var(--ink-soft)]">
              {new Date(version.createdAt).toLocaleString()} · {version.createdBy.name}
            </p>
            {canEdit && (
              <button
                className="mt-1 text-xs font-medium text-[var(--accent-strong)]"
                onClick={() => void restoreVersion(version.id)}
                disabled={busyAction}
              >
                Restore
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  const filesPanel =
    document.files.length > 0 ? (
      <div className="panel p-4 sm:p-5">
        <h2 className="font-semibold">Imported source</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {document.files.map((file) => (
            <li key={file.id} className="truncate text-[var(--ink-soft)]">
              {file.fileName} ({Math.round(file.sizeBytes / 1024)} KB)
            </li>
          ))}
        </ul>
      </div>
    ) : null;

  return (
    <>
      <div className="mx-auto grid max-w-6xl gap-4 px-3 py-4 sm:gap-5 sm:px-4 sm:py-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-6">
        <section className="panel overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-[var(--line)] px-3 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-4">
            <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
              <Link
                href="/dashboard"
                className="text-sm text-[var(--ink-soft)] hover:text-[var(--ink)] hover:underline"
              >
                ← Docs
              </Link>
              <span className="badge bg-[#e8f5f3] text-[var(--accent-strong)] capitalize">
                {access}
              </span>
              <span className="text-xs text-[var(--ink-soft)]">
                {status === "saving" && "Saving..."}
                {status === "saved" && !dirty && "Saved"}
                {dirty && status !== "saving" && "Unsaved changes"}
                {!canEdit && "Read only"}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {canEdit && (
                <>
                  <button
                    className="btn btn-secondary flex-1 sm:flex-none"
                    onClick={() => void save()}
                    disabled={busyAction}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-secondary flex-1 sm:flex-none"
                    onClick={() => void save({ createVersion: true })}
                    disabled={busyAction}
                  >
                    Save version
                  </button>
                </>
              )}
              <a
                className="btn btn-secondary flex-1 sm:flex-none"
                href={`/api/documents/${document.id}/export`}
              >
                Export MD
              </a>
              {access === "owner" && (
                <button
                  className="btn btn-danger flex-1 sm:flex-none"
                  onClick={() => setDeleteOpen(true)}
                  disabled={busyAction}
                >
                  Delete
                </button>
              )}
            </div>
          </div>

          <div className="border-b border-[var(--line)] px-3 py-3 sm:px-4">
            <input
              className="w-full bg-transparent text-xl font-semibold outline-none placeholder:text-[#b0a89c] sm:text-2xl"
              value={title}
              disabled={!canEdit}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Document title"
            />
            <p className="mt-1 text-xs text-[var(--ink-soft)]">
              Owner: {document.owner.name} · Signed in as {currentUser.name}
            </p>
          </div>

          <RichTextEditor content={content} editable={canEdit} onChange={setContent} />
          {message && (
            <p className="border-t border-[var(--line)] px-3 py-3 text-sm text-[var(--ink-soft)] sm:px-4">
              {message}
            </p>
          )}
        </section>

        {/* Mobile tabs */}
        <div className="lg:hidden">
          <div className="mb-3 flex gap-1 rounded-xl border border-[var(--line)] bg-white p-1">
            {(
              [
                ["share", "Sharing"],
                ["versions", "Versions"],
                ...(document.files.length > 0 ? ([["files", "Files"]] as const) : []),
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  mobileTab === id
                    ? "bg-[var(--accent)] text-white"
                    : "text-[var(--ink-soft)] hover:bg-[var(--surface-muted)]"
                }`}
                onClick={() => setMobileTab(id)}
              >
                {label}
              </button>
            ))}
          </div>
          {mobileTab === "share" && sharePanel}
          {mobileTab === "versions" && versionsPanel}
          {mobileTab === "files" && filesPanel}
        </div>

        {/* Desktop sidebar */}
        <aside className="hidden space-y-4 lg:block">
          {sharePanel}
          {versionsPanel}
          {filesPanel}
        </aside>
      </div>

      <ConfirmModal
        open={deleteOpen}
        title="Delete this document?"
        description="This permanently removes the document, shares, versions, and imported files. This cannot be undone."
        confirmLabel="Delete document"
        cancelLabel="Keep document"
        danger
        busy={busyAction}
        onCancel={() => {
          if (!busyAction) setDeleteOpen(false);
        }}
        onConfirm={() => void confirmDelete()}
      />
    </>
  );
}
