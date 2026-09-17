import { NextResponse } from "next/server";
import { sendPushToAdmins } from "@/lib/push";

export async function POST() {
  try {
    const result = await sendPushToAdmins({
      title: "Support Console Test Alert",
      body: "Background push notifications are active! You will hear and receive alerts even if this tab is closed.",
      url: "/admin",
      tag: "test-alert",
    });

    return NextResponse.json({
      success: true,
      sent: result.sent,
      failed: result.failed,
      message: result.sent > 0 ? "Test alert sent to your device!" : "No active push devices registered.",
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error)?.message || "Failed to send test alert" }, { status: 500 });
  }
}
