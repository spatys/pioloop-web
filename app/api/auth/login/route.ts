import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Appeler votre API C# pour le login
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:64604';
    const response = await fetch(`${apiUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        return NextResponse.json(
          { error: errorData.message || 'Erreur de connexion' },
          { status: response.status }
        );
      } catch (jsonError) {
        const textResponse = await response.text();
        return NextResponse.json(
          { error: 'Erreur de connexion - réponse invalide' },
          { status: response.status }
        );
      }
    }

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      const textResponse = await response.text();
      return NextResponse.json(
        { error: 'Erreur de connexion - réponse invalide' },
        { status: 500 }
      );
    }
    
    // Créer la réponse Next.js
    const nextResponse = NextResponse.json({
      success: true,
      message: 'Connexion réussie',
      data: data
    });

    // Récupérer le token depuis le corps de la réponse de l'API C#
    const token = data.token;
    
    if (token) {
      // Définir le cookie avec le token
      nextResponse.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 jours
        path: '/',
      });
    }

    return nextResponse;

  } catch (error) {
    console.error('❌ Erreur lors du login:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json(
      { error: `Erreur interne du serveur: ${errorMessage}` },
      { status: 500 }
    );
  }
} 