import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppHeader } from "@/components/AppHeader";
import { DashboardClient } from "@/components/DashboardClient";
import type { DocumentListItem } from "@/lib/types";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/");

  const ownedRaw = await prisma.document.findMany({
    where: { ownerId: user.id },
    include: { owner: { select: { id: true, name: true, email: true } } },
    orderBy: { updatedAt: "desc" },
  });

  const sharedRaw = await prisma.document.findMany({
    where: { shares: { some: { userId: user.id } } },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      shares: { where: { userId: user.id } },
    },
    orderBy: { updatedAt: "desc" },
  });

  const owned: DocumentListItem[] = ownedRaw.map((doc) => ({
    id: doc.id,
    title: doc.title,
    updatedAt: doc.updatedAt.toISOString(),
    createdAt: doc.createdAt.toISOString(),
    owner: doc.owner,
    access: "owner",
  }));

  const shared: DocumentListItem[] = sharedRaw.map((doc) => ({
    id: doc.id,
    title: doc.title,
    updatedAt: doc.updatedAt.toISOString(),
    createdAt: doc.createdAt.toISOString(),
    owner: doc.owner,
    access: (doc.shares[0]?.role as "editor" | "viewer") || "viewer",
  }));

  return (
    <div className="min-h-screen">
      <AppHeader user={user} />
      <DashboardClient user={user} owned={owned} shared={shared} />
    </div>
  );
}
