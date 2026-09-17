'use client';

import { useState, useEffect, useRef } from "react";

interface Message {
  id: string;
  text: string;
  sender: "client" | "owner";
  senderName: string;
  timestamp: string;
  read: boolean;
}

interface Session {
  id: string;
  visitorName: string;
  status: "waiting" | "active" | "ended";
}

type ChatState = "closed" | "name_entry" | "waiting" | "chatting" | "ended";

export default function LiveChat() {
  const [chatState, setChatState] = useState<ChatState>("closed");
  const [nameInput, setNameInput] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [hasNewReply, setHasNewReply] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevMsgCountRef = useRef(0);

  // On mount: restore session from localStorage
  useEffect(() => {
    const savedSessionId = localStorage.getItem("hchat_session_id");
    const savedName = localStorage.getItem("hchat_visitor_name");
    const savedStatus = localStorage.getItem("hchat_session_status") as Session["status"] | null;
    if (savedSessionId && savedName && savedStatus) {
      setSession({ id: savedSessionId, visitorName: savedName, status: savedStatus });
      if (savedStatus === "ended") {
        // session was ended, reset so they can start fresh
        clearLocalSession();
      }
    }
  }, []);

  const clearLocalSession = () => {
    localStorage.removeItem("hchat_session_id");
    localStorage.removeItem("hchat_visitor_name");
    localStorage.removeItem("hchat_session_status");
    setSession(null);
    setMessages([]);
    prevMsgCountRef.current = 0;
  };

  // Poll messages when chatting
  useEffect(() => {
    if (!session || chatState === "closed" || chatState === "name_entry") return;

    fetchMessages();
    const interval = setInterval(fetchMessages, 2500);
    return () => clearInterval(interval);
  }, [session, chatState]);

  useEffect(() => {
    if (chatState === "chatting") {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [chatState]);

  useEffect(() => {
    if (messages.length > prevMsgCountRef.current && prevMsgCountRef.current > 0) {
      const last = messages[messages.length - 1];
      if (last.sender === "owner" && chatState !== "chatting") {
        setHasNewReply(true);
      }
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMsgCountRef.current = messages.length;
  }, [messages.length]);

  const fetchMessages = async () => {
    if (!session) return;
    try {
      const res = await fetch(`/api/chat/messages?sessionId=${session.id}`);
      const data = await res.json();
      if (data.messages) setMessages(data.messages);

      // Also check session status for admin acceptance or end
      const sRes = await fetch("/api/chat/sessions");
      const sData = await sRes.json();
      const current = sData.sessions?.find((s: Session) => s.id === session.id);
      if (current) {
        setSession(current);
        localStorage.setItem("hchat_session_status", current.status);
        if (current.status === "active" && chatState === "waiting") {
          setChatState("chatting");
        }
        if (current.status === "ended" && chatState !== "ended") {
          setChatState("ended");
        }
      }
    } catch {}
  };

  const startSession = async () => {
    if (!nameInput.trim()) return;
    try {
      const res = await fetch("/api/chat/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorName: nameInput.trim() }),
      });
      const data = await res.json();
      if (data.session) {
        const sess: Session = data.session;
        setSession(sess);
        localStorage.setItem("hchat_session_id", sess.id);
        localStorage.setItem("hchat_visitor_name", sess.visitorName);
        localStorage.setItem("hchat_session_status", sess.status);
        setChatState("waiting");
      }
    } catch {}
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isSending || !session) return;
    const text = inputText.trim();
    setInputText("");
    setIsSending(true);
    try {
      await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session.id, text, sender: "client", senderName: session.visitorName }),
      });
      await fetchMessages();
    } catch {}
    setIsSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); sendMessage(); }
  };

  const handleOpen = () => {
    setHasNewReply(false);
    if (session && session.status !== "ended") {
      setChatState(session.status === "active" ? "chatting" : "waiting");
    } else {
      setChatState("name_entry");
    }
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const font = { fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" };

  // ── Closed button ──
  if (chatState === "closed") {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleOpen}
          className="relative flex items-center gap-3 bg-[#003087] hover:bg-[#002070] text-white px-5 py-3 text-sm font-semibold transition-all duration-200 shadow-xl"
          style={font}
        >
          <span className="relative flex items-center justify-center w-5 h-5 flex-shrink-0">
            <span className="absolute inline-flex w-full h-full rounded-full bg-green-400 opacity-60 animate-ping"></span>
            <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-green-400"></span>
          </span>
          <span>Chat With Us</span>
          {hasNewReply && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white">1</span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col bg-white border border-gray-300 shadow-2xl"
      style={{ width: "380px", maxWidth: "calc(100vw - 2rem)", height: "520px", ...font }}
    >
      {/* Header */}
      <div className="bg-[#003087] text-white px-5 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0">
            <span className="text-[#003087] font-bold text-sm">MH</span>
          </div>
          <div>
            <div className="font-semibold text-sm">Henry Mbalire</div>
            <div className="text-xs text-blue-100">
              {session ? `Session: ${session.visitorName}` : "Live Support"}
            </div>
          </div>
        </div>
        <button
          onClick={() => setChatState("closed")}
          className="text-blue-200 hover:text-white w-8 h-8 flex items-center justify-center text-lg"
        >
          X
        </button>
      </div>

      {/* ── Name Entry ── */}
      {chatState === "name_entry" && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 bg-[#f5f6f8]">
          <div className="w-12 h-12 rounded-full bg-[#003087] flex items-center justify-center mb-4">
            <span className="text-white font-bold text-sm">MH</span>
          </div>
          <h3 className="text-gray-800 font-semibold text-base mb-1">Start a Chat</h3>
          <p className="text-gray-500 text-xs mb-6 text-center">Please enter your name to begin.</p>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && startSession()}
            placeholder="Your full name"
            className="w-full border border-gray-300 text-gray-900 text-sm px-3 py-2.5 outline-none focus:border-[#003087] focus:ring-1 focus:ring-[#003087] mb-3"
            autoFocus
          />
          <button
            onClick={startSession}
            disabled={!nameInput.trim()}
            className="w-full bg-[#003087] hover:bg-[#002070] text-white py-2.5 text-sm font-semibold transition-colors disabled:opacity-40"
          >
            Start Chat
          </button>
        </div>
      )}

      {/* ── Waiting for admin ── */}
      {chatState === "waiting" && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 bg-[#f5f6f8]">
          <div className="w-10 h-10 border-2 border-[#003087] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-800 font-semibold text-sm">Connecting you to support...</p>
          <p className="text-gray-500 text-xs mt-2 text-center">
            Hi <strong>{session?.visitorName}</strong>, a representative will be with you shortly.
          </p>
          <p className="text-gray-400 text-[11px] mt-6">This page will update automatically.</p>
        </div>
      )}

      {/* ── Chat ended ── */}
      {chatState === "ended" && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 bg-[#f5f6f8]">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <span className="text-gray-500 text-lg font-bold">-</span>
          </div>
          <p className="text-gray-800 font-semibold text-sm">Chat Session Ended</p>
          <p className="text-gray-500 text-xs mt-2 text-center">
            This chat has been closed. Start a new session if you need further assistance.
          </p>
          <button
            onClick={() => { clearLocalSession(); setChatState("name_entry"); }}
            className="mt-6 bg-[#003087] hover:bg-[#002070] text-white px-6 py-2.5 text-sm font-semibold transition-colors"
          >
            Start New Chat
          </button>
        </div>
      )}

      {/* ── Active chat ── */}
      {chatState === "chatting" && (
        <>
          <div className="flex-1 overflow-y-auto bg-[#f5f6f8] px-4 py-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-xs text-gray-400 mt-8">
                You are connected. Send a message to begin.
              </div>
            )}
            {messages.map((msg) => {
              const isClient = msg.sender === "client";
              return (
                <div key={msg.id} className={`flex flex-col ${isClient ? "items-end" : "items-start"}`}>
                  {!isClient && <span className="text-[11px] text-gray-500 mb-1 px-1">{msg.senderName}</span>}
                  <div className={`max-w-[82%] px-4 py-2.5 text-sm leading-relaxed ${isClient ? "bg-[#003087] text-white" : "bg-white border border-gray-200 text-gray-800"}`}>
                    {msg.text}
                  </div>
                  <span className="text-[11px] text-gray-400 mt-1 px-1">{formatTime(msg.timestamp)}</span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t border-gray-200 bg-white px-4 py-3 flex-shrink-0">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm px-3 py-2.5 outline-none focus:border-[#003087] focus:ring-1 focus:ring-[#003087]"
                style={font}
              />
              <button
                onClick={sendMessage}
                disabled={!inputText.trim() || isSending}
                className="bg-[#003087] hover:bg-[#002070] text-white px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-40 min-w-[70px]"
              >
                {isSending ? "..." : "Send"}
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 text-center">Secured by Henry Mbalire Portfolio</p>
          </div>
        </>
      )}
    </div>
  );
}
