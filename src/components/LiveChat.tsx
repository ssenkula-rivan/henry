'use client';

import { useState, useEffect, useRef } from "react";

interface Message {
  id: string;
  text: string;
  sender: "client" | "owner";
  senderName?: string;
  timestamp: string;
  read: boolean;
}

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [hasNewAdminReply, setHasNewAdminReply] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevOwnerCountRef = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChatMessages = async () => {
    try {
      const res = await fetch("/api/chat/messages");
      if (!res.ok) return;
      const data = await res.json();
      const loadedMessages: Message[] = data.messages || [];

      // Check if new reply from admin
      const currentOwnerCount = loadedMessages.filter((m) => m.sender === "owner").length;
      if (currentOwnerCount > prevOwnerCountRef.current && prevOwnerCountRef.current > 0) {
        if (!isOpen) {
          setHasNewAdminReply(true);
        }
      }
      prevOwnerCountRef.current = currentOwnerCount;

      setMessages(loadedMessages);
    } catch (e) {
      console.error("LiveChat poll error:", e);
    }
  };

  // Initial load
  useEffect(() => {
    fetchChatMessages();
  }, []);

  // Poll while open or idle
  useEffect(() => {
    const intervalTime = isOpen ? 2000 : 5000;
    const interval = setInterval(fetchChatMessages, intervalTime);
    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setHasNewAdminReply(false);
      scrollToBottom();
    }
  }, [isOpen, messages.length]);

  // Online status simulation (business hours or active)
  useEffect(() => {
    const currentHour = new Date().getHours();
    setIsOnline(currentHour >= 8 && currentHour <= 22);
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isSending) return;

    const textToSend = inputMessage.trim();
    setInputMessage("");
    setIsSending(true);

    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textToSend,
          sender: "client",
          senderName: "Client"
        })
      });

      if (res.ok) {
        await fetchChatMessages();
        scrollToBottom();
      }
    } catch (err) {
      console.error("Failed to send client message", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="relative bg-[#8b5cf6] text-black px-6 py-3.5 rounded-full font-mono text-xs tracking-widest uppercase font-bold hover:bg-[#7c3aed] hover:text-white transition-all duration-300 shadow-2xl hover:shadow-[0_0_25px_rgba(139,92,246,0.6)] transform hover:-translate-y-0.5 flex items-center gap-2.5"
        >
          <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? "bg-emerald-400" : "bg-gray-400"} animate-pulse`}></div>
          <span>{isOnline ? "Live Chat" : "Message Henry"}</span>
          
          {hasNewAdminReply && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full animate-ping"></span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] h-[520px] bg-[#0c0c10] border border-[#8b5cf6]/40 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-black px-4 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-950 animate-ping absolute"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-900"></div>
          </div>
          <div>
            <span className="font-serif text-sm font-bold text-white tracking-wide block">
              Henry (Alkemy Visuals)
            </span>
            <span className="font-mono text-[10px] text-purple-200 block">
              {isOnline ? "Direct Live Response" : "Leave a message"}
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-black w-8 h-8 rounded-full flex items-center justify-center transition-colors text-lg font-bold"
          aria-label="Close Chat"
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#08080a]">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 py-12 px-4">
            <div className="w-12 h-12 rounded-full bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 flex items-center justify-center text-xl mx-auto mb-3">
              👋
            </div>
            <p className="font-serif text-sm text-gray-200 mb-1">Start a conversation!</p>
            <p className="font-mono text-xs text-gray-500">
              Henry will receive an immediate alert and reply directly here.
            </p>
          </div>
        )}

        {messages.map((message) => {
          const isMe = message.sender === "client";
          const time = new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

          return (
            <div
              key={message.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl shadow-sm ${
                  isMe
                    ? "bg-[#8b5cf6] text-black rounded-tr-none font-medium"
                    : "bg-[#181822] text-gray-100 border border-gray-800 rounded-tl-none"
                }`}
              >
                {!isMe && (
                  <span className="block font-mono text-[10px] text-[#a78bfa] font-bold mb-0.5">
                    Henry
                  </span>
                )}
                <p className="text-xs font-sans leading-relaxed break-words">{message.text}</p>
                <span className={`block text-[9px] font-mono mt-1 text-right ${isMe ? "text-black/60" : "text-gray-500"}`}>
                  {time}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t border-gray-800/80 p-3 bg-[#0f0f14]">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={isOnline ? "Type your message..." : "Leave your message..."}
            className="flex-1 bg-[#16161f] text-white px-3.5 py-2.5 rounded-xl font-mono text-xs border border-gray-700/80 focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] outline-none transition-all placeholder:text-gray-500"
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isSending}
            className="bg-[#8b5cf6] text-black px-4 py-2.5 rounded-xl font-mono text-xs font-bold hover:bg-[#7c3aed] hover:text-white transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-[#8b5cf6]/20"
          >
            {isSending ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
