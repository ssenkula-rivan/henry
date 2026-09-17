'use client';

import { useState, useEffect, useRef } from "react";
import { 
  loginUser, 
  checkAuthSession, 
  logoutUser, 
  validatePasswordStrength 
} from "@/lib/auth";

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
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{ valid: boolean; message: string } | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [recentAlert, setRecentAlert] = useState<string | null>(null);

  const prevUnreadRef = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const alertTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check existing session on mount
  useEffect(() => {
    async function initAuth() {
      const authenticated = await checkAuthSession();
      setIsAuthenticated(authenticated);
      setIsCheckingAuth(false);
    }
    initAuth();
  }, []);

  // Poll messages if authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    fetchMessages();
    const interval = setInterval(fetchMessages, 2500);
    return () => clearInterval(interval);
  }, [isAuthenticated, soundEnabled]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const playAlertChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc2.type = "triangle";

      // Two-tone bright notification chime
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

      osc2.frequency.setValueAtTime(440, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.45);
      osc2.stop(ctx.currentTime + 0.45);
    } catch (e) {
      console.log("Audio alert playback error:", e);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/chat/messages");
      if (!res.ok) return;
      const data = await res.json();
      const newMessages: Message[] = data.messages || [];
      const newUnread: number = data.unreadCount || 0;

      // Trigger chime and notification if unread client messages increased
      if (newUnread > prevUnreadRef.current && prevUnreadRef.current >= 0) {
        playAlertChime();
        const latestClientMsg = [...newMessages].reverse().find(m => m.sender === "client");
        if (latestClientMsg) {
          setRecentAlert(`New visitor message: "${latestClientMsg.text.substring(0, 40)}${latestClientMsg.text.length > 40 ? "..." : ""}"`);
          if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
          alertTimeoutRef.current = setTimeout(() => setRecentAlert(null), 6000);
        }
      }
      prevUnreadRef.current = newUnread;
      setMessages(newMessages);
      setUnreadCount(newUnread);
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!username.trim() || !password.trim()) {
      setLoginError("Please enter both username and password");
      return;
    }

    setIsLoggingIn(true);
    const result = await loginUser(username.trim(), password.trim());
    setIsLoggingIn(false);

    if (result.success) {
      setIsAuthenticated(true);
      setUsername("");
      setPassword("");
      prevUnreadRef.current = 0;
      fetchMessages();
    } else {
      setLoginError(result.error || "Invalid username or password");
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setIsAuthenticated(false);
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (val.length > 0) {
      setPasswordStrength(validatePasswordStrength(val));
    } else {
      setPasswordStrength(null);
    }
  };

  const sendReply = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || isSubmittingReply) return;

    setIsSubmittingReply(true);
    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: replyText.trim(),
          sender: "owner",
          senderName: "Henry (Owner)"
        })
      });

      if (res.ok) {
        setReplyText("");
        await fetchMessages();
        scrollToBottom();
      }
    } catch (err) {
      console.error("Failed to send reply", err);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const markAllRead = async () => {
    try {
      await fetch("/api/chat/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_all_read" })
      });
      await fetchMessages();
    } catch (e) {
      console.error("Error marking all read", e);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch("/api/chat/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      await fetchMessages();
    } catch (e) {
      console.error("Error marking read", e);
    }
  };

  const clearChatHistory = async () => {
    if (!confirm("Are you sure you want to clear all chat messages? This cannot be undone.")) {
      return;
    }
    try {
      await fetch("/api/chat/messages", { method: "DELETE" });
      setMessages([]);
      setUnreadCount(0);
      prevUnreadRef.current = 0;
    } catch (e) {
      console.error("Failed to clear chat", e);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#070709] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#8b5cf6] font-mono text-sm">
          <div className="w-5 h-5 border-2 border-[#8b5cf6] border-t-transparent rounded-full animate-spin"></div>
          <span>Verifying secure admin session...</span>
        </div>
      </div>
    );
  }

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070709] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,50,255,0.15),rgba(255,255,255,0))] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 mb-4 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
              <span className="font-serif text-2xl font-bold text-[#a78bfa]">M·H</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-white tracking-wide">Henry Admin Portal</h1>
            <p className="text-gray-400 font-mono text-xs mt-2">Private Management Dashboard</p>
          </div>

          <div className="bg-[#111116] border border-[#8b5cf6]/30 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
            {loginError && (
              <div className="bg-red-500/10 border border-red-500/40 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm font-mono flex items-center gap-2">
                <span>⚠️</span>
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block font-mono text-xs text-[#a78bfa] mb-2 uppercase tracking-wider font-semibold">
                  Admin Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  autoComplete="username"
                  className="w-full bg-[#0a0a0d] text-white px-4 py-3 rounded-xl font-mono text-sm border border-gray-800 focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] outline-none transition-all duration-200"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-[#a78bfa] mb-2 uppercase tracking-wider font-semibold">
                  Admin Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                  className="w-full bg-[#0a0a0d] text-white px-4 py-3 rounded-xl font-mono text-sm border border-gray-800 focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] outline-none transition-all duration-200"
                />
                {passwordStrength && (
                  <p className={`mt-2 text-xs font-mono ${passwordStrength.valid ? "text-emerald-400" : "text-amber-400"}`}>
                    {passwordStrength.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-[#8b5cf6] text-black font-mono text-sm font-bold py-3.5 px-6 rounded-xl hover:bg-[#7c3aed] hover:text-white transition-all duration-200 shadow-lg shadow-[#8b5cf6]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoggingIn ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <span>Access Admin Panel</span>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-800/80">
              <div className="flex items-center justify-between text-xs font-mono text-gray-500 mb-2">
                <span>🔐 Authenticated via .env.local</span>
                <span className="text-[#a78bfa]">Protected Endpoint</span>
              </div>
              <p className="text-[11px] font-mono text-gray-400 bg-black/40 p-3 rounded-lg border border-gray-800/60 leading-relaxed">
                Credentials are authenticated on the backend server. No credentials are leaked to client bundles.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Logged-in Admin Dashboard
  return (
    <div className="min-h-screen bg-[#070709] text-white">
      {/* Top Banner Alert when new message arrives */}
      {recentAlert && (
        <div className="bg-gradient-to-r from-[#8b5cf6] via-[#7c3aed] to-[#6d28d9] text-white px-6 py-3 text-center font-mono text-xs font-bold tracking-wide flex items-center justify-center gap-3 shadow-xl animate-bounce">
          <span>🔔</span>
          <span>{recentAlert}</span>
          <button 
            onClick={() => setRecentAlert(null)}
            className="ml-4 text-white/80 hover:text-white underline text-[11px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Navigation Header */}
      <header className="border-b border-[#8b5cf6]/20 bg-[#0d0d12]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 flex items-center justify-center font-serif text-lg font-bold text-[#8b5cf6]">
              M·H
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl font-bold">Admin Workspace</h1>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Live
                </span>
              </div>
              <p className="text-xs font-mono text-gray-400">Live Client Inquiries & Instant Response Panel</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Audio chime toggle */}
            <button
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                if (next) playAlertChime();
              }}
              title={soundEnabled ? "Sound Alert Enabled (Click to Mute)" : "Sound Alert Muted (Click to Unmute)"}
              className={`px-3 py-2 rounded-lg font-mono text-xs border transition-colors flex items-center gap-1.5 ${
                soundEnabled 
                  ? "bg-[#8b5cf6]/20 border-[#8b5cf6]/40 text-[#a78bfa] hover:bg-[#8b5cf6]/30" 
                  : "bg-gray-800/40 border-gray-700 text-gray-400 hover:bg-gray-800"
              }`}
            >
              <span>{soundEnabled ? "🔊 Sound: On" : "🔇 Sound: Off"}</span>
            </button>

            {/* Test sound button */}
            <button
              onClick={playAlertChime}
              className="px-3 py-2 rounded-lg font-mono text-xs bg-gray-800/60 border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
            >
              Test Chime
            </button>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg font-mono text-xs bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-colors font-semibold"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Status Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#111116] border border-gray-800 rounded-2xl p-5">
            <div className="text-gray-400 font-mono text-xs mb-1">Unread Inquiries</div>
            <div className="flex items-center justify-between">
              <span className={`text-3xl font-serif font-bold ${unreadCount > 0 ? "text-amber-400" : "text-white"}`}>
                {unreadCount}
              </span>
              {unreadCount > 0 && (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono px-2.5 py-1 rounded-full animate-pulse">
                  Needs Attention
                </span>
              )}
            </div>
          </div>

          <div className="bg-[#111116] border border-gray-800 rounded-2xl p-5">
            <div className="text-gray-400 font-mono text-xs mb-1">Total Chat Messages</div>
            <div className="text-3xl font-serif font-bold text-white">
              {messages.length}
            </div>
          </div>

          <div className="bg-[#111116] border border-gray-800 rounded-2xl p-5">
            <div className="text-gray-400 font-mono text-xs mb-1">Alert System Status</div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
              <span className="font-mono text-xs text-emerald-400 font-medium">
                Active Sound & Pulse Alarm
              </span>
            </div>
          </div>
        </div>

        {/* Chat Control & Messages Center */}
        <div className="bg-[#111116] border border-[#8b5cf6]/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[650px]">
          {/* Header of Chat */}
          <div className="px-6 py-4 bg-[#16161d] border-b border-gray-800 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-lg font-bold">Client Inquiries & Live Chat</h2>
              {unreadCount > 0 && (
                <span className="bg-[#8b5cf6] text-black font-mono text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs font-mono bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 text-[#a78bfa] px-3 py-1.5 rounded-lg hover:bg-[#8b5cf6]/30 transition-colors"
                >
                  Mark All Read
                </button>
              )}
              <button
                onClick={clearChatHistory}
                className="text-xs font-mono bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                Clear History
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#0a0a0d]">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-full bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 flex items-center justify-center text-2xl mb-4">
                  💬
                </div>
                <h3 className="font-serif text-lg font-semibold text-gray-200">No Inquiries Yet</h3>
                <p className="text-gray-500 font-mono text-xs mt-1 max-w-sm">
                  When a portfolio visitor clicks &quot;Live Chat&quot; on the website and sends a message, it will immediately show up here with audio and visual alerts.
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isClient = msg.sender === "client";
                const dateObj = new Date(msg.timestamp);
                const timeStr = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                const dateStr = dateObj.toLocaleDateString([], { month: "short", day: "numeric" });

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isClient ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 transition-all duration-200 ${
                        isClient
                          ? `bg-[#171722] border ${
                              !msg.read
                                ? "border-[#8b5cf6] shadow-[0_0_15px_rgba(139,92,246,0.2)] ring-1 ring-[#8b5cf6]"
                                : "border-gray-800"
                            }`
                          : "bg-[#251b3a] border border-[#8b5cf6]/40 text-purple-50"
                      }`}
                    >
                      {/* Sender Header */}
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                              isClient
                                ? "bg-[#8b5cf6]/20 text-[#a78bfa]"
                                : "bg-white/10 text-white"
                            }`}
                          >
                            {isClient ? "Visitor / Client" : "Henry (You)"}
                          </span>
                          {!msg.read && isClient && (
                            <span className="bg-red-500 text-white text-[10px] font-mono px-1.5 py-0.2 rounded font-bold uppercase animate-pulse">
                              Unread
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-gray-400">
                            {dateStr} {timeStr}
                          </span>
                          {!msg.read && isClient && (
                            <button
                              onClick={() => markAsRead(msg.id)}
                              className="text-[11px] font-mono text-[#8b5cf6] hover:underline"
                            >
                              mark read
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Message Content */}
                      <p className="text-sm text-gray-100 whitespace-pre-wrap leading-relaxed">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Form */}
          <form onSubmit={sendReply} className="p-4 bg-[#121218] border-t border-gray-800 flex gap-3">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply to portfolio visitor..."
              className="flex-1 bg-[#0a0a0e] text-white px-4 py-3 rounded-xl font-mono text-sm border border-gray-700 focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] outline-none transition-all"
            />
            <button
              type="submit"
              disabled={isSubmittingReply || !replyText.trim()}
              className="bg-[#8b5cf6] text-black font-mono text-xs font-bold px-6 py-3 rounded-xl hover:bg-[#7c3aed] hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-[#8b5cf6]/20"
            >
              {isSubmittingReply ? "Sending..." : "Send Reply"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
