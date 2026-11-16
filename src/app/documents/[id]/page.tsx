import { redirect, notFound } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canView, getDocumentAccess } from "@/lib/permissions";
import { AppHeader } from "@/components/AppHeader";
import { DocumentEditor } from "@/components/DocumentEditor";
import type { AccessRole, DocumentDetail } from "@/lib/types";

type Params = { params: { id: string } };

export default async function DocumentPage({ params }: Params) {
  const user = await getSessionUser();
  if (!user) redirect("/");

  const access = await getDocumentAccess(params.id, user.id);
  if (!canView(access) || !access) notFound();

  const document = await prisma.document.findUnique({
    where: { id: params.id },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      shares: {
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "asc" },
      },
      files: { orderBy: { createdAt: "desc" } },
      versions: {
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { createdBy: { select: { id: true, name: true, email: true } } },
      },
    },
  });

  if (!document) notFound();

  const directoryUsers = await prisma.user.findMany({
    select: { id: true, email: true, name: true },
    orderBy: { name: "asc" },
  });

  const initialDocument: DocumentDetail = {
    id: document.id,
    title: document.title,
    content: document.content,
    updatedAt: document.updatedAt.toISOString(),
    createdAt: document.createdAt.toISOString(),
    owner: document.owner,
    shares: document.shares.map((share) => ({
      id: share.id,
      role: share.role as "viewer" | "editor",
      user: share.user,
    })),
    versions: document.versions.map((version) => ({
      id: version.id,
      title: version.title,
      content: version.content,
      createdAt: version.createdAt.toISOString(),
      createdBy: version.createdBy,
    })),
    files: document.files.map((file) => ({
      id: file.id,
      fileName: file.fileName,
      mimeType: file.mimeType,
      sizeBytes: file.sizeBytes,
      createdAt: file.createdAt.toISOString(),
    })),
  };

  return (
    <div className="min-h-screen pb-10">
      <AppHeader user={user} />
      <DocumentEditor
        initialDocument={initialDocument}
        access={access as AccessRole}
        currentUser={user}
        directoryUsers={directoryUsers}
      />
    </div>
  );
}
