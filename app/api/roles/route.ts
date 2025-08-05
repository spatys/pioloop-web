import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Appeler l'API C# pour récupérer tous les rôles
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:64604';
    const response = await fetch(`${apiUrl}/api/roles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des rôles' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des rôles:', error);
    return NextResponse.json(
      { error: 'Erreur de connexion à l\'API' },
      { status: 500 }
    );
  }
} 