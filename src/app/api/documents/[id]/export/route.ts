import TurndownService from "turndown";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canView, getDocumentAccess } from "@/lib/permissions";
import { handleRouteError } from "@/lib/api";

type Params = { params: { id: string } };

export async function GET(_request: Request, { params }: Params) {
  try {
    const user = await requireUser();
    const access = await getDocumentAccess(params.id, user.id);
    if (!canView(access)) throw new Error("NOT_FOUND");

    const document = await prisma.document.findUnique({ where: { id: params.id } });
    if (!document) throw new Error("NOT_FOUND");

    const turndown = new TurndownService({
      headingStyle: "atx",
      bulletListMarker: "-",
    });
    const markdown = `# ${document.title}\n\n${turndown.turndown(document.content || "")}\n`;
    const safeName = document.title.replace(/[^\w\-]+/g, "_").slice(0, 60) || "document";

    return new Response(markdown, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="${safeName}.md"`,
      },
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
