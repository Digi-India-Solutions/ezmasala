import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Handle CORS for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Create headers for the response
    const headers = new Headers();

    // Get the origin from the request
    const origin = request.headers.get('origin') || '*';

    // Set CORS headers - Allow all origins for Vercel deployments
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    headers.set('Access-Control-Allow-Credentials', 'true');
    headers.set('Access-Control-Max-Age', '86400');

    // Handle preflight OPTIONS requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers
      });
    }

    // For other requests, pass through with CORS headers
    const response = NextResponse.next();

    // Apply CORS headers to the response
    headers.forEach((value, key) => {
      response.headers.set(key, value);
    });

    return response;
  }

  // Original middleware for admin routes
  if (request.nextUrl.pathname.startsWith('/admin/')) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*', // Handle all API routes
  ],
};
