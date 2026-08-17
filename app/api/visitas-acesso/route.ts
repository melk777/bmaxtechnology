import { NextResponse } from "next/server";
import { createVisitSessionToken, validAccessCode } from "@/lib/visits-access";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const code = typeof body.code === "string" ? body.code : "";

  if (!(await validAccessCode(code))) {
    return NextResponse.json({ error: "Código inválido." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: "bmax_visits_session",
    value: await createVisitSessionToken(),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}
