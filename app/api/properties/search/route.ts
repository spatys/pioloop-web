import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Construire les paramètres de requête pour le backend
    const queryParams = new URLSearchParams();
    
    if (searchParams.get('location')) {
      queryParams.append('location', searchParams.get('location')!);
    }
    if (searchParams.get('checkIn')) {
      queryParams.append('checkIn', searchParams.get('checkIn')!);
    }
    if (searchParams.get('checkOut')) {
      queryParams.append('checkOut', searchParams.get('checkOut')!);
    }
    if (searchParams.get('guests')) {
      queryParams.append('guests', searchParams.get('guests')!);
    }
    if (searchParams.get('page')) {
      queryParams.append('page', searchParams.get('page')!);
    }
    if (searchParams.get('pageSize')) {
      queryParams.append('pageSize', searchParams.get('pageSize')!);
    }

    // Appeler le backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:64604";
    const response = await fetch(`${apiUrl}/api/properties/search?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Erreur lors de la recherche de propriétés" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur lors de la recherche de propriétés:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
