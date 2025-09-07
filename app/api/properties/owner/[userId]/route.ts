import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Récupérer l'ID utilisateur depuis les paramètres
    const { userId } = params;

    if (!userId) {
      return NextResponse.json(
        { error: 'ID utilisateur manquant' },
        { status: 400 }
      );
    }

    // Appeler le backend avec le token d'authentification
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!apiUrl) {
      return NextResponse.json(
        { error: 'URL de l\'API non configurée. Veuillez définir NEXT_PUBLIC_API_URL dans votre fichier .env.local' },
        { status: 500 }
      );
    }

    const response = await fetch(`${apiUrl}/api/property/owner/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Forward user's cookies so backend reads auth_token from cookie
        Cookie: request.headers.get('cookie') || '',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Backend error:', response.status, errorData);
      
      return NextResponse.json(
        { error: `Erreur du serveur: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in get properties by owner API route:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
