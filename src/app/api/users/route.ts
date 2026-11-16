import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleRouteError, jsonOk } from "@/lib/api";

export async function GET() {
  try {
    await requireUser();
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true },
      orderBy: { name: "asc" },
    });
    return jsonOk({ users });
  } catch (error) {
    return handleRouteError(error);
  }
}
