import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { getSessions, saveSessions } from "@/app/api/chat/sessions/route";

export interface ChatMessage {
  id: string;
  text: string;
  sender: "client" | "owner";
  senderName: string;
  timestamp: string;
  read: boolean;
}

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function msgKey(sessionId: string) {
  return `henry_chat_msgs_${sessionId}`;
}

async function loadMessages(sessionId: string): Promise<ChatMessage[]> {
  const redis = getRedis();
  if (!redis) return [];
  try {
    const data = await redis.get<ChatMessage[]>(msgKey(sessionId));
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

async function saveMessages(sessionId: string, messages: ChatMessage[]): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  try { await redis.set(msgKey(sessionId), messages); } catch {}
}

// GET /api/chat/messages?sessionId=xxx
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  const messages = await loadMessages(sessionId);
  const unreadCount = messages.filter((m) => !m.read && m.sender === "client").length;
  return NextResponse.json({ messages, unreadCount });
}

// POST — send a message to a session
export async function POST(request: NextRequest) {
  const redis = getRedis();
  if (!redis) return NextResponse.json({ error: "Chat not configured." }, { status: 503 });

  try {
    const body = await request.json();
    const { sessionId, text, sender = "client", senderName } = body;

    if (!sessionId) return NextResponse.json({ error: "sessionId required" }, { status: 400 });
    if (!text?.trim()) return NextResponse.json({ error: "text required" }, { status: 400 });

    const messages = await loadMessages(sessionId);
    const newMsg: ChatMessage = {
      id: Date.now().toString() + "-" + Math.random().toString(36).substring(2, 6),
      text: text.trim(),
      sender: sender === "owner" ? "owner" : "client",
      senderName: senderName || (sender === "owner" ? "Henry Mbalire" : "Visitor"),
      timestamp: new Date().toISOString(),
      read: sender === "owner",
    };
    messages.push(newMsg);
    await saveMessages(sessionId, messages);

    // Update session lastActivity and unreadCount
    const sessions = await getSessions();
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      session.lastActivity = newMsg.timestamp;
      session.unreadCount = messages.filter((m) => !m.read && m.sender === "client").length;
      await saveSessions(sessions);
    }

    return NextResponse.json({ success: true, message: newMsg });
  } catch {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

// PATCH — mark messages as read
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, action } = body;

    if (!sessionId) return NextResponse.json({ error: "sessionId required" }, { status: 400 });

    const messages = await loadMessages(sessionId);
    if (action === "mark_all_read") {
      messages.forEach((m) => { m.read = true; });
    }
    await saveMessages(sessionId, messages);

    // Update session unreadCount to 0
    const sessions = await getSessions();
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      session.unreadCount = 0;
      await saveSessions(sessions);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
