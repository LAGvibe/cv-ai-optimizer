import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialiser OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { cvText, jobDescription } = body;

        // Validation des inputs
        if (!cvText || !jobDescription) {
            return NextResponse.json(
                { error: 'CV et description du poste requis' },
                { status: 400 }
            );
        }

        if (cvText.length < 50) {
            return NextResponse.json(
                { error: 'Le CV semble trop court' },
                { status: 400 }
            );
        }

        if (jobDescription.length < 20) {
            return NextResponse.json(
                { error: 'La description du poste semble trop courte' },
                { status: 400 }
            );
        }

        // Prompt pour l'analyse
        const prompt = `
Tu es un expert en recrutement et en optimisation de CV. Analyse ce CV par rapport à cette offre d'emploi et fournis des suggestions concrètes.

CV du candidat :
${cvText}

Offre d'emploi :
${jobDescription}

Fournis ton analyse au format JSON avec cette structure :
{
  "score": 85,
  "summary": "Résumé de l'analyse en 2-3 phrases",
  "strengths": ["Point fort 1", "Point fort 2", "Point fort 3"],
  "weaknesses": ["Point faible 1", "Point faible 2"],
  "suggestions": [
    {
      "type": "add|remove|improve|rewrite",
      "section": "nom de la section",
      "text": "texte concerné",
      "suggestion": "suggestion détaillée",
      "priority": "high|medium|low"
    }
  ],
  "missingSkills": ["Compétence manquante 1", "Compétence manquante 2"],
  "improvementPotential": 25
}

Types de suggestions :
- "add" : Ajouter quelque chose
- "remove" : Supprimer quelque chose
- "improve" : Améliorer quelque chose d'existant
- "rewrite" : Réécrire complètement

Priorités :
- "high" : Critique pour le poste
- "medium" : Important mais pas bloquant
- "low" : Amélioration mineure

Réponds UNIQUEMENT avec le JSON, sans texte supplémentaire.
`;

        // Appel à l'API OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "Tu es un expert en recrutement. Réponds toujours au format JSON demandé."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.3,
            max_tokens: 2000,
        });

        const responseText = completion.choices[0]?.message?.content;

        if (!responseText) {
            throw new Error('Aucune réponse de l\'IA');
        }

        // Parser la réponse JSON
        let analysisResult;
        try {
            analysisResult = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Erreur parsing JSON:', parseError);
            console.error('Réponse IA:', responseText);
            throw new Error('Format de réponse invalide de l\'IA');
        }

        // Validation de la structure
        if (!analysisResult.score || !analysisResult.suggestions) {
            throw new Error('Structure de réponse incomplète');
        }

        return NextResponse.json({
            success: true,
            analysis: analysisResult,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Erreur analyse CV:', error);

        // Gestion des erreurs spécifiques
        if (error instanceof Error) {
            if (error.message.includes('API key')) {
                return NextResponse.json(
                    { error: 'Configuration API invalide' },
                    { status: 500 }
                );
            }

            if (error.message.includes('quota') || error.message.includes('billing')) {
                return NextResponse.json(
                    { error: 'Quota API dépassé' },
                    { status: 429 }
                );
            }
        }

        return NextResponse.json(
            { error: 'Erreur lors de l\'analyse du CV' },
            { status: 500 }
        );
    }
}
