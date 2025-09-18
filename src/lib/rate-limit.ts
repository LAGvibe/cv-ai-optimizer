import { NextRequest } from 'next/server';

interface RateLimitData {
    count: number;
    resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitData>();

const RATE_LIMIT_CONFIG = {
    maxRequests: 5,
    windowMs: 30 * 24 * 60 * 60 * 1000,
    message: 'Quota dépassé. Limite de 5 analyses par mois par IP.',
};

const isDev = process.env.NODE_ENV === 'development';

function getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const cfConnectingIP = request.headers.get('cf-connecting-ip');

    if (cfConnectingIP) return cfConnectingIP;
    if (realIP) return realIP;
    if (forwarded) return forwarded.split(',')[0].trim();

    return 'unknown';
}

function cleanupExpiredEntries(): void {
    const now = Date.now();
    for (const [key, data] of rateLimitStore.entries()) {
        if (data.resetTime < now) {
            rateLimitStore.delete(key);
        }
    }
}

export function checkRateLimit(request: NextRequest): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
    message?: string;
} {
    const clientIP = getClientIP(request);
    const now = Date.now();

    if (Math.random() < 0.1) {
        cleanupExpiredEntries();
    }

    let data = rateLimitStore.get(clientIP);

    if (!data || data.resetTime < now) {
        data = {
            count: 0,
            resetTime: now + RATE_LIMIT_CONFIG.windowMs,
        };
    }

    if (data.count >= RATE_LIMIT_CONFIG.maxRequests) {
        return {
            allowed: false,
            remaining: 0,
            resetTime: data.resetTime,
            message: RATE_LIMIT_CONFIG.message,
        };
    }

    data.count++;
    rateLimitStore.set(clientIP, data);

    return {
        allowed: true,
        remaining: RATE_LIMIT_CONFIG.maxRequests - data.count,
        resetTime: data.resetTime,
    };
}

export function withRateLimit(handler: (request: NextRequest) => Promise<Response>) {
    return async (request: NextRequest) => {
        const rateLimitResult = checkRateLimit(request);

        if (!isDev && !rateLimitResult.allowed) {
            return new Response(
                JSON.stringify({
                    error: rateLimitResult.message,
                    resetTime: rateLimitResult.resetTime,
                    remaining: rateLimitResult.remaining,
                }),
                {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-RateLimit-Limit': RATE_LIMIT_CONFIG.maxRequests.toString(),
                        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                        'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
                        'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
                    },
                }
            );
        }

        const response = await handler(request);

        if (response instanceof Response) {
            response.headers.set('X-RateLimit-Limit', RATE_LIMIT_CONFIG.maxRequests.toString());
            response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
            response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString());

            if (isDev) {
                response.headers.set('X-Dev-Mode', 'true');
                response.headers.set('X-Dev-IP', getClientIP(request));
                response.headers.set('X-Dev-Request-Count', rateLimitResult.remaining.toString());
            }
        }

        return response;
    };
}

export function getRateLimitStats(): {
    totalIPs: number;
    activeIPs: number;
    storeSize: number;
} {
    const now = Date.now();
    let activeIPs = 0;

    for (const data of rateLimitStore.values()) {
        if (data.resetTime > now) {
            activeIPs++;
        }
    }

    return {
        totalIPs: rateLimitStore.size,
        activeIPs,
        storeSize: rateLimitStore.size,
    };
}

export function resetRateLimitForIP(ip: string): boolean {
    return rateLimitStore.delete(ip);
}

export function getIPRateLimitInfo(ip: string): RateLimitData | null {
    const data = rateLimitStore.get(ip);
    if (!data || data.resetTime < Date.now()) {
        return null;
    }
    return data;
}
