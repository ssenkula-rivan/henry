import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    const adminUsername = process.env.ADMIN_USERNAME || "hadmin";
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const cleanUser = typeof username === "string" ? username.trim() : "";
    const cleanPass = typeof password === "string" ? password.trim() : "";
    const cleanAdminUser = adminUsername.trim();
    const cleanAdminPass = adminPassword.trim();

    const isUserMatch = cleanUser.toLowerCase() === cleanAdminUser.toLowerCase();
    const isPassMatch =
      cleanPass === cleanAdminPass ||
      cleanPass === cleanAdminPass + "#" ||
      cleanPass + "#" === cleanAdminPass;

    if (isUserMatch && isPassMatch) {
      const sessionToken = Buffer.from(
        `${Date.now()}-${cleanUser}-${Math.random().toString(36).substring(2)}`
      ).toString("base64");

      const response = NextResponse.json({
        success: true,
        token: sessionToken,
        message: "Authentication successful"
      });

      response.cookies.set("admin_session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24,
        path: "/"
      });

      return response;
    }

    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
