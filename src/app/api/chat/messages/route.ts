import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export interface ChatMessage {
  id: string;
  text: string;
  sender: "client" | "owner";
  senderName?: string;
  timestamp: string;
  read: boolean;
}

const DATA_FILE = path.join(process.cwd(), ".chat_history.json");

function loadMessages(): ChatMessage[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading chat file:", e);
  }
  return [];
}

function saveMessages(messages: ChatMessage[]) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing chat file:", e);
  }
}

export async function GET() {
  const messages = loadMessages();
  const unreadCount = messages.filter((m) => !m.read && m.sender === "client").length;
  return NextResponse.json({ messages, unreadCount });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, sender = "client", senderName } = body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "Message text is required" }, { status: 400 });
    }

    const messages = loadMessages();
    const newMessage: ChatMessage = {
      id: Date.now().toString() + "-" + Math.random().toString(36).substring(2, 6),
      text: text.trim(),
      sender: sender === "owner" ? "owner" : "client",
      senderName: senderName || (sender === "owner" ? "Henry (Owner)" : "Client"),
      timestamp: new Date().toISOString(),
      read: sender === "owner" // owner replies are automatically read
    };

    messages.push(newMessage);
    saveMessages(messages);

    const unreadCount = messages.filter((m) => !m.read && m.sender === "client").length;
    return NextResponse.json({ success: true, message: newMessage, unreadCount });
  } catch (e) {
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action } = body;
    const messages = loadMessages();

    if (action === "mark_all_read") {
      messages.forEach((m) => {
        m.read = true;
      });
    } else if (id) {
      const target = messages.find((m) => m.id === id);
      if (target) {
        target.read = true;
      }
    }

    saveMessages(messages);
    const unreadCount = messages.filter((m) => !m.read && m.sender === "client").length;
    return NextResponse.json({ success: true, unreadCount });
  } catch (e) {
    return NextResponse.json({ error: "Failed to update messages" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    saveMessages([]);
    return NextResponse.json({ success: true, messages: [], unreadCount: 0 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to clear messages" }, { status: 500 });
  }
}
