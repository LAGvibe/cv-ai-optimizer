export interface CVAnalysis {
    score: number;
    summary: string;
    strengths: string[];
    weaknesses: string[];
    suggestions: CVSuggestion[];
    missingSkills: string[];
    improvementPotential: number;
}

export interface CVSuggestion {
    type: 'add' | 'remove' | 'improve' | 'rewrite';
    section: string;
    text: string;
    suggestion: string;
    priority: 'high' | 'medium' | 'low';
}

export interface AnalysisResponse {
    success: boolean;
    analysis: CVAnalysis;
    timestamp: string;
}

export interface TextExtractionResponse {
    success: boolean;
    text: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    textLength: number;
    timestamp: string;
}

export interface AnalysisError {
    error: string;
}
