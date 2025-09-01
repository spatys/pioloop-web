import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Récupérer le cookie d'authentification
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token');

    if (!authToken) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Récupérer les données de la requête
    const body = await request.json();

    // Décoder le JWT pour récupérer l'ID de l'utilisateur
    const token = authToken.value;
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const userId = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

    if (!userId) {
      return NextResponse.json({ error: 'ID utilisateur non trouvé' }, { status: 400 });
    }

    // Ajouter l'ID de l'utilisateur aux données de la propriété
    const propertyData = {
      ...body,
      ownerId: userId
    };

    // Appeler l'API backend pour créer la propriété
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const response = await fetch(`${apiUrl}/api/property/create`, {
      method: 'POST',
      headers: {
        'Cookie': `auth_token=${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(propertyData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Erreur API: ${response.status} - ${errorData.message || response.statusText}`);
    }

    const property = await response.json();
    return NextResponse.json(property);

  } catch (error) {
    console.error('Erreur lors de la création de la propriété:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
