import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Appeler l'API backend pour récupérer la propriété par ID
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/api/property/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'Propriété non trouvée' }, { status: 404 });
      }
      throw new Error(`Erreur API: ${response.status}`);
    }

    const property = await response.json();
    return NextResponse.json(property);

  } catch (error) {
    console.error('Erreur lors de la récupération de la propriété:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
