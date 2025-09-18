import { AnalysisResponse, TextExtractionResponse, AnalysisError } from '@/types/cv-analysis';

export async function extractTextFromFile(file: File): Promise<TextExtractionResponse> {
    const formData = new FormData();
    formData.append('file', file);

    if (file.type !== 'application/pdf') {
        throw new Error('Seuls les fichiers PDF sont acceptés');
    }

    const response = await fetch('/api/parse/pdf', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData: AnalysisError = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'extraction du texte');
    }

    return response.json();
}

export async function analyzeCV(cvText: string, jobDescription: string): Promise<AnalysisResponse> {
    const response = await fetch('/api/analyze-cv', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            cvText,
            jobDescription,
        }),
    });

    if (!response.ok) {
        const errorData: AnalysisError = await response.json();

        if (response.status === 429) {
            const resetTime = response.headers.get('X-RateLimit-Reset');

            let errorMessage = errorData.error || 'Quota dépassé';

            if (resetTime) {
                const timeUntilReset = Math.ceil((parseInt(resetTime) - Date.now()) / (1000 * 60 * 60 * 24));
                errorMessage += `. Prochaine analyse disponible dans ${timeUntilReset} jour(s).`;
            }

            throw new Error(errorMessage);
        }

        if (response.status === 402) {
            throw new Error(errorData.error || 'Quota OpenAI dépassé. Veuillez vérifier votre compte OpenAI.');
        }

        throw new Error(errorData.error || 'Erreur lors de l\'analyse du CV');
    }

    if (process.env.NODE_ENV === 'development') {
        const devMode = response.headers.get('X-Dev-Mode');
        const devIP = response.headers.get('X-Dev-IP');
        const devCount = response.headers.get('X-Dev-Request-Count');
        const remaining = response.headers.get('X-RateLimit-Remaining');

        if (devMode === 'true') {
            console.log('🔧 [DEV] Rate Limit Debug Info:', {
                ip: devIP,
                requestsUsed: devCount,
                remaining: remaining,
                mode: 'development (no blocking)'
            });
        }
    }

    return response.json();
}
