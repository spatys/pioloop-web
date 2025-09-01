import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Récupérer les paramètres de recherche depuis l'URL
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = searchParams.get('guests');
    const page = searchParams.get('page');
    const pageSize = searchParams.get('pageSize');

    // Construire l'URL de recherche avec les paramètres
    const searchUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/property/search`);
    if (location) searchUrl.searchParams.set('location', location);
    if (checkIn) searchUrl.searchParams.set('checkIn', checkIn);
    if (checkOut) searchUrl.searchParams.set('checkOut', checkOut);
    if (guests) searchUrl.searchParams.set('guests', guests);
    if (page) searchUrl.searchParams.set('page', page);
    if (pageSize) searchUrl.searchParams.set('pageSize', pageSize);

    // Appeler l'API backend pour la recherche
    const response = await fetch(searchUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }

    const searchResults = await response.json();
    return NextResponse.json(searchResults);

  } catch (error) {
    console.error('Erreur lors de la recherche de propriétés:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
