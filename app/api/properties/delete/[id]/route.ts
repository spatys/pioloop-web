import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Appeler l'API backend pour supprimer la propriété
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const response = await fetch(`${apiUrl}/api/property/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // Forward user's cookies so backend reads auth_token from cookie
        Cookie: request.headers.get('cookie') || '',
      },
      credentials: 'include',
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

    return NextResponse.json({ message: 'Propriété supprimée avec succès' });

  } catch (error) {
    console.error('Erreur lors de la suppression de la propriété:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
