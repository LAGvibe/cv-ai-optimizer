export async function extractPdfText(buffer: Buffer): Promise<string> {
    const { default: pdfParse } = await import("pdf-parse");
    const data = await pdfParse(buffer);
    return normalizeText(data.text || "");
}

export async function extractDocxText(buffer: Buffer): Promise<string> {
    const { default: mammoth } = await import("mammoth");
    const { value } = await mammoth.extractRawText({ buffer });
    return normalizeText(value || "");
}

export function normalizeText(input: string): string {
    return input
        .replace(/\r\n?|\n/g, "\n")
        .replace(/[\t ]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}


