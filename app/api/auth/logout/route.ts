import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Appeler l'API C# pour la déconnexion (optionnel)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      await fetch(`${apiUrl}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // forward cookies to let backend clear HttpOnly cookie if it supports logout
          Cookie: request.headers.get("cookie") || "",
        },
        credentials: "include",
      });
    } catch (error) {
      // On continue même si l'API C# échoue
    }

    // Créer la réponse Next.js
    const nextResponse = NextResponse.json({
      success: true,
      message: "Déconnexion réussie",
    });

    // Supprimer le cookie d'authentification côté Next (en plus du backend)
    nextResponse.cookies.delete("auth_token");

    return nextResponse;
  } catch (error) {
    console.error("❌ Erreur lors de la déconnexion:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";
    return NextResponse.json(
      { error: `Erreur interne du serveur: ${errorMessage}` },
      { status: 500 },
    );
  }
}
