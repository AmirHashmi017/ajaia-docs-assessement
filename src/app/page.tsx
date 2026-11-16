import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { LoginForm } from "@/components/LoginForm";

export default async function HomePage() {
  const user = await getSessionUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen px-3 py-8 sm:px-6 sm:py-10 md:px-8">
      <div className="mx-auto flex min-h-[80vh] max-w-6xl flex-col items-center justify-center gap-8 lg:flex-row lg:items-center lg:gap-12">
        <section className="hidden max-w-xl space-y-4 lg:block lg:flex-1">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
            Ajaia assignment
          </p>
          <h1 className="text-4xl font-semibold leading-tight xl:text-5xl">
            A focused Docs slice: create, edit, import, share, ship.
          </h1>
          <p className="text-base text-[var(--ink-soft)] md:text-lg">
            Built as a practical product cut of a collaborative editor — rich text, file import,
            role-based sharing, persistence, version history, and Markdown export.
          </p>
          <ul className="space-y-2 text-sm text-[var(--ink-soft)]">
            <li>• TipTap rich-text editor with headings and lists</li>
            <li>• Import .txt / .md / .docx into editable documents</li>
            <li>• Owner / editor / viewer sharing model</li>
            <li>• Stretch: version history + Markdown export</li>
          </ul>
        </section>
        <LoginForm />
      </div>
    </main>
  );
}
