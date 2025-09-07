import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Récupérer les données de la requête
    const body = await request.json();

    // Appeler l'API backend pour mettre à jour la propriété
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/api/property/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Forward user's cookies so backend reads auth_token from cookie
        Cookie: request.headers.get('cookie') || '',
      },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'Propriété non trouvée' }, { status: 404 });
      }
      if (response.status === 401) {
        return NextResponse.json({ error: 'Accès non autorisé' }, { status: 401 });
      }
      throw new Error(`Erreur API: ${response.status}`);
    }

    const updatedProperty = await response.json();
    return NextResponse.json(updatedProperty);

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la propriété:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
