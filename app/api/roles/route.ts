import { NextResponse } from 'next/server';

export async function GET() {
  console.log("🔍 API Roles - Route appelée !");
  
  // Test simple d'abord
  return NextResponse.json({
    roles: [
      { id: '1', name: 'Tenant', normalizedName: 'TENANT' },
      { id: '2', name: 'Owner', normalizedName: 'OWNER' },
      { id: '3', name: 'Manager', normalizedName: 'MANAGER' },
      { id: '4', name: 'Admin', normalizedName: 'ADMIN' }
    ],
    count: 4
  });
}
