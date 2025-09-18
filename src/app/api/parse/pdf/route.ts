import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse';

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

        if (file.type !== 'application/pdf') {
            return NextResponse.json(
                { error: 'Type de fichier non supporté. Format accepté: PDF' },
                { status: 400 }
            );
        }

        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'Fichier trop volumineux. Taille maximum: 10MB' },
                { status: 400 }
            );
        }

        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        const pdfData = await pdf(uint8Array);
        const extractedText = pdfData.text;

        const cleanedText = extractedText
            .replace(/\s+/g, ' ')
            .replace(/\n\s*\n/g, '\n\n')
            .trim();

        if (!cleanedText || cleanedText.length < 10) {
            return NextResponse.json(
                { error: 'Impossible d\'extraire du texte du PDF. Vérifiez que le fichier contient du texte.' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            text: cleanedText,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            textLength: cleanedText.length,
            pages: pdfData.numpages,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Erreur route PDF:', error);

        if (error instanceof Error) {
            console.error('Message d\'erreur:', error.message);
            console.error('Stack trace:', error.stack);
        }

        return NextResponse.json(
            {
                error: 'Erreur lors du traitement du fichier PDF',
                details: error instanceof Error ? error.message : 'Erreur inconnue'
            },
            { status: 500 }
        );
    }
}
