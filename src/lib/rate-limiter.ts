import { NextRequest, NextResponse } from "next/server";

const WINDOW_SIZE = 60 * 1000; // 1 minute
const MAX_REQUESTS = 50;

type RequestCount = {
  count: number;
  resetTime: number;
};

const ipRequestCounts = new Map<string, RequestCount>();

export function rateLimiter(req: NextRequest) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0] : "unknown";
  const now = Date.now();
  const requestCount = ipRequestCounts.get(ip) ?? {
    count: 0,
    resetTime: now + WINDOW_SIZE,
  };

  if (now > requestCount.resetTime) {
    requestCount.count = 1;
    requestCount.resetTime = now + WINDOW_SIZE;
  } else {
    requestCount.count++;
  }

  ipRequestCounts.set(ip, requestCount);

  if (requestCount.count > MAX_REQUESTS) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  return null;
}
