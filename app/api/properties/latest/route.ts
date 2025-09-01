import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Récupérer le paramètre limit depuis l'URL
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '10';

    // Appeler l'API backend pour récupérer les propriétés récentes
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const response = await fetch(`${apiUrl}/api/property/latest?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }

    const latestProperties = await response.json();
    return NextResponse.json(latestProperties);

  } catch (error) {
    console.error('Erreur lors de la récupération des propriétés récentes:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
