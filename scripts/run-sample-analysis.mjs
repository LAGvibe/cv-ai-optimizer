import fs from "fs/promises";
import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pdf from "pdf-parse";
import OpenAI from "openai";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const CV_PATH = path.join(ROOT_DIR, "public", "CV_Louis_Potron_2025.pdf");
const JD_PATH = path.join(ROOT_DIR, "test", "data", "job-description.txt");
const PROMPT_PATH = path.join(ROOT_DIR, "prompts", "cv-analysis.txt");
const ENV_PATH = path.join(ROOT_DIR, ".env.local");

const MAX_CV_CHARS = 3500;
const MAX_JD_CHARS = 2500;
const MAX_TOTAL_TOKENS = 4000;
const DRY_RUN = process.argv.includes("--dry-run");
const MAX_COMPLETION_TOKENS = 1500;

function loadEnvFromFile(filePath) {
    if (!existsSync(filePath)) return;

    const raw = readFileSync(filePath, "utf-8");
    const lines = raw.split(/\r?\n/);

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;

        const eqIndex = trimmed.indexOf("=");
        if (eqIndex === -1) continue;

        const key = trimmed.slice(0, eqIndex).trim();
        if (!key) continue;

        let value = trimmed.slice(eqIndex + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }

        if (!(key in process.env)) {
            process.env[key] = value;
        }
    }
}

loadEnvFromFile(ENV_PATH);

const CVSuggestionSchema = z.object({
    type: z.enum(["add", "remove", "improve", "rewrite", "correct"]),
    section: z.string().min(1, "Section is required"),
    text: z.string().min(1, "Text is required"),
    suggestion: z.string().min(10, "Suggestion must be at least 10 characters"),
    priority: z.enum(["critique", "important", "recommandé", "optionnel"]),
    rationale: z.string().nullable().optional(),
    impact: z.string().nullable().optional(),
    exactReplacement: z.string().nullable().optional(),
});

const DetailedMetricsSchema = z.object({
    experience: z.object({
        score: z.number().min(0).max(10),
        maxScore: z.literal(10),
        comment: z.string().min(1),
    }),
    education: z.object({
        score: z.number().min(0).max(10),
        maxScore: z.literal(10),
        comment: z.string().min(1),
    }),
    softSkills: z.object({
        score: z.number().min(0).max(10),
        maxScore: z.literal(10),
        comment: z.string().min(1),
    }),
    technicalSkills: z.object({
        score: z.number().min(0).max(10),
        maxScore: z.literal(10),
        comment: z.string().min(1),
    }),
});

const CVAnalysisSchema = z.object({
    score: z.number().min(0).max(100, "Score must be between 0 and 100"),
    summary: z.string().min(20, "Summary must be at least 20 characters"),
    strengths: z.array(z.string().min(1)).min(1, "At least one strength is required"),
    weaknesses: z.array(z.string().min(1)).min(1, "At least one weakness is required"),
    suggestions: z.array(CVSuggestionSchema).min(1, "At least one suggestion is required").max(10, "Maximum 10 suggestions allowed"),
    missingSkills: z.array(z.string().min(1)).default([]),
    improvementPotential: z.number().min(0).max(100, "Improvement potential must be between 0 and 100"),
    analysisDate: z.string().nullable(),
    jobMatch: z
        .object({
            technicalMatch: z.number().min(0).max(100),
            experienceMatch: z.number().min(0).max(100),
            softSkillsMatch: z.number().min(0).max(100),
        })
        .nullable()
        .optional(),
    detailedMetrics: DetailedMetricsSchema.nullable().optional(),
});

async function loadPdfText(pdfPath) {
    const buffer = await fs.readFile(pdfPath);
    const parsed = await pdf(buffer);
    const cleaned = parsed.text
        .replace(/\s+/g, " ")
        .replace(/\n\s*\n/g, "\n\n")
        .trim();
    return { text: cleaned, pages: parsed.numpages ?? null };
}

async function loadJobDescriptionText(filePath) {
    const content = await fs.readFile(filePath, "utf-8");
    return content.replace(/\r\n/g, "\n").trim();
}

function truncateText(text, maxChars, label) {
    if (text.length <= maxChars) return text;
    console.warn(`[run-sample-analysis] ${label} tronqué de ${text.length} à ${maxChars} caractères.`);
    return `${text.slice(0, maxChars)}\n\n[Texte tronqué pour ${label}]`;
}

function replacePromptVariables(prompt, variables) {
    let result = prompt;
    for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`{{${key}}}`, "g");
        result = result.replace(regex, value);
    }
    return result;
}

async function main() {
    if (!process.env.OPENAI_API_KEY && !DRY_RUN) {
        console.error("Erreur: OPENAI_API_KEY n'est pas défini dans l'environnement.");
        process.exitCode = 1;
        return;
    }

    console.log("[run-sample-analysis] Chargement du CV...");
    const parseStart = Date.now();
    const cvData = await loadPdfText(CV_PATH);
    const parseDuration = Date.now() - parseStart;
    const cvText = truncateText(cvData.text, MAX_CV_CHARS, "le CV");
    console.log(`[run-sample-analysis] CV: ${cvText.length} caractères (pages: ${cvData.pages ?? "inconnues"}).`);
    console.log(` POST /api/parse/pdf 200 in ${parseDuration}ms`);

    console.log("[run-sample-analysis] Chargement de la fiche de poste...");
    const jdRaw = await loadJobDescriptionText(JD_PATH);
    const jobDescription = truncateText(jdRaw, MAX_JD_CHARS, "la fiche de poste");
    console.log(`[run-sample-analysis] Offre: ${jobDescription.length} caractères.`);

    const compileStart = Date.now();
    const promptTemplate = await fs.readFile(PROMPT_PATH, "utf-8");
    const prompt = replacePromptVariables(promptTemplate, {
        cvText,
        jobDescription,
        analysisDate: new Date().toISOString(),
    });
    const compileDuration = Date.now() - compileStart;
    console.log(` ✓ Compiled /api/analyze-cv in ${compileDuration}ms`);

    console.log(`[run-sample-analysis] Longueur du prompt: ${prompt.length} caractères.`);
    console.log(`[CV Analysis] Start - CV: ${cvText.length} chars, JD: ${jobDescription.length} chars`);

    if (DRY_RUN) {
        console.log("[run-sample-analysis] Mode dry-run : aucune requête OpenAI envoyée.");
        console.log("Aperçu prompt (500 premiers caractères):");
        console.log(prompt.slice(0, 500));
        return;
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const inferenceStart = Date.now();
    const response = await client.chat.completions.create({
        model: "gpt-5-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_completion_tokens: MAX_COMPLETION_TOKENS,
    });
    const inferenceDuration = Date.now() - inferenceStart;

    const usage = response.usage ?? {};
    console.log(`[run-sample-analysis] Tokens utilisés - prompt: ${usage.prompt_tokens}, completion: ${usage.completion_tokens}, total: ${usage.total_tokens}`);
    console.log(`[CV Analysis] ${inferenceDuration}ms - Tokens: ${usage.total_tokens}`);

    if (usage.total_tokens && usage.total_tokens > MAX_TOTAL_TOKENS) {
        console.warn("[run-sample-analysis] Réponse au-delà de la limite totale", {
            totalTokens: usage.total_tokens,
            completionTokens: usage.completion_tokens,
            promptTokens: usage.prompt_tokens,
            maxTotalTokens: MAX_TOTAL_TOKENS,
        });
        throw new Error(
            `La réponse dépasse la limite globale de ${MAX_TOTAL_TOKENS} tokens. ` +
                "Réduis la taille du CV ou de la fiche de poste, ou laisse l'IA fournir moins de suggestions."
        );
    }

    const choice = response.choices?.[0];
    console.log("[CV Analysis] Choice debug", {
        finishReason: choice?.finish_reason,
        index: choice?.index,
        contentType: typeof choice?.message?.content,
        contentPreview:
            typeof choice?.message?.content === "string"
                ? choice.message.content.slice(0, 200)
                : undefined,
    });
    if (choice?.finish_reason === "length") {
        console.warn("[run-sample-analysis] Attention: la réponse a été tronquée par la limite de tokens.");
        throw new Error(
            `La réponse a dépassé la limite de ${MAX_COMPLETION_TOKENS} tokens. ` +
                "Augmente MAX_COMPLETION_TOKENS ou raccourcis le CV / la fiche de poste avant de relancer."
        );
    }

    const content = choice?.message?.content;
    if (!content) {
        throw new Error("Réponse vide renvoyée par l'API OpenAI.");
    }

    const parsed = JSON.parse(content);
    const validated = CVAnalysisSchema.parse(parsed);

    console.log("[run-sample-analysis] Analyse réussie. Aperçu:");
    console.log(JSON.stringify(
        {
            score: validated.score,
            summary: validated.summary,
            strengths: validated.strengths,
            weaknesses: validated.weaknesses,
            suggestions: validated.suggestions.map((sugg) => ({
                section: sugg.section,
                priority: sugg.priority,
                type: sugg.type,
            })),
        },
        null,
        2
    ));

    await fs.writeFile(
        path.join(ROOT_DIR, "test", "data", "sample-analysis-output.json"),
        JSON.stringify(validated, null, 2),
        "utf-8"
    );

    console.log("[run-sample-analysis] Résultat complet enregistré dans test/data/sample-analysis-output.json");
}

main().catch((error) => {
    console.error("[run-sample-analysis] Échec:", error);
    process.exitCode = 1;
});
