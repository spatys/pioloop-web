import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Debug: Afficher tous les cookies disponibles
    const allCookies = request.cookies.getAll();
    console.log('Cookies disponibles:', allCookies.map(c => c.name));
    
    // Récupérer le token depuis les cookies
    const token = request.cookies.get('auth_token')?.value;
    
    // Essayer d'autres noms de cookies possibles
    const alternativeToken = request.cookies.get('token')?.value || 
                          request.cookies.get('jwt')?.value ||
                          request.cookies.get('access_token')?.value;

    if (!token && !alternativeToken) {
      console.log('Aucun token trouvé dans les cookies');
      return NextResponse.json(
        { error: 'Token d\'authentification manquant' },
        { status: 401 }
      );
    }

    const finalToken = token || alternativeToken;
    console.log('Token trouvé:', finalToken ? 'Oui' : 'Non');

    // Appeler votre API C# pour vérifier le token et récupérer les infos utilisateur
    console.log('🔗 Appel vers API C# avec token:', finalToken ? 'Présent' : 'Absent');
    
    try {
      const response = await fetch(`http://localhost:64604/api/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${finalToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Réponse API C#:', response.status, response.statusText);

      if (!response.ok) {
        // Si l'API retourne une erreur, on supprime le cookie et on retourne une erreur
        const errorResponse = NextResponse.json(
          { error: 'Token invalide ou expiré' },
          { status: 401 }
        );
        
        // Supprimer le cookie d'authentification
        errorResponse.cookies.delete('auth_token');
        
        return errorResponse;
      }

      const userData = await response.json();
      console.log('✅ Données utilisateur reçues:', userData);

      return NextResponse.json({
        user: {
          profile: userData
        },
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('❌ Erreur lors de l\'appel à l\'API C#:', error);
      return NextResponse.json(
        { error: 'Erreur de connexion à l\'API' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Erreur lors de la vérification de l\'authentification:', error);
    
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 