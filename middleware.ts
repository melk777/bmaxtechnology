import { NextRequest, NextResponse } from "next/server";
import { validVisitSession } from "@/lib/visits-access";

export async function middleware(request: NextRequest) {
  if (!(await validVisitSession(request.cookies.get("bmax_visits_session")?.value))) {
    const loginUrl = new URL("/acesso-visitas", request.url);
    loginUrl.searchParams.set("return_to", "/visitas");
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/visitas/:path*"] };
