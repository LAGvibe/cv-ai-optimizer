import { readFileSync } from 'fs';
import { join } from 'path';

const promptCache = new Map<string, string>();

export function loadPrompt(promptName: string): string {
    if (promptCache.has(promptName)) {
        return promptCache.get(promptName)!;
    }

    try {
        const promptPath = join(process.cwd(), 'prompts', `${promptName}.txt`);
        const promptContent = readFileSync(promptPath, 'utf-8');

        promptCache.set(promptName, promptContent);

        return promptContent;
    } catch (error) {
        console.error(`Erreur lors du chargement du prompt ${promptName}:`, error);
        throw new Error(`Impossible de charger le prompt: ${promptName}`);
    }
}

export function replacePromptVariables(prompt: string, variables: Record<string, string>): string {
    let result = prompt;

    for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        result = result.replace(regex, value);
    }

    return result;
}

export function getPrompt(promptName: string, variables: Record<string, string> = {}): string {
    const prompt = loadPrompt(promptName);
    return replacePromptVariables(prompt, variables);
}
