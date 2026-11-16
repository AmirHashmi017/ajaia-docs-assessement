import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canEdit, canView, getDocumentAccess } from "@/lib/permissions";
import { handleRouteError, jsonOk } from "@/lib/api";

type Params = { params: { id: string } };

export async function GET(_request: Request, { params }: Params) {
  try {
    const user = await requireUser();
    const access = await getDocumentAccess(params.id, user.id);
    if (!canView(access)) throw new Error("NOT_FOUND");

    const versions = await prisma.documentVersion.findMany({
      where: { documentId: params.id },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { createdBy: { select: { id: true, name: true, email: true } } },
    });

    return jsonOk({ versions });
  } catch (error) {
    return handleRouteError(error);
  }
}

const restoreSchema = z.object({
  versionId: z.string().min(1),
});

export async function POST(request: Request, { params }: Params) {
  try {
    const user = await requireUser();
    const access = await getDocumentAccess(params.id, user.id);
    if (!canEdit(access)) {
      throw new Error(access ? "FORBIDDEN" : "NOT_FOUND");
    }

    const body = restoreSchema.parse(await request.json());
    const version = await prisma.documentVersion.findFirst({
      where: { id: body.versionId, documentId: params.id },
    });
    if (!version) throw new Error("NOT_FOUND");

    const document = await prisma.$transaction(async (tx) => {
      const updated = await tx.document.update({
        where: { id: params.id },
        data: {
          title: version.title,
          content: version.content,
        },
      });

      await tx.documentVersion.create({
        data: {
          documentId: params.id,
          title: version.title,
          content: version.content,
          createdById: user.id,
        },
      });

      return updated;
    });

    return jsonOk({ document });
  } catch (error) {
    return handleRouteError(error);
  }
}
