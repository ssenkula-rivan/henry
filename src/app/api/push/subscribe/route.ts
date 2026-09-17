import { NextRequest, NextResponse } from "next/server";
import { savePushSubscription } from "@/lib/push";

export async function POST(request: NextRequest) {
  try {
    const { subscription } = await request.json();
    if (!subscription?.endpoint) {
      return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
    }

    const ok = await savePushSubscription(subscription);
    if (!ok) {
      return NextResponse.json({ error: "Failed to store subscription" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Subscription request failed" }, { status: 500 });
  }
}
