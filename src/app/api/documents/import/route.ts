import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fileToHtml, isAllowedUpload, UPLOAD_HELP } from "@/lib/import-file";
import { handleRouteError, jsonError, jsonOk } from "@/lib/api";

const MAX_BYTES = 2 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return jsonError("A file is required.", 400);
    }

    if (file.size > MAX_BYTES) {
      return jsonError("File exceeds 2MB limit.", 400);
    }

    if (!isAllowedUpload(file.name, file.type)) {
      return jsonError(UPLOAD_HELP, 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const html = await fileToHtml(file.name, buffer);
    const title = file.name.replace(/\.[^.]+$/, "") || "Imported document";

    const uploadsDir = path.join(process.cwd(), "uploads");
    await mkdir(uploadsDir, { recursive: true });
    const storedName = `${Date.now()}-${file.name.replace(/[^\w.\-]+/g, "_")}`;
    const storagePath = path.join(uploadsDir, storedName);
    await writeFile(storagePath, buffer);

    const document = await prisma.document.create({
      data: {
        title,
        content: html,
        ownerId: user.id,
        versions: {
          create: {
            title,
            content: html,
            createdById: user.id,
          },
        },
        files: {
          create: {
            fileName: file.name,
            mimeType: file.type || "application/octet-stream",
            sizeBytes: file.size,
            storagePath: `uploads/${storedName}`,
          },
        },
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        files: true,
      },
    });

    return jsonOk({ document, notice: UPLOAD_HELP }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
