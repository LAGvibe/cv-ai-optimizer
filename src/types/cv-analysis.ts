import { z } from 'zod';
export const CVSuggestionSchema = z.object({
    type: z.enum(['add', 'remove', 'improve', 'rewrite', 'correct']),
    section: z.string().min(1, 'Section is required'),
    text: z.string().min(1, 'Text is required'),
    suggestion: z.string().min(10, 'Suggestion must be at least 10 characters'),
    priority: z.enum(['critique', 'important', 'recommandé', 'optionnel']),
    rationale: z.string().nullable().optional(),
    impact: z.string().nullable().optional(),
    exactReplacement: z.string().nullable().optional(),
});

export const DetailedMetricsSchema = z.object({
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

export const CVAnalysisSchema = z.object({
    score: z.number().min(0).max(100, 'Score must be between 0 and 100'),
    summary: z.string().min(20, 'Summary must be at least 20 characters'),
    strengths: z.array(z.string().min(1)).min(1, 'At least one strength is required'),
    weaknesses: z.array(z.string().min(1)).min(1, 'At least one weakness is required'),
    suggestions: z.array(CVSuggestionSchema).min(1, 'At least one suggestion is required').max(10, 'Maximum 10 suggestions allowed'),
    missingSkills: z.array(z.string().min(1)).default([]),
    improvementPotential: z.number().min(0).max(100, 'Improvement potential must be between 0 and 100'),
    analysisDate: z.string().nullable(),
    jobMatch: z.object({
        technicalMatch: z.number().min(0).max(100),
        experienceMatch: z.number().min(0).max(100),
        softSkillsMatch: z.number().min(0).max(100),
    }).nullable().optional(),
    detailedMetrics: DetailedMetricsSchema.nullable().optional(),
});

export type CVSuggestion = z.infer<typeof CVSuggestionSchema>;
export type CVAnalysis = z.infer<typeof CVAnalysisSchema>;
export type DetailedMetrics = z.infer<typeof DetailedMetricsSchema>;

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
    pages?: number;
    timestamp: string;
}

export interface AnalysisError {
    error: string;
}
