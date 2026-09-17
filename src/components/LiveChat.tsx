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
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewReply, setHasNewReply] = useState(false);
  const [storageReady, setStorageReady] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevOwnerCountRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/chat/messages");
      const data = await res.json();
      if (data.error && data.messages === undefined) {
        setStorageReady(false);
        return;
      }
      setStorageReady(true);
      const loaded: Message[] = data.messages || [];
      const ownerCount = loaded.filter((m) => m.sender === "owner").length;
      if (ownerCount > prevOwnerCountRef.current && prevOwnerCountRef.current > 0 && !isOpen) {
        setHasNewReply(true);
      }
      prevOwnerCountRef.current = ownerCount;
      setMessages(loaded);
    } catch (e) {
      console.error("Chat fetch error:", e);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchMessages, isOpen ? 2000 : 6000);
    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setHasNewReply(false);
      setTimeout(scrollToBottom, 100);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages.length]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isSending) return;
    const text = inputMessage.trim();
    setInputMessage("");
    setIsSending(true);
    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, sender: "client" }),
      });
      if (res.ok) {
        await fetchMessages();
        scrollToBottom();
      }
    } catch (e) {
      console.error("Send error:", e);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return "Today";
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="relative flex items-center gap-3 bg-[#003087] hover:bg-[#002070] text-white px-5 py-3 rounded-none font-sans text-sm font-semibold transition-all duration-200 shadow-xl border border-[#003087]"
          aria-label="Open live chat"
          style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif", letterSpacing: "0.01em" }}
        >
          <span className="relative flex items-center justify-center w-5 h-5 flex-shrink-0">
            <span className="absolute inline-flex w-full h-full rounded-full bg-green-400 opacity-60 animate-ping"></span>
            <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-green-400"></span>
          </span>
          <span>Chat With Us</span>
          {hasNewReply && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow">1</span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col bg-white border border-gray-300 shadow-2xl"
      style={{
        width: "380px",
        maxWidth: "calc(100vw - 2rem)",
        height: "540px",
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
      }}
      role="dialog"
      aria-label="Live Chat"
    >
      {/* Header */}
      <div className="bg-[#003087] text-white px-5 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0">
            <span className="text-[#003087] font-bold text-sm">MH</span>
          </div>
          <div>
            <div className="font-semibold text-sm leading-tight">Henry Mbalire</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
              <span className="text-xs text-blue-100 font-normal">Available Now</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-blue-200 hover:text-white transition-colors text-lg font-light w-8 h-8 flex items-center justify-center"
          aria-label="Close chat"
        >
          X
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-[#f5f6f8] px-4 py-4 space-y-3">
        {/* Welcome message */}
        {messages.length === 0 && !isLoading && (
          <div className="bg-white border border-gray-200 rounded-none p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#003087] flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-sm">MH</span>
            </div>
            <p className="text-gray-800 font-semibold text-sm">Welcome to our live chat</p>
            <p className="text-gray-500 text-xs mt-1 leading-relaxed">
              How can Henry assist you today? Send a message and you will receive a response shortly.
            </p>
          </div>
        )}

        {!storageReady && (
          <div className="bg-yellow-50 border border-yellow-300 p-3 text-xs text-yellow-800">
            Chat service is being configured. Please try again shortly.
          </div>
        )}

        {messages.map((msg, index) => {
          const isClient = msg.sender === "client";
          const showDate = index === 0 || formatDate(msg.timestamp) !== formatDate(messages[index - 1].timestamp);

          return (
            <div key={msg.id}>
              {showDate && (
                <div className="text-center text-[11px] text-gray-400 my-2 font-medium uppercase tracking-wider">
                  {formatDate(msg.timestamp)}
                </div>
              )}
              <div className={`flex flex-col ${isClient ? "items-end" : "items-start"}`}>
                {!isClient && (
                  <span className="text-[11px] text-gray-500 mb-1 px-1">Henry Mbalire</span>
                )}
                <div
                  className={`max-w-[82%] px-4 py-2.5 text-sm leading-relaxed ${
                    isClient
                      ? "bg-[#003087] text-white"
                      : "bg-white border border-gray-200 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[11px] text-gray-400 mt-1 px-1">{formatTime(msg.timestamp)}</span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white px-4 py-3 flex-shrink-0">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={!storageReady}
            className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm px-3 py-2.5 outline-none focus:border-[#003087] focus:ring-1 focus:ring-[#003087] transition-all rounded-none placeholder:text-gray-400"
            style={{ fontFamily: "inherit" }}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isSending || !storageReady}
            className="bg-[#003087] hover:bg-[#002070] text-white px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed rounded-none min-w-[70px]"
          >
            {isSending ? "..." : "Send"}
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-2 text-center">
          Secured by Henry Mbalire Portfolio
        </p>
      </div>
    </div>
  );
}
