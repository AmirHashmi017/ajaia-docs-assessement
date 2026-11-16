import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canEdit, canView, getDocumentAccess } from "@/lib/permissions";
import { handleRouteError, jsonOk } from "@/lib/api";

const updateSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  content: z.string().optional(),
  createVersion: z.boolean().optional(),
});

type Params = { params: { id: string } };

export async function GET(_request: Request, { params }: Params) {
  try {
    const user = await requireUser();
    const access = await getDocumentAccess(params.id, user.id);
    if (!canView(access)) {
      throw new Error("NOT_FOUND");
    }

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

    if (!document) throw new Error("NOT_FOUND");

    return jsonOk({ document, access });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const user = await requireUser();
    const access = await getDocumentAccess(params.id, user.id);
    if (!canEdit(access)) {
      throw new Error(access ? "FORBIDDEN" : "NOT_FOUND");
    }

    const body = updateSchema.parse(await request.json());
    if (!body.title && body.content === undefined) {
      throw new Error("No changes provided");
    }

    const existing = await prisma.document.findUnique({ where: { id: params.id } });
    if (!existing) throw new Error("NOT_FOUND");

    const nextTitle = body.title ?? existing.title;
    const nextContent = body.content ?? existing.content;

    const document = await prisma.$transaction(async (tx) => {
      // Autosave updates the live document only. Explicit checkpoints use createVersion.
      if (body.createVersion) {
        await tx.documentVersion.create({
          data: {
            documentId: params.id,
            title: nextTitle,
            content: nextContent,
            createdById: user.id,
          },
        });
      }

      return tx.document.update({
        where: { id: params.id },
        data: {
          title: nextTitle,
          content: nextContent,
        },
        include: {
          owner: { select: { id: true, name: true, email: true } },
          shares: {
            include: { user: { select: { id: true, name: true, email: true } } },
          },
          files: true,
          versions: {
            orderBy: { createdAt: "desc" },
            take: 20,
            include: { createdBy: { select: { id: true, name: true, email: true } } },
          },
        },
      });
    });

    return jsonOk({ document, access });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const user = await requireUser();
    const access = await getDocumentAccess(params.id, user.id);
    if (access !== "owner") {
      throw new Error(access ? "FORBIDDEN" : "NOT_FOUND");
    }

    // MongoDB has no FK cascades — remove dependents explicitly.
    await prisma.$transaction([
      prisma.attachment.deleteMany({ where: { documentId: params.id } }),
      prisma.documentVersion.deleteMany({ where: { documentId: params.id } }),
      prisma.documentShare.deleteMany({ where: { documentId: params.id } }),
      prisma.document.delete({ where: { id: params.id } }),
    ]);
    return jsonOk({ ok: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
