import { NextRequest } from "next/server";
import { extractDocxText, normalizeText } from "@/lib/parsing";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
        return new Response(JSON.stringify({ error: "file manquant" }), { status: 400 });
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const text = file.name.endsWith(".txt") ? normalizeText(Buffer.from(buffer).toString("utf8")) : await extractDocxText(buffer);
    return Response.json({ text });
}


