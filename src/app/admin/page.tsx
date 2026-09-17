'use client';

import { useState, useEffect, useRef } from "react";
import { loginUser, checkAuthSession, logoutUser, validatePasswordStrength } from "@/lib/auth";

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
  createdAt: string;
  lastActivity: string;
  unreadCount: number;
}

const font = { fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" };

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [pwStrength, setPwStrength] = useState<{ valid: boolean; message: string } | null>(null);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessionMessages, setSessionMessages] = useState<Record<string, Message[]>>({});
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [storageOk, setStorageOk] = useState(true);

  // Push notification state
  const [pushStatus, setPushStatus] = useState<"unsupported" | "prompt" | "granted" | "denied">("prompt");
  const [isSubscribingPush, setIsSubscribingPush] = useState(false);
  const [pushTestMsg, setPushTestMsg] = useState<string | null>(null);

  const prevWaitingIds = useRef<Set<string>>(new Set());
  const bannerTimeout = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const replyRef = useRef<HTMLTextAreaElement>(null);
  const titleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    checkAuthSession().then((ok) => {
      setIsAuthenticated(ok);
      setIsCheckingAuth(false);
    });
  }, []);

  // Check and initialize push notifications
  useEffect(() => {
    if (!isAuthenticated) return;

    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setPushStatus("unsupported");
      return;
    }

    if (Notification.permission === "granted") {
      setPushStatus("granted");
      ensurePushSubscribed();
    } else if (Notification.permission === "denied") {
      setPushStatus("denied");
    } else {
      setPushStatus("prompt");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchAll();
    const interval = setInterval(fetchAll, 2500);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  useEffect(() => {
    if (activeSessionId) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
      setTimeout(() => replyRef.current?.focus(), 120);
    }
  }, [activeSessionId, sessionMessages]);

  // Tab Title alerting
  const flashTabTitle = (alertText: string) => {
    if (titleIntervalRef.current) clearInterval(titleIntervalRef.current);
    let toggle = false;
    let count = 0;
    titleIntervalRef.current = setInterval(() => {
      document.title = toggle ? alertText : "Support Console | Henry Mbalire";
      toggle = !toggle;
      count++;
      if (count > 20) {
        if (titleIntervalRef.current) clearInterval(titleIntervalRef.current);
        document.title = "Support Console | Henry Mbalire";
      }
    }, 800);
  };

  // Ringtone / Chime sound
  const playIncomingRing = () => {
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();

      // Play 2-burst support call chime
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };

      playTone(587.33, 0.0, 0.2); // D5
      playTone(880.00, 0.15, 0.35); // A5
      playTone(587.33, 0.5, 0.2); // D5
      playTone(880.00, 0.65, 0.45); // A5
    } catch {}
  };

  const ensurePushSubscribed = async () => {
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        const res = await fetch("/api/push/vapid-public-key");
        const { publicKey } = await res.json();
        if (!publicKey) return;

        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });
      }

      if (sub) {
        await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscription: sub }),
        });
        setPushStatus("granted");
      }
    } catch (err) {
      console.error("Error setting up push subscription:", err);
    }
  };

  const handleEnablePush = async () => {
    setIsSubscribingPush(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        await ensurePushSubscribed();
        showBanner("Background push alerts enabled! You will be notified even when this tab is closed.");
      } else {
        setPushStatus(permission === "denied" ? "denied" : "prompt");
        showBanner("Push notification permission was not granted.");
      }
    } catch {
      showBanner("Failed to enable push notifications.");
    }
    setIsSubscribingPush(false);
  };

  const handleTestPush = async () => {
    setPushTestMsg("Sending test alert...");
    try {
      const res = await fetch("/api/push/test", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setPushTestMsg("Alert sent! Check your system notification & audio.");
        setTimeout(() => setPushTestMsg(null), 6000);
      } else {
        setPushTestMsg(data.error || "Failed to trigger test.");
      }
    } catch {
      setPushTestMsg("Error triggering test push.");
    }
  };

  const showBanner = (text: string) => {
    setBanner(text);
    if (bannerTimeout.current) clearTimeout(bannerTimeout.current);
    bannerTimeout.current = setTimeout(() => setBanner(null), 8000);
  };

  const fetchAll = async () => {
    try {
      const res = await fetch("/api/chat/sessions");
      const data = await res.json();
      if (!data.sessions) {
        setStorageOk(false);
        return;
      }
      setStorageOk(true);
      const allSessions: Session[] = data.sessions || [];

      // Detect new waiting sessions
      const newWaiting = allSessions.filter(
        (s) => s.status === "waiting" && !prevWaitingIds.current.has(s.id)
      );
      if (newWaiting.length > 0) {
        playIncomingRing();
        const names = newWaiting.map((s) => s.visitorName).join(", ");
        flashTabTitle(`CALL: ${names}`);
        showBanner(`Incoming chat from ${names} — click Accept to connect.`);
        newWaiting.forEach((s) => prevWaitingIds.current.add(s.id));
      }

      setSessions(allSessions);

      // Fetch messages for active sessions
      const active = allSessions.filter((s) => s.status !== "ended");
      await Promise.all(
        active.map(async (sess) => {
          const mRes = await fetch(`/api/chat/messages?sessionId=${sess.id}`);
          const mData = await mRes.json();
          if (mData.messages) {
            setSessionMessages((prev) => ({ ...prev, [sess.id]: mData.messages }));
          }
        })
      );
    } catch {}
  };

  const acceptSession = async (sessionId: string) => {
    await fetch("/api/chat/sessions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, status: "active" }),
    });
    setActiveSessionId(sessionId);
    await fetchAll();
    await fetch("/api/chat/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, action: "mark_all_read" }),
    });
  };

  const endSession = async (sessionId: string) => {
    if (!confirm("End this chat session?")) return;
    await fetch("/api/chat/sessions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, status: "ended" }),
    });
    if (activeSessionId === sessionId) setActiveSessionId(null);
    await fetchAll();
  };

  const deleteSession = async (sessionId: string) => {
    await fetch("/api/chat/sessions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });
    if (activeSessionId === sessionId) setActiveSessionId(null);
    await fetchAll();
  };

  const sendReply = async () => {
    if (!replyText.trim() || !activeSessionId || isSending) return;
    setIsSending(true);
    try {
      await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: activeSessionId,
          text: replyText.trim(),
          sender: "owner",
          senderName: "Henry Mbalire",
        }),
      });
      setReplyText("");
      await fetchAll();
    } catch {}
    setIsSending(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!username.trim() || !password.trim()) {
      setLoginError("Enter both username and password.");
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
      setLoginError(result.error || "Invalid credentials.");
    }
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const formatAge = (iso: string) => {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  const waitingSessions = sessions.filter((s) => s.status === "waiting");
  const activeSessions = sessions.filter((s) => s.status === "active");
  const endedSessions = sessions.filter((s) => s.status === "ended");
  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const activeMessages = activeSessionId ? sessionMessages[activeSessionId] || [] : [];
  const totalUnread = sessions.reduce((acc, s) => acc + (s.unreadCount || 0), 0);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center" style={font}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#003087] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center px-4" style={font}>
        <div className="w-full max-w-[400px]">
          <div className="bg-[#003087] px-6 py-5 text-white text-center">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-[#003087] font-bold text-sm">MH</span>
            </div>
            <h1 className="text-lg font-semibold">Portfolio Administration</h1>
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
                  className="w-full border border-gray-300 text-gray-900 text-sm px-3 py-2.5 outline-none focus:border-[#003087] focus:ring-1 focus:ring-[#003087]"
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
                    setPwStrength(e.target.value ? validatePasswordStrength(e.target.value) : null);
                  }}
                  autoComplete="current-password"
                  className="w-full border border-gray-300 text-gray-900 text-sm px-3 py-2.5 outline-none focus:border-[#003087] focus:ring-1 focus:ring-[#003087]"
                />
                {pwStrength && (
                  <p className={`text-xs mt-1.5 ${pwStrength.valid ? "text-green-600" : "text-amber-600"}`}>
                    {pwStrength.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-[#003087] hover:bg-[#002070] text-white font-semibold py-3 text-sm transition-colors disabled:opacity-50 mt-2"
              >
                {isLoggingIn ? "Signing In..." : "Sign In"}
              </button>
            </form>
          </div>
          <div className="bg-gray-50 border border-t-0 border-gray-200 px-6 py-3 text-center">
            <p className="text-[11px] text-gray-400">Restricted to authorized personnel only.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col" style={font}>
      {/* Banner */}
      {banner && (
        <div className="bg-[#c8102e] text-white px-6 py-3 flex items-center justify-between text-sm font-medium flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse flex-shrink-0"></span>
            <span>{banner}</span>
          </div>
          <button onClick={() => setBanner(null)} className="text-red-200 hover:text-white text-xs ml-4">
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <header className="bg-[#003087] text-white border-b border-[#002070] flex-shrink-0">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#003087] font-bold text-xs">MH</span>
            </div>
            <div>
              <h1 className="font-semibold text-sm">Support Console</h1>
              <p className="text-blue-200 text-[11px]">Multi-Session Call Center</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Push notification control */}
            {pushStatus === "granted" ? (
              <div className="flex items-center gap-2 bg-[#002070] px-3 py-1 rounded text-xs border border-blue-400">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-blue-100">Tab-Closed Alerts Active</span>
                <button
                  onClick={handleTestPush}
                  className="text-xs text-white underline hover:text-blue-200 ml-1"
                >
                  Test
                </button>
              </div>
            ) : pushStatus === "prompt" ? (
              <button
                onClick={handleEnablePush}
                disabled={isSubscribingPush}
                className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors shadow-sm flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                </svg>
                <span>{isSubscribingPush ? "Activating..." : "Enable Tab-Closed Alerts"}</span>
              </button>
            ) : pushStatus === "denied" ? (
              <span className="text-red-300 text-xs bg-[#002070] px-2.5 py-1 rounded">
                Notifications Blocked in Browser
              </span>
            ) : null}

            {totalUnread > 0 && (
              <span className="bg-[#c8102e] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {totalUnread} Unread
              </span>
            )}

            <button
              onClick={async () => {
                await logoutUser();
                setIsAuthenticated(false);
              }}
              className="text-blue-200 hover:text-white text-xs border border-blue-400 px-3 py-1.5 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {pushTestMsg && (
          <div className="bg-[#002266] text-blue-200 px-6 py-1.5 text-xs text-center border-t border-blue-800">
            {pushTestMsg}
          </div>
        )}
      </header>

      {!storageOk && (
        <div className="bg-amber-50 border-b border-amber-300 px-6 py-3">
          <p className="text-amber-800 text-xs font-semibold">
            Chat storage not configured — add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to Vercel env vars, then redeploy.
          </p>
        </div>
      )}

      {/* Main Layout: Sidebar + Chat Area */}
      <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        {/* Sidebar: Sessions */}
        <div className="w-72 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 overflow-hidden">
          {/* Stats */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-amber-600">{waitingSessions.length}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">Waiting</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{activeSessions.length}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">Active</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-400">{endedSessions.length}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">Ended</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Waiting — incoming calls */}
            {waitingSessions.length > 0 && (
              <>
                <div className="px-4 py-2 bg-amber-50 border-b border-amber-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700">Incoming Calls</span>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                </div>
                {waitingSessions.map((s) => (
                  <div key={s.id} className="px-4 py-3 border-b border-gray-100 bg-amber-50 hover:bg-amber-100 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {s.visitorName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{s.visitorName}</p>
                          <p className="text-[11px] text-gray-500">{formatAge(s.createdAt)}</p>
                        </div>
                      </div>
                      <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse mt-1 flex-shrink-0"></span>
                    </div>
                    <button
                      onClick={() => acceptSession(s.id)}
                      className="w-full bg-[#003087] hover:bg-[#002070] text-white text-xs font-semibold py-1.5 transition-colors shadow-sm"
                    >
                      Answer Chat
                    </button>
                  </div>
                ))}
              </>
            )}

            {/* Active */}
            {activeSessions.length > 0 && (
              <>
                <div className="px-4 py-2 border-b border-gray-100">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-green-700">Active Chats</span>
                </div>
                {activeSessions.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setActiveSessionId(s.id);
                    }}
                    className={`px-4 py-3 border-b border-gray-100 cursor-pointer transition-colors ${
                      activeSessionId === s.id ? "bg-blue-50 border-l-4 border-l-[#003087]" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#003087] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {s.visitorName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{s.visitorName}</p>
                          <p className="text-[11px] text-gray-500">Active · {formatAge(s.lastActivity)}</p>
                        </div>
                      </div>
                      {s.unreadCount > 0 && (
                        <span className="bg-[#c8102e] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                          {s.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Ended */}
            {endedSessions.length > 0 && (
              <>
                <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Ended</span>
                </div>
                {endedSessions.map((s) => (
                  <div key={s.id} className="px-4 py-3 border-b border-gray-100 opacity-60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold flex-shrink-0">
                          {s.visitorName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">{s.visitorName}</p>
                          <p className="text-[11px] text-gray-400">Ended · {formatAge(s.lastActivity)}</p>
                        </div>
                      </div>
                      <button onClick={() => deleteSession(s.id)} className="text-[11px] text-red-400 hover:text-red-600 ml-2">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}

            {sessions.length === 0 && (
              <div className="px-4 py-12 text-center text-gray-400 text-sm">
                No chat requests yet. When a visitor starts a chat, it will appear here.
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!activeSession ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-gray-400 text-2xl font-light">–</span>
              </div>
              <p className="text-gray-600 font-semibold text-base">No Chat Selected</p>
              <p className="text-gray-400 text-sm mt-2 max-w-xs">
                {waitingSessions.length > 0
                  ? `${waitingSessions.length} visitor${waitingSessions.length > 1 ? "s are" : " is"} waiting — click "Answer Chat" to begin.`
                  : "Accept an incoming chat request from the sidebar to begin a conversation."}
              </p>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#003087] flex items-center justify-center text-white font-bold text-sm">
                    {activeSession.visitorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{activeSession.visitorName}</p>
                    <p className="text-[11px] text-gray-500">
                      {activeSession.status === "active" ? "Active session" : "Session ended"} · {formatAge(activeSession.lastActivity)}
                    </p>
                  </div>
                </div>
                {activeSession.status === "active" && (
                  <button
                    onClick={() => endSession(activeSession.id)}
                    className="text-xs text-red-600 border border-red-300 px-4 py-2 hover:bg-red-50 transition-colors font-semibold"
                  >
                    End Chat
                  </button>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto bg-[#f5f6f8] px-6 py-4 space-y-3">
                {activeMessages.length === 0 && (
                  <div className="text-center text-gray-400 text-sm mt-8">
                    No messages yet in this session.
                  </div>
                )}
                {activeMessages.map((msg, index) => {
                  const isClient = msg.sender === "client";
                  const showDate =
                    index === 0 ||
                    new Date(msg.timestamp).toDateString() !== new Date(activeMessages[index - 1].timestamp).toDateString();
                  return (
                    <div key={msg.id}>
                      {showDate && (
                        <div className="text-center text-[11px] text-gray-400 my-2 font-medium uppercase tracking-wider">
                          {new Date(msg.timestamp).toLocaleDateString([], {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      )}
                      <div className={`flex flex-col ${isClient ? "items-start" : "items-end"}`}>
                        <span className="text-[11px] text-gray-500 mb-1 px-1">{msg.senderName}</span>
                        <div
                          className={`max-w-[70%] px-4 py-2.5 text-sm leading-relaxed ${
                            isClient ? "bg-white border border-gray-200 text-gray-800" : "bg-[#003087] text-white"
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

              {/* Reply box */}
              {activeSession.status === "active" && (
                <div className="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0">
                  <div className="flex gap-3 items-start">
                    <textarea
                      ref={replyRef}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) sendReply();
                      }}
                      rows={2}
                      placeholder={`Reply to ${activeSession.visitorName}...`}
                      className="flex-1 border border-gray-300 text-gray-900 text-sm px-3 py-2.5 outline-none focus:border-[#003087] focus:ring-1 focus:ring-[#003087] resize-none"
                      style={font}
                    />
                    <button
                      onClick={sendReply}
                      disabled={!replyText.trim() || isSending}
                      className="bg-[#003087] hover:bg-[#002070] text-white px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-40 self-end"
                    >
                      {isSending ? "Sending..." : "Send"}
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">Ctrl+Enter to send</p>
                </div>
              )}

              {activeSession.status === "ended" && (
                <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 text-center flex-shrink-0">
                  <p className="text-gray-500 text-sm">This chat session has ended.</p>
                  <button onClick={() => deleteSession(activeSession.id)} className="text-red-500 text-xs mt-2 hover:text-red-700">
                    Remove from history
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
