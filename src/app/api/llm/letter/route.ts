import { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";
import { generateLetter } from "@/lib/llm";

export const runtime = "nodejs";

const redis = process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_TOKEN
    ? new Redis({ url: process.env.UPSTASH_REDIS_URL, token: process.env.UPSTASH_REDIS_TOKEN })
    : undefined;

const ratelimit = redis
    ? new Ratelimit({ redis, limiter: Ratelimit.fixedWindow(5, "7 d"), analytics: true, prefix: "cvopt" })
    : undefined;

const BodySchema = z.object({
    resumeText: z.string(),
    jobText: z.string(),
    company: z.string().optional(),
    role: z.string().optional(),
    city: z.string().optional(),
});

export async function POST(req: NextRequest) {
    if (!process.env.OPENAI_API_KEY) {
        return new Response(JSON.stringify({ error: "OPENAI_API_KEY manquant" }), { status: 500 });
    }
    if (ratelimit) {
        const fwd = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "anon";
        const ip = fwd.split(",")[0]?.trim() || "anon";
        const { success } = await ratelimit.limit(`letter:${ip}`);
        if (!success) return new Response("Too Many Requests", { status: 429 });
    }

    const json = await req.json();
    const { resumeText, jobText, company, role, city } = BodySchema.parse(json);

    try {
        const text = await generateLetter(resumeText, jobText, { company, role, city });
        return Response.json({ text });
    } catch (e) {
        const message = e instanceof Error ? e.message : "LLM error";
        return new Response(JSON.stringify({ error: message }), { status: 500 });
    }
}


