import { prisma } from "./prisma";

export type AccessRole = "owner" | "editor" | "viewer" | null;

export async function getDocumentAccess(documentId: string, userId: string): Promise<AccessRole> {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    include: {
      shares: {
        where: { userId },
        take: 1,
      },
    },
  });

  if (!document) return null;
  if (document.ownerId === userId) return "owner";
  if (document.shares[0]?.role === "editor") return "editor";
  if (document.shares[0]?.role === "viewer") return "viewer";
  return null;
}

export function canEdit(role: AccessRole) {
  return role === "owner" || role === "editor";
}

export function canManageSharing(role: AccessRole) {
  return role === "owner";
}

export function canView(role: AccessRole) {
  return role === "owner" || role === "editor" || role === "viewer";
}
