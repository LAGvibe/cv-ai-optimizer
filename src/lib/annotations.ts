export type Anchor = { text: string; note: string; kind: "highlight" | "postit" | "badge" };

export function exampleAnchors(): Anchor[] {
    return [
        { text: "TypeScript", note: "Mettre en avant le stack TS/Node.", kind: "badge" },
        { text: "E2E", note: "Dire 'tests complets' pour être RH-friendly.", kind: "highlight" },
        { text: "LLM", note: "Mentionner interaction avec modèles.", kind: "postit" },
    ];
}


