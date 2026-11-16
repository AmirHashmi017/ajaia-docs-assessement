import { Spinner } from "./Spinner";

export function PageLoading({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4">
      <div className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-white px-5 py-4 shadow-sm">
        <Spinner className="h-5 w-5 text-[var(--accent)]" />
        <p className="text-sm font-medium text-[var(--ink)]">{label}</p>
      </div>
    </div>
  );
}
