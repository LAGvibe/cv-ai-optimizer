import { z } from "zod";

export const SuggestionSchema = z.object({
    summary: z.string().optional(),
    skills: z.object({
        add: z.array(z.string()).default([]),
        emphasize: z.array(z.string()).default([]),
        remove: z.array(z.string()).default([]),
    }),
    experiences: z
        .array(
            z.object({
                sectionTitle: z.string(),
                before: z.array(z.string()),
                after: z.array(z.string()),
                rationale: z.string().optional(),
            })
        )
        .default([]),
    wordingFixes: z
        .array(
            z.object({ before: z.string(), after: z.string(), reason: z.string().optional() })
        )
        .default([]),
});

export type Suggestion = z.infer<typeof SuggestionSchema>;

export const LetterSchema = z.object({ text: z.string() });


