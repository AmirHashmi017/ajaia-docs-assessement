import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleRouteError, jsonOk } from "@/lib/api";

const createSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  content: z.string().optional(),
});

export async function GET() {
  try {
    const user = await requireUser();

    const owned = await prisma.document.findMany({
      where: { ownerId: user.id },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        shares: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        _count: { select: { versions: true, files: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    const shared = await prisma.document.findMany({
      where: {
        shares: { some: { userId: user.id } },
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        shares: {
          where: { userId: user.id },
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        _count: { select: { versions: true, files: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return jsonOk({
      owned: owned.map((doc) => ({ ...doc, access: "owner" as const })),
      shared: shared.map((doc) => ({
        ...doc,
        access: (doc.shares[0]?.role ?? "viewer") as "editor" | "viewer",
      })),
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = createSchema.parse(await request.json());

    const document = await prisma.document.create({
      data: {
        title: body.title?.trim() || "Untitled document",
        content: body.content ?? "<p></p>",
        ownerId: user.id,
        versions: {
          create: {
            title: body.title?.trim() || "Untitled document",
            content: body.content ?? "<p></p>",
            createdById: user.id,
          },
        },
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
      },
    });

    return jsonOk({ document }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
