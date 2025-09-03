import { NextRequest, NextResponse } from "next/server";
import { LoginErrorResponseDto, LoginErrorDto } from "@/core/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Appeler votre API C# pour le login
    // En Docker, utiliser le nom du service pour accéder à l'API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    // Lire la réponse une seule fois
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error("❌ JSON parse error:", jsonError);
      console.error("🔍 Response text:", await response.text());
      return NextResponse.json(
        { error: "Erreur de connexion - réponse invalide" },
        { status: 500 },
      );
    }

    // Créer la réponse Next.js en reprenant le statut du backend
    const nextResponse = NextResponse.json(data, { status: response.status });

    // Propager le Set-Cookie du backend pour que le navigateur enregistre le cookie côté Next domain
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      nextResponse.headers.set("set-cookie", setCookie);
    }

    return nextResponse;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";
    return NextResponse.json(
      { error: `Erreur interne du serveur: ${errorMessage}` },
      { status: 500 },
    );
  }
}
