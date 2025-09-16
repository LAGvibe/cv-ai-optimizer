import { AnalysisResponse, TextExtractionResponse, AnalysisError } from '@/types/cv-analysis';

export async function extractTextFromFile(file: File): Promise<TextExtractionResponse> {
    const formData = new FormData();
    formData.append('file', file);

    // Only support PDF files
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
        throw new Error(errorData.error || 'Erreur lors de l\'analyse du CV');
    }

    return response.json();
}
