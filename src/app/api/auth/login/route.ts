import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  createSessionToken,
  setSessionCookie,
  verifyPassword,
} from "@/lib/auth";
import { handleRouteError, jsonError, jsonOk } from "@/lib/api";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const user = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } });

    if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
      return jsonError("Invalid email or password", 401);
    }

    const token = await createSessionToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });
    await setSessionCookie(token);

    return jsonOk({
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
