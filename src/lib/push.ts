import webpush from "web-push";
import { Redis } from "@upstash/redis";

interface VapidKeys {
  publicKey: string;
  privateKey: string;
}

const VAPID_STORAGE_KEY = "henry_vapid_keys";
const SUBS_STORAGE_KEY = "henry_admin_push_subscriptions";

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function getVapidKeys(): Promise<VapidKeys | null> {
  // Check env first
  const envPublic = process.env.VAPID_PUBLIC_KEY;
  const envPrivate = process.env.VAPID_PRIVATE_KEY;
  if (envPublic && envPrivate) {
    return { publicKey: envPublic, privateKey: envPrivate };
  }

  // Check Redis
  const redis = getRedis();
  if (!redis) return null;

  try {
    const existing = await redis.get<VapidKeys>(VAPID_STORAGE_KEY);
    if (existing?.publicKey && existing?.privateKey) {
      return existing;
    }

    // Generate new pair and persist in Redis
    const newKeys = webpush.generateVAPIDKeys();
    await redis.set(VAPID_STORAGE_KEY, newKeys);
    return newKeys;
  } catch (err) {
    console.error("Failed to get/generate VAPID keys:", err);
    return null;
  }
}

export async function getPushSubscriptions(): Promise<webpush.PushSubscription[]> {
  const redis = getRedis();
  if (!redis) return [];
  try {
    const list = await redis.get<webpush.PushSubscription[]>(SUBS_STORAGE_KEY);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export async function savePushSubscription(sub: webpush.PushSubscription): Promise<boolean> {
  const redis = getRedis();
  if (!redis || !sub?.endpoint) return false;

  try {
    const subs = await getPushSubscriptions();
    const filtered = subs.filter((s) => s.endpoint !== sub.endpoint);
    filtered.push(sub);
    await redis.set(SUBS_STORAGE_KEY, filtered);
    return true;
  } catch (err) {
    console.error("Failed to save push subscription:", err);
    return false;
  }
}

export async function removePushSubscription(endpoint: string): Promise<void> {
  const redis = getRedis();
  if (!redis || !endpoint) return;
  try {
    const subs = await getPushSubscriptions();
    const filtered = subs.filter((s) => s.endpoint !== endpoint);
    await redis.set(SUBS_STORAGE_KEY, filtered);
  } catch {}
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
  sessionId?: string;
}

export async function sendPushToAdmins(payload: PushPayload): Promise<{ sent: number; failed: number }> {
  const keys = await getVapidKeys();
  if (!keys) return { sent: 0, failed: 0 };

  webpush.setVapidDetails(
    "mailto:contact@mbalirehenry.online",
    keys.publicKey,
    keys.privateKey
  );

  const subs = await getPushSubscriptions();
  if (subs.length === 0) return { sent: 0, failed: 0 };

  const messageString = JSON.stringify(payload);
  let sent = 0;
  let failed = 0;

  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(sub, messageString);
        sent++;
      } catch (err: unknown) {
        failed++;
        const statusCode = (err as { statusCode?: number })?.statusCode;
        // If expired or invalid, prune it
        if (statusCode === 404 || statusCode === 410) {
          await removePushSubscription(sub.endpoint);
        }
      }
    })
  );

  return { sent, failed };
}
