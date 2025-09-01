import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: { ownerId: string } }
) {
  try {
    const { ownerId } = params;

    // Récupérer le cookie d'authentification
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token');

    if (!authToken) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Appeler l'API backend pour récupérer les propriétés du propriétaire
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const response = await fetch(`${apiUrl}/api/property/owner/${ownerId}`, {
      method: 'GET',
      headers: {
        'Cookie': `auth_token=${authToken.value}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({ error: 'Accès non autorisé' }, { status: 401 });
      }
      throw new Error(`Erreur API: ${response.status}`);
    }

    const properties = await response.json();
    return NextResponse.json(properties);

  } catch (error) {
    console.error('Erreur lors de la récupération des propriétés du propriétaire:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
