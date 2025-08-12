import { NextRequest, NextResponse } from 'next/server';
import { LoginErrorResponseDto, LoginErrorDto } from '@/core/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Appeler votre API C# pour le login
    // En Docker, utiliser le nom du service pour accéder à l'API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const response = await fetch(`${apiUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    // Lire la réponse une seule fois
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error('❌ JSON parse error:', jsonError);
      console.error('🔍 Response text:', await response.text());
      return NextResponse.json(
        { error: 'Erreur de connexion - réponse invalide' },
        { status: 500 }
      );
    }

    if (!response.ok) {
      // Retourner directement la réponse d'erreur standardisée du backend C#
      return NextResponse.json(data, { status: response.status });
    }
    
    // Créer la réponse Next.js - retourner directement les données du backend
    const nextResponse = NextResponse.json(data);

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
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json(
      { error: `Erreur interne du serveur: ${errorMessage}` },
      { status: 500 }
    );
  }
} 