import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Appeler l'API backend pour récupérer les propriétés de l'utilisateur
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/api/property/my-properties`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Forward user's cookies so backend reads auth_token from cookie
        Cookie: request.headers.get('cookie') || '',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }

    const properties = await response.json();
    return NextResponse.json(properties);

  } catch (error) {
    console.error('Erreur lors de la récupération des propriétés:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
