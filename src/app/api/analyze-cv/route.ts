import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { withRateLimit } from "@/lib/rate-limit";
import { CVAnalysisSchema } from "@/types/cv-analysis";
import { ZodError } from "zod";
import { getPrompt } from "@/lib/prompts";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MAX_RETRIES = 3;
const RETRY_BASE_DELAY = 1000;
const MAX_CV_CHARS = 3500;
const MAX_JOB_DESCRIPTION_CHARS = 2500;
const MAX_TOTAL_TOKENS = 10000;
const MAX_COMPLETION_TOKENS = 4000;

async function retryWithBackoff<T>(fn: () => Promise<T>) {
    let lastErr: any;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            return await fn();
        } catch (err: any) {
            lastErr = err;
            const msg = (err?.message ?? "") + " " + (err?.code ?? "");
            if (/(api key|authentication|invalid_request|quota|billing)/i.test(msg)) throw err;
            if (attempt === MAX_RETRIES) throw lastErr;
            await new Promise((r) => setTimeout(r, RETRY_BASE_DELAY * 2 ** attempt));
        }
    }
    throw lastErr;
}

async function analyzeCVHandler(request: NextRequest) {
    try {
        const { cvText, jobDescription } = await request.json();

        if (!cvText || !jobDescription)
            return NextResponse.json({ error: "CV et description du poste requis" }, { status: 400 });
        if (cvText.length < 50)
            return NextResponse.json({ error: "Le CV semble trop court" }, { status: 400 });
        if (jobDescription.length < 20)
            return NextResponse.json({ error: "La description du poste semble trop courte" }, { status: 400 });

        const truncateText = (text: string, max: number, label: string) => {
            if (text.length <= max) return text;
            console.warn(`[CV Analysis] ${label} tronqué de ${text.length} à ${max} caractères`);
            return `${text.slice(0, max)}\n\n[Texte tronqué pour ${label}]`;
        };

        const safeCvText = truncateText(cvText, MAX_CV_CHARS, "CV");
        const safeJobDescription = truncateText(jobDescription, MAX_JOB_DESCRIPTION_CHARS, "fiche de poste");

        const prompt = getPrompt("cv-analysis", {
            cvText: safeCvText,
            jobDescription: safeJobDescription,
            analysisDate: new Date().toISOString(),
        });

        console.log(`[CV Analysis] Start - CV: ${safeCvText.length} chars, JD: ${safeJobDescription.length} chars`);

        const completion = await retryWithBackoff(async () => {
            const start = Date.now();

            const resp = await client.chat.completions.create({
                model: "gpt-5-mini",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" },
                max_completion_tokens: MAX_COMPLETION_TOKENS,
                stream: false,
            });

            const duration = Date.now() - start;
            const used = resp.usage?.total_tokens ?? 0;
            console.log(`[CV Analysis] ${duration}ms - Tokens: ${used}`);
            if (resp.usage?.total_tokens && resp.usage.total_tokens > MAX_TOTAL_TOKENS) {
                console.warn("[CV Analysis] Réponse au-delà de la limite totale", {
                    totalTokens: resp.usage.total_tokens,
                    completionTokens: resp.usage.completion_tokens,
                    promptTokens: resp.usage.prompt_tokens,
                    maxTotalTokens: MAX_TOTAL_TOKENS,
                });
            }

            return resp;
        });

        const choice = completion.choices?.[0];
        const rawContent = choice?.message?.content;

        console.log("[CV Analysis] Choice debug", {
            finishReason: choice?.finish_reason,
            index: choice?.index,
            contentType: Array.isArray(rawContent) ? "array" : typeof rawContent,
            contentPreview: typeof rawContent === "string"
                ? rawContent.slice(0, 200)
                : JSON.stringify(rawContent)?.slice(0, 200),
        });

        let content: string | undefined;
        if (typeof rawContent === "string") {
            content = rawContent;
        } else if (Array.isArray(rawContent)) {
            content = (rawContent as Array<unknown>)
                .map((part) => {
                    if (typeof part === "string") return part;
                    if (part && typeof part === "object" && "text" in part && typeof (part as any).text === "string") {
                        return (part as any).text;
                    }
                    return "";
                })
                .join("")
                .trim();
        }

        if (!content) {
            if (choice?.finish_reason === "length") {
                console.warn("[CV Analysis] Réponse tronquée par la limite de tokens", {
                    totalTokens: completion.usage?.total_tokens,
                    completionTokens: completion.usage?.completion_tokens,
                    promptTokens: completion.usage?.prompt_tokens,
                    maxCompletionTokens: MAX_COMPLETION_TOKENS,
                });

                return NextResponse.json(
                    {
                        error: `La réponse de l'IA a dépassé ${MAX_COMPLETION_TOKENS} tokens de complétion. Réduisez la taille du CV ou des suggestions, ou relancez.`,
                    },
                    { status: 413 }
                );
            }

            throw new Error("Aucune réponse de l'IA");
        }

        if (completion.usage?.total_tokens && completion.usage.total_tokens > MAX_TOTAL_TOKENS) {
            console.warn("[CV Analysis] Réponse dépasse la limite totale", {
                totalTokens: completion.usage.total_tokens,
                completionTokens: completion.usage.completion_tokens,
                promptTokens: completion.usage.prompt_tokens,
                maxTotalTokens: MAX_TOTAL_TOKENS,
            });

            return NextResponse.json(
                {
                    error: `La réponse complète dépasse ${MAX_TOTAL_TOKENS} tokens. Réduisez le CV, l'offre ou laissez l'IA fournir moins de suggestions.`,
                },
                { status: 413 }
            );
        }

        const jsonResponse = JSON.parse(content);
        const analysis = CVAnalysisSchema.parse(jsonResponse);

        return NextResponse.json({
            success: true,
            analysis,
            timestamp: new Date().toISOString(),
            model: "gpt-5-mini",
            api: "chat.completions",
            version: "structured-v1",
        });
    } catch (error: any) {
        console.error("Erreur analyse CV:", error);
        const msg = (error?.message ?? "") + " " + (error?.code ?? "");

        if (error instanceof SyntaxError) {
            return NextResponse.json(
                { error: "Réponse JSON invalide du modèle." },
                { status: 502 }
            );
        }

        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: "Réponse du modèle inattendue. Merci de réessayer." },
                { status: 502 }
            );
        }

        if (/api key|authentication/i.test(msg))
            return NextResponse.json({ error: "Vérifiez OPENAI_API_KEY." }, { status: 500 });
        if (/quota|billing|rate[_\- ]?limit/i.test(msg))
            return NextResponse.json(
                { error: "Quota dépassé ou limite de taux atteinte." },
                { status: 402 }
            );
        if (/model|unsupported|gpt-5-mini/i.test(msg))
            return NextResponse.json(
                { error: "Modèle indisponible. Réessayez plus tard ou basculez sur un fallback." },
                { status: 503 }
            );
        if (/context_length|token/i.test(msg))
            return NextResponse.json(
                { error: "Le CV ou l'offre est trop long(ue). Réduisez la taille." },
                { status: 400 }
            );

        return NextResponse.json({ error: "Erreur lors de l'analyse du CV" }, { status: 500 });
    }
}

export const POST = withRateLimit(analyzeCVHandler);
