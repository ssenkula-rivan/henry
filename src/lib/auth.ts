// Client-safe authentication utilities that communicate with backend API routes

export interface AuthSession {
  authenticated: boolean;
  user?: string;
}

export async function loginUser(username: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Authentication failed" };
    }

    if (typeof window !== "undefined") {
      sessionStorage.setItem("admin_auth", "true");
      if (data.token) {
        sessionStorage.setItem("admin_token", data.token);
      }
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: "Network error or server unavailable" };
  }
}

export async function checkAuthSession(): Promise<boolean> {
  try {
    const res = await fetch("/api/auth/session");
    if (res.ok) {
      const data = await res.json();
      return Boolean(data.authenticated);
    }
  } catch (e) {
    console.error("Session check failed:", e);
  }

  // Fallback to sessionStorage if cookie check failed
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("admin_auth") === "true";
  }
  return false;
}

export async function logoutUser(): Promise<void> {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch (e) {
    console.error("Logout request error:", e);
  }

  if (typeof window !== "undefined") {
    sessionStorage.removeItem("admin_auth");
    sessionStorage.removeItem("admin_token");
  }
}

export function validatePasswordStrength(password: string): { valid: boolean; message: string } {
  if (password.length < 12) {
    return { valid: false, message: "Password must be at least 12 characters long" };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one uppercase letter" };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one lowercase letter" };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Password must contain at least one number" };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, message: "Password must contain at least one special character" };
  }
  return { valid: true, message: "Password strength: strong" };
}
