import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Récupérer le token depuis les cookies (auth_token posé en HttpOnly côté backend)
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Token d'authentification manquant" },
        { status: 401 },
      );
    }

    // Appeler votre API C# pour vérifier le token et récupérer les infos utilisateur
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // forward user's cookies so backend reads auth_token from cookie
          Cookie: request.headers.get("cookie") || "",
        },
        // credentials hint (not strictly required in Node, but explicit)
        credentials: "include",
      });

      if (!response.ok) {
        // Si l'API retourne une erreur, on supprime le cookie et on retourne une erreur
        const errorResponse = NextResponse.json(
          { error: "Token invalide ou expiré" },
          { status: 401 },
        );

        // Supprimer le cookie d'authentification
        errorResponse.cookies.delete("auth_token");

        return errorResponse;
      }

      const userData = await response.json();

      return NextResponse.json({
        user: {
          profile: userData,
        },
        isAuthenticated: true,
      });
    } catch (error) {
      console.error("❌ Erreur lors de l'appel à l'API C#:", error);
      return NextResponse.json(
        { error: "Erreur de connexion à l'API" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error(
      "Erreur lors de la vérification de l'authentification:",
      error,
    );

    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}
