import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageSharing, getDocumentAccess } from "@/lib/permissions";
import { handleRouteError, jsonError, jsonOk } from "@/lib/api";

const shareSchema = z.object({
  email: z.string().email(),
  role: z.enum(["viewer", "editor"]),
});

const unshareSchema = z.object({
  userId: z.string().min(1),
});

type Params = { params: { id: string } };

export async function POST(request: Request, { params }: Params) {
  try {
    const user = await requireUser();
    const access = await getDocumentAccess(params.id, user.id);
    if (!canManageSharing(access)) {
      throw new Error(access ? "FORBIDDEN" : "NOT_FOUND");
    }

    const body = shareSchema.parse(await request.json());
    const target = await prisma.user.findUnique({
      where: { email: body.email.toLowerCase() },
    });

    if (!target) {
      return jsonError("No user found with that email. Use a seeded account.", 404);
    }

    if (target.id === user.id) {
      return jsonError("You already own this document.", 400);
    }

    const share = await prisma.documentShare.upsert({
      where: {
        documentId_userId: {
          documentId: params.id,
          userId: target.id,
        },
      },
      create: {
        documentId: params.id,
        userId: target.id,
        role: body.role,
      },
      update: { role: body.role },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    return jsonOk({ share });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const user = await requireUser();
    const access = await getDocumentAccess(params.id, user.id);
    if (!canManageSharing(access)) {
      throw new Error(access ? "FORBIDDEN" : "NOT_FOUND");
    }

    const body = unshareSchema.parse(await request.json());
    await prisma.documentShare.deleteMany({
      where: { documentId: params.id, userId: body.userId },
    });

    return jsonOk({ ok: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
