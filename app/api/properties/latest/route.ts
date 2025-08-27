import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '10';

    // Appeler le backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:64604";
    const response = await fetch(`${apiUrl}/api/properties/latest?limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Erreur lors de la récupération des dernières propriétés" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur lors de la récupération des dernières propriétés:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
