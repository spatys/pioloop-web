import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { ownerId: string } }
) {
  try {
    const { ownerId } = params;

    // Appeler le backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:64604";
    const response = await fetch(`${apiUrl}/api/properties/owner/${ownerId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Erreur lors de la récupération des propriétés du propriétaire" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur lors de la récupération des propriétés du propriétaire:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
