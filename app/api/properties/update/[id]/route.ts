import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Récupérer le cookie d'authentification
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token');

    if (!authToken) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Récupérer les données de la requête
    const body = await request.json();

    // Appeler l'API backend pour mettre à jour la propriété
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const response = await fetch(`${apiUrl}/api/property/update/${id}`, {
      method: 'PUT',
      headers: {
        'Cookie': `auth_token=${authToken.value}`,
        'Content-Type': 'application/json',
      },
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
