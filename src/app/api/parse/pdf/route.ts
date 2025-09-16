import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'Aucun fichier fourni' },
                { status: 400 }
            );
        }

        // Validation du type de fichier PDF
        if (file.type !== 'application/pdf') {
            return NextResponse.json(
                { error: 'Type de fichier non supporté. Format accepté: PDF' },
                { status: 400 }
            );
        }

        // Validation de la taille (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'Fichier trop volumineux. Taille maximum: 10MB' },
                { status: 400 }
            );
        }

        // Pour l'instant, on simule l'extraction PDF avec un texte d'exemple
        // TODO: Implémenter une vraie extraction PDF avec pdf-parse ou pdf2pic
        const mockExtractedText = `LOUIS POTRON
Développeur Full Stack

CONTACT
Email: louis.potron@email.com
Téléphone: +33 6 12 34 56 78
LinkedIn: linkedin.com/in/louispotron

PROFIL PROFESSIONNEL
Développeur passionné avec 3 ans d'expérience dans le développement web moderne. 
Expert en React, Node.js et TypeScript. Passionné par les technologies émergentes 
et l'amélioration continue des processus de développement.

EXPÉRIENCE PROFESSIONNELLE

Développeur Full Stack - TechCorp (2022-2024)
• Développement d'applications web avec React et Node.js
• Gestion d'équipe de 3 développeurs
• Mise en place de CI/CD avec GitHub Actions
• Optimisation des performances (réduction de 40% du temps de chargement)

Développeur Frontend - StartupXYZ (2021-2022)
• Développement d'interfaces utilisateur avec React et TypeScript
• Intégration d'APIs REST et GraphQL
• Collaboration avec les équipes UX/UI

COMPÉTENCES TECHNIQUES
• Langages: JavaScript, TypeScript, Python, SQL
• Frontend: React, Next.js, Vue.js, HTML5, CSS3, Tailwind CSS
• Backend: Node.js, Express, FastAPI, PostgreSQL, MongoDB
• Outils: Git, Docker, AWS, Vercel, Figma

FORMATION
Master en Informatique - Université de Paris (2019-2021)
Licence en Mathématiques - Université de Paris (2016-2019)

PROJETS PERSONNELS
• Application de gestion de tâches avec React et Node.js
• API REST pour e-commerce avec authentification JWT
• Dashboard analytique avec D3.js et Chart.js`;

        return NextResponse.json({
            success: true,
            text: mockExtractedText,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            textLength: mockExtractedText.length,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Erreur route PDF:', error);

        return NextResponse.json(
            { error: 'Erreur lors du traitement du fichier PDF' },
            { status: 500 }
        );
    }
}
