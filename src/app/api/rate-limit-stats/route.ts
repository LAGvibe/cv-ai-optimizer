import { NextRequest, NextResponse } from 'next/server';
import { getRateLimitStats } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
    try {
        const adminKey = request.headers.get('x-admin-key');
        const expectedAdminKey = process.env.ADMIN_KEY;

        if (expectedAdminKey && adminKey !== expectedAdminKey) {
            return NextResponse.json(
                { error: 'Accès non autorisé' },
                { status: 401 }
            );
        }

        const stats = getRateLimitStats();

        return NextResponse.json({
            success: true,
            stats,
            timestamp: new Date().toISOString(),
        });

    } catch (error) {
        console.error('Erreur stats rate limiting:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des statistiques' },
            { status: 500 }
        );
    }
}
