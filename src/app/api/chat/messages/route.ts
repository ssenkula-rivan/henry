import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export interface ChatMessage {
  id: string;
  text: string;
  sender: "client" | "owner";
  senderName?: string;
  timestamp: string;
  read: boolean;
}

const CHAT_KEY = "henry_portfolio_chat_messages";

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

async function loadMessages(): Promise<ChatMessage[]> {
  const redis = getRedis();
  if (!redis) return [];
  try {
    const data = await redis.get<ChatMessage[]>(CHAT_KEY);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error("Redis read error:", e);
    return [];
  }
}

async function saveMessages(messages: ChatMessage[]): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  try {
    await redis.set(CHAT_KEY, messages);
  } catch (e) {
    console.error("Redis write error:", e);
  }
}

export async function GET() {
  if (!getRedis()) {
    return NextResponse.json(
      { error: "Chat storage not configured.", messages: [], unreadCount: 0 },
      { status: 200 }
    );
  }
  const messages = await loadMessages();
  const unreadCount = messages.filter((m) => !m.read && m.sender === "client").length;
  return NextResponse.json({ messages, unreadCount });
}

export async function POST(request: NextRequest) {
  if (!getRedis()) {
    return NextResponse.json({ error: "Chat storage not configured. Admin must add UPSTASH_REDIS environment variables to Vercel." }, { status: 503 });
  }
  try {
    const body = await request.json();
    const { text, sender = "client", senderName } = body;
    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "Message text is required" }, { status: 400 });
    }
    const messages = await loadMessages();
    const newMessage: ChatMessage = {
      id: Date.now().toString() + "-" + Math.random().toString(36).substring(2, 6),
      text: text.trim(),
      sender: sender === "owner" ? "owner" : "client",
      senderName: senderName || (sender === "owner" ? "Henry Mbalire" : "Visitor"),
      timestamp: new Date().toISOString(),
      read: sender === "owner",
    };
    messages.push(newMessage);
    await saveMessages(messages);
    const unreadCount = messages.filter((m) => !m.read && m.sender === "client").length;
    return NextResponse.json({ success: true, message: newMessage, unreadCount });
  } catch (e) {
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!getRedis()) {
    return NextResponse.json({ error: "Chat storage not configured." }, { status: 503 });
  }
  try {
    const body = await request.json();
    const { id, action } = body;
    const messages = await loadMessages();
    if (action === "mark_all_read") {
      messages.forEach((m) => { m.read = true; });
    } else if (id) {
      const target = messages.find((m) => m.id === id);
      if (target) target.read = true;
    }
    await saveMessages(messages);
    const unreadCount = messages.filter((m) => !m.read && m.sender === "client").length;
    return NextResponse.json({ success: true, unreadCount });
  } catch (e) {
    return NextResponse.json({ error: "Failed to update messages" }, { status: 500 });
  }
}

export async function DELETE() {
  if (!getRedis()) {
    return NextResponse.json({ error: "Chat storage not configured." }, { status: 503 });
  }
  try {
    await saveMessages([]);
    return NextResponse.json({ success: true, messages: [], unreadCount: 0 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to clear messages" }, { status: 500 });
  }
}
