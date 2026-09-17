'use client';

import { useState, useEffect, useRef } from "react";
import { loginUser, checkAuthSession, logoutUser, validatePasswordStrength } from "@/lib/auth";

interface Message {
  id: string;
  text: string;
  sender: "client" | "owner";
  senderName?: string;
  timestamp: string;
  read: boolean;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{ valid: boolean; message: string } | null>(null);
  const [alertBanner, setAlertBanner] = useState<string | null>(null);
  const [storageConfigured, setStorageConfigured] = useState(true);
  const [activeTab, setActiveTab] = useState<"inbox" | "reply">("inbox");

  const prevUnreadRef = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const alertTimeout = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    checkAuthSession().then((auth) => {
      setIsAuthenticated(auth);
      setIsCheckingAuth(false);
    });
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchMessages();
    const interval = setInterval(fetchMessages, 2500);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {}
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/chat/messages");
      const data = await res.json();
      if (data.error && !data.messages) {
        setStorageConfigured(false);
        return;
      }
      setStorageConfigured(true);
      const loaded: Message[] = data.messages || [];
      const newUnread: number = data.unreadCount || 0;

      if (newUnread > prevUnreadRef.current && prevUnreadRef.current >= 0 && isAuthenticated) {
        playChime();
        const latest = [...loaded].reverse().find((m) => m.sender === "client" && !m.read);
        if (latest) {
          const preview = latest.text.length > 55 ? latest.text.slice(0, 55) + "..." : latest.text;
          setAlertBanner(`New message received: "${preview}"`);
          if (alertTimeout.current) clearTimeout(alertTimeout.current);
          alertTimeout.current = setTimeout(() => setAlertBanner(null), 7000);
        }
      }

      prevUnreadRef.current = newUnread;
      setMessages(loaded);
      setUnreadCount(newUnread);
    } catch (e) {
      console.error("Admin fetch error:", e);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!username.trim() || !password.trim()) {
      setLoginError("Please enter both username and password.");
      return;
    }
    setIsLoggingIn(true);
    const result = await loginUser(username.trim(), password.trim());
    setIsLoggingIn(false);
    if (result.success) {
      setIsAuthenticated(true);
      setUsername("");
      setPassword("");
    } else {
      setLoginError(result.error || "Invalid credentials. Please try again.");
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setIsAuthenticated(false);
  };

  const sendReply = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || isSendingReply) return;
    setIsSendingReply(true);
    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: replyText.trim(), sender: "owner", senderName: "Henry Mbalire" }),
      });
      if (res.ok) {
        setReplyText("");
        await fetchMessages();
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    } catch {}
    setIsSendingReply(false);
  };

  const markAllRead = async () => {
    await fetch("/api/chat/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "mark_all_read" }),
    });
    await fetchMessages();
  };

  const clearHistory = async () => {
    if (!confirm("Clear all chat history? This action cannot be undone.")) return;
    await fetch("/api/chat/messages", { method: "DELETE" });
    setMessages([]);
    setUnreadCount(0);
    prevUnreadRef.current = 0;
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const formatDateLabel = (iso: string) => {
    const d = new Date(iso);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return "Today";
    return d.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
  };

  const baseFont = { fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center" style={baseFont}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#003087] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center px-4" style={baseFont}>
        <div className="w-full max-w-[400px]">
          {/* Bank-style header */}
          <div className="bg-[#003087] px-6 py-5 text-white text-center">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-[#003087] font-bold text-sm">MH</span>
            </div>
            <h1 className="text-lg font-semibold tracking-wide">Portfolio Administration</h1>
            <p className="text-blue-200 text-xs mt-1">Secure Staff Sign-In</p>
          </div>

          <div className="bg-white border border-gray-200 px-6 py-6 shadow-sm">
            {loginError && (
              <div className="bg-red-50 border-l-4 border-red-600 text-red-700 px-4 py-3 mb-5 text-sm">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  className="w-full border border-gray-300 text-gray-900 text-sm px-3 py-2.5 outline-none focus:border-[#003087] focus:ring-1 focus:ring-[#003087] transition-all rounded-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordStrength(e.target.value ? validatePasswordStrength(e.target.value) : null);
                  }}
                  autoComplete="current-password"
                  className="w-full border border-gray-300 text-gray-900 text-sm px-3 py-2.5 outline-none focus:border-[#003087] focus:ring-1 focus:ring-[#003087] transition-all rounded-none"
                />
                {passwordStrength && (
                  <p className={`text-xs mt-1.5 ${passwordStrength.valid ? "text-green-600" : "text-amber-600"}`}>
                    {passwordStrength.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-[#003087] hover:bg-[#002070] text-white font-semibold py-3 text-sm transition-colors disabled:opacity-50 rounded-none mt-2"
              >
                {isLoggingIn ? "Signing In..." : "Sign In"}
              </button>
            </form>
          </div>

          <div className="bg-gray-50 border border-t-0 border-gray-200 px-6 py-3 text-center">
            <p className="text-[11px] text-gray-400">
              This portal is restricted to authorized personnel only.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5]" style={baseFont}>
      {/* Alert Banner */}
      {alertBanner && (
        <div className="bg-[#c8102e] text-white px-6 py-3 flex items-center justify-between text-sm font-medium">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse flex-shrink-0"></span>
            <span>{alertBanner}</span>
          </div>
          <button onClick={() => setAlertBanner(null)} className="text-red-200 hover:text-white text-xs ml-4">
            Dismiss
          </button>
        </div>
      )}

      {/* Top Header */}
      <header className="bg-[#003087] text-white border-b border-[#002070]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#003087] font-bold text-xs">MH</span>
            </div>
            <div>
              <h1 className="font-semibold text-sm">Portfolio Admin</h1>
              <p className="text-blue-200 text-[11px]">Live Chat Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <span className="bg-[#c8102e] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {unreadCount} Unread
              </span>
            )}
            <button
              onClick={handleLogout}
              className="text-blue-200 hover:text-white text-xs border border-blue-400 px-3 py-1.5 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Secondary Nav */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex gap-0">
            <button
              onClick={() => setActiveTab("inbox")}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "inbox"
                  ? "border-[#003087] text-[#003087]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Inbox
              {unreadCount > 0 && (
                <span className="ml-2 bg-[#c8102e] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("reply")}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "reply"
                  ? "border-[#003087] text-[#003087]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Compose Reply
            </button>
          </nav>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-6">
        {!storageConfigured && (
          <div className="bg-amber-50 border border-amber-300 px-5 py-4 mb-6">
            <p className="text-amber-800 font-semibold text-sm">Chat Storage Not Configured</p>
            <p className="text-amber-700 text-xs mt-1">
              Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to your Vercel environment variables,
              then redeploy. Get free credentials at upstash.com.
            </p>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 px-5 py-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Total Messages</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{messages.length}</p>
          </div>
          <div className="bg-white border border-gray-200 px-5 py-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Unread</p>
            <p className={`text-2xl font-semibold mt-1 ${unreadCount > 0 ? "text-[#c8102e]" : "text-gray-900"}`}>
              {unreadCount}
            </p>
          </div>
          <div className="bg-white border border-gray-200 px-5 py-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Alert System</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-sm text-gray-700 font-medium">Active</span>
            </div>
          </div>
        </div>

        {activeTab === "inbox" && (
          <div className="bg-white border border-gray-200 shadow-sm">
            {/* Table Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-800">Client Messages</h2>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-[#003087] border border-[#003087] px-3 py-1.5 hover:bg-[#003087] hover:text-white transition-colors"
                  >
                    Mark All Read
                  </button>
                )}
                <button
                  onClick={clearHistory}
                  className="text-xs text-red-600 border border-red-300 px-3 py-1.5 hover:bg-red-50 transition-colors"
                >
                  Clear History
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="divide-y divide-gray-100" style={{ maxHeight: "480px", overflowY: "auto" }}>
              {messages.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <p className="text-gray-400 text-sm">No messages yet. When visitors use the live chat, their messages will appear here.</p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isClient = msg.sender === "client";
                  const showDate =
                    index === 0 ||
                    formatDateLabel(msg.timestamp) !== formatDateLabel(messages[index - 1].timestamp);

                  return (
                    <div key={msg.id}>
                      {showDate && (
                        <div className="bg-gray-50 px-5 py-2 text-[11px] text-gray-400 font-medium uppercase tracking-wider border-y border-gray-100">
                          {formatDateLabel(msg.timestamp)}
                        </div>
                      )}
                      <div
                        className={`px-5 py-4 flex gap-4 ${
                          isClient && !msg.read ? "bg-blue-50 border-l-4 border-l-[#003087]" : ""
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                            isClient ? "bg-[#003087] text-white" : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {isClient ? "V" : "HM"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-gray-700">
                              {isClient ? "Visitor" : "Henry Mbalire (You)"}
                            </span>
                            {isClient && !msg.read && (
                              <span className="bg-[#c8102e] text-white text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider">
                                Unread
                              </span>
                            )}
                            <span className="text-[11px] text-gray-400 ml-auto flex-shrink-0">
                              {formatTime(msg.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-800 leading-relaxed break-words">{msg.text}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {activeTab === "reply" && (
          <div className="bg-white border border-gray-200 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-800">Send Reply to Visitor</h2>
              <p className="text-xs text-gray-500 mt-0.5">Your reply will appear in the visitor's live chat window in real time.</p>
            </div>
            <div className="p-5">
              {/* Recent context */}
              {messages.filter((m) => m.sender === "client").length > 0 && (
                <div className="mb-4 bg-gray-50 border border-gray-200 px-4 py-3">
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mb-2">Latest Visitor Message</p>
                  <p className="text-sm text-gray-700 italic">
                    "{[...messages].reverse().find((m) => m.sender === "client")?.text}"
                  </p>
                </div>
              )}

              <form onSubmit={sendReply} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                    Your Reply
                  </label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={5}
                    placeholder="Type your reply to the visitor..."
                    className="w-full border border-gray-300 text-gray-900 text-sm px-3 py-2.5 outline-none focus:border-[#003087] focus:ring-1 focus:ring-[#003087] transition-all rounded-none resize-none"
                    style={{ fontFamily: "inherit" }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) sendReply();
                    }}
                  />
                  <p className="text-[11px] text-gray-400 mt-1">Press Ctrl+Enter to send</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSendingReply || !replyText.trim() || !storageConfigured}
                    className="bg-[#003087] hover:bg-[#002070] text-white font-semibold px-6 py-2.5 text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed rounded-none"
                  >
                    {isSendingReply ? "Sending..." : "Send Reply"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setReplyText("")}
                    className="text-gray-500 hover:text-gray-700 text-sm border border-gray-300 px-4 py-2.5 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <p className="text-[11px] text-gray-400 text-center mt-6">
          Henry Mbalire Portfolio Administration - Authorized access only
        </p>
      </main>
    </div>
  );
}
