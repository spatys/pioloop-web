import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Endpoint /api/auth/login appelé');
    const body = await request.json();
    
    console.log('📤 Body reçu:', JSON.stringify(body));
    
    // Appeler votre API C# pour le login
    const response = await fetch(`http://localhost:64604/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    console.log('📡 Status:', response.status);
    console.log('📡 StatusText:', response.statusText);

    if (!response.ok) {
      console.log('❌ Response not ok, status:', response.status);
      try {
        const errorData = await response.json();
        console.log('❌ Error data:', errorData);
        return NextResponse.json(
          { error: errorData.message || 'Erreur de connexion' },
          { status: response.status }
        );
      } catch (jsonError) {
        console.log('❌ Erreur parsing JSON:', jsonError);
        const textResponse = await response.text();
        console.log('❌ Text response:', textResponse);
        return NextResponse.json(
          { error: 'Erreur de connexion - réponse invalide' },
          { status: response.status }
        );
      }
    }

    console.log('✅ Response ok, parsing JSON...');
    let data;
    try {
      data = await response.json();
      console.log('✅ Data parsed:', data);
      console.log('🔍 Structure de data:', Object.keys(data));
      console.log('🔍 data.token:', data.token);
      console.log('🔍 data.data:', data.data);
    } catch (jsonError) {
      console.log('❌ Erreur parsing JSON:', jsonError);
      const textResponse = await response.text();
      console.log('❌ Text response:', textResponse);
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
    console.log('🔑 Token dans la réponse:', token ? 'Présent' : 'Absent');
    
    if (token) {
      console.log('🍪 Définition du cookie auth_token');
      // Définir le cookie avec le token
      nextResponse.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 jours
        path: '/',
      });
    } else {
      console.log('❌ Aucun token trouvé dans la réponse');
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