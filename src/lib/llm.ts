import OpenAI from "openai";
import { SuggestionSchema } from "./schema";

function getOpenAI(): OpenAI {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("Missing OPENAI_API_KEY");
    }
    return new OpenAI({ apiKey });
}

export async function generateSuggestions(resumeText: string, jobText: string) {
    const system =
        "Tu es un Career Coach et Ingénieur Full-Stack. Tu aides à adapter un CV à une offre sans modifier la mise en page du PDF : tu fournis des suggestions concrètes (avant/après, compétences à ajouter/mettre en avant/retirer, micro-réécritures). Tu n’inventes pas de faits. Tu reformules, réorganises, compactes, précises des métriques si elles existent déjà ; sinon, propose des placeholders encadrés [À compléter : ...]. Réponds exclusivement en JSON valide selon le schéma.";

    const user = `Voici \`resumeText\` (---) et \`jobText\` (===). Renvoie STRICTEMENT le JSON demandé.\n---\n${resumeText}\n===\n${jobText}`;

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const response = await getOpenAI().chat.completions.create({
        model,
        messages: [
            { role: "system", content: system },
            { role: "user", content: user },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" },
    });

    const raw = response.choices[0]?.message?.content || "{}";
    let parsed: unknown;
    try {
        parsed = JSON.parse(raw);
    } catch {
        // Retry once without forcing format
        const retry = await getOpenAI().chat.completions.create({
            model,
            messages: [
                { role: "system", content: system },
                { role: "user", content: user + "\nRéponds uniquement en JSON conforme au schéma." },
            ],
            temperature: 0.2,
        });
        const raw2 = retry.choices[0]?.message?.content || "{}";
        parsed = JSON.parse(raw2);
    }

    return SuggestionSchema.parse(parsed);
}

export async function generateLetter(resumeText: string, jobText: string, meta?: { company?: string; role?: string; city?: string }) {
    const system =
        "Tu es un Rédacteur produit. Tu écris une lettre qui relie l’expérience au poste visé, sans exagération, sans inventer des faits. 200–300 mots, texte continu, style clair, phrases courtes, verbe d’action.";
    const user = `Rédige une lettre 200–300 mots en français, selon la structure attendue.\nVariables utiles:\n- company: ${meta?.company || ""}\n- role: ${meta?.role || ""}\n- city: ${meta?.city || ""}\nContexte CV:\n${resumeText}\nContexte Offre:\n${jobText}`;

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
    const response = await getOpenAI().chat.completions.create({
        model,
        messages: [
            { role: "system", content: system },
            { role: "user", content: user },
        ],
        temperature: 0.5,
    });
    return response.choices[0]?.message?.content?.trim() || "";
}


