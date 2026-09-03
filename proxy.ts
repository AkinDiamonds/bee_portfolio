import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const username = process.env.ADMIN_BASIC_AUTH_USERNAME;
  const password = process.env.ADMIN_BASIC_AUTH_PASSWORD;
  const authorization = request.headers.get("authorization");
  const expected = username && password ? `Basic ${btoa(`${username}:${password}`)}` : "";

  if (!expected || authorization !== expected) {
    return new NextResponse("Authentication required", { status: 401, headers: { "WWW-Authenticate": 'Basic realm="Portfolio admin"' } });
  }
  return NextResponse.next();
}

export const config = { matcher: "/admin/:path*" };
