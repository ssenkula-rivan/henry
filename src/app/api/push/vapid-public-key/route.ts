import { NextResponse } from "next/server";
import { getVapidKeys } from "@/lib/push";

export async function GET() {
  try {
    const keys = await getVapidKeys();
    if (!keys?.publicKey) {
      return NextResponse.json({ error: "Push service not configured" }, { status: 503 });
    }
    return NextResponse.json({ publicKey: keys.publicKey });
  } catch {
    return NextResponse.json({ error: "Failed to load public key" }, { status: 500 });
  }
}
