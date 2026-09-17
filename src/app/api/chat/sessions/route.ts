import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export interface ChatSession {
  id: string;
  visitorName: string;
  status: "waiting" | "active" | "ended";
  createdAt: string;
  lastActivity: string;
  unreadCount: number;
}

const SESSIONS_KEY = "henry_chat_sessions_v2";

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function getSessions(): Promise<ChatSession[]> {
  const redis = getRedis();
  if (!redis) return [];
  try {
    const data = await redis.get<ChatSession[]>(SESSIONS_KEY);
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

export async function saveSessions(sessions: ChatSession[]): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  try { await redis.set(SESSIONS_KEY, sessions); } catch {}
}

// GET all sessions (admin)
export async function GET() {
  const sessions = await getSessions();
  return NextResponse.json({ sessions });
}

// POST — create new session (visitor)
export async function POST(request: NextRequest) {
  const redis = getRedis();
  if (!redis) return NextResponse.json({ error: "Chat storage not configured." }, { status: 503 });

  try {
    const { visitorName } = await request.json();
    if (!visitorName?.trim()) {
      return NextResponse.json({ error: "Visitor name required" }, { status: 400 });
    }

    const sessionId = "sess_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 7);
    const now = new Date().toISOString();

    const newSession: ChatSession = {
      id: sessionId,
      visitorName: visitorName.trim(),
      status: "waiting",
      createdAt: now,
      lastActivity: now,
      unreadCount: 0,
    };

    const sessions = await getSessions();
    sessions.push(newSession);
    await saveSessions(sessions);

    return NextResponse.json({ success: true, session: newSession });
  } catch {
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}

// PATCH — update session status (admin accepts / ends)
export async function PATCH(request: NextRequest) {
  try {
    const { sessionId, status } = await request.json();
    const sessions = await getSessions();
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

    if (status === "active" || status === "ended" || status === "waiting") {
      session.status = status;
      session.lastActivity = new Date().toISOString();
    }
    await saveSessions(sessions);
    return NextResponse.json({ success: true, session });
  } catch {
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
  }
}

// DELETE — remove a session (admin clears ended chat)
export async function DELETE(request: NextRequest) {
  try {
    const { sessionId } = await request.json();
    const sessions = await getSessions();
    const filtered = sessions.filter((s) => s.id !== sessionId);
    await saveSessions(filtered);

    // Also clear messages for this session
    const redis = getRedis();
    if (redis) await redis.del(`henry_chat_msgs_${sessionId}`);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete session" }, { status: 500 });
  }
}
