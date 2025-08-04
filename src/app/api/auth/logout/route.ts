import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Appeler l'API C# pour la déconnexion (optionnel)
    try {
      const response = await fetch(`http://localhost:64604/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      // On continue même si l'API C# échoue
    }
    
    // Créer la réponse Next.js
    const nextResponse = NextResponse.json({
      success: true,
      message: 'Déconnexion réussie'
    });

    // Supprimer le cookie d'authentification
    nextResponse.cookies.delete('auth_token');

    return nextResponse;

  } catch (error) {
    console.error('❌ Erreur lors de la déconnexion:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json(
      { error: `Erreur interne du serveur: ${errorMessage}` },
      { status: 500 }
    );
  }
} 