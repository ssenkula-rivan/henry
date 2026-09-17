import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get("admin_session");
  
  if (!sessionCookie || !sessionCookie.value) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  // Token is valid if cookie exists and has content
  return NextResponse.json({
    authenticated: true,
    user: process.env.ADMIN_USERNAME || "hadmin"
  });
}
