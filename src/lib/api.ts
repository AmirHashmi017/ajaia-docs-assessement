import { NextResponse } from "next/server";
import { AuthError } from "./auth";
import { ZodError } from "zod";

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function handleRouteError(error: unknown) {
  if (error instanceof AuthError) {
    return jsonError(error.message, error.status);
  }
  if (error instanceof ZodError) {
    return jsonError(error.issues[0]?.message ?? "Invalid request", 400);
  }
  if (error instanceof Error && error.message === "FORBIDDEN") {
    return jsonError("Forbidden", 403);
  }
  if (error instanceof Error && error.message === "NOT_FOUND") {
    return jsonError("Not found", 404);
  }
  console.error(error);
  return jsonError("Internal server error", 500);
}
