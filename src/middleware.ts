// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const REQUEST_ID_HEADER = 'x-request-id';

function generateRequestId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function isTokenNotExpired(token: string): boolean {
    try {
        const base64 = token.split('.')[1]?.replace(/-/g, '+').replace(/_/g, '/');
        if (!base64) return false;
        const payload = JSON.parse(atob(base64));
        if (!payload?.exp) return false;
        return payload.exp > Date.now() / 1000;
    } catch {
        return false;
    }
}

export function middleware(request: NextRequest) {
    const requestId = request.headers.get(REQUEST_ID_HEADER) ?? generateRequestId();

    const tokenCookie = request.cookies.get('accessToken');
    const token = tokenCookie?.value;
    const hasValidToken = token ? isTokenNotExpired(token) : false;

    const protectedRoutes = ['/dashboard', '/profile']; // Example protected routes
    const authRoutes = ['/login', '/signup', "/"]; // Example auth routes

    // Check if the current path is a protected route
    if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
        if (!hasValidToken) {
            const response = NextResponse.redirect(new URL('/login', request.url));
            if (tokenCookie) {
                response.cookies.delete('accessToken');
            }
            return response;
        }
    }

    // Prevent authenticated users from accessing login/signup pages
    if (authRoutes.includes(request.nextUrl.pathname) && hasValidToken) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    const response = NextResponse.next();
    response.headers.set(REQUEST_ID_HEADER, requestId);
    return response;
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'], // Apply middleware to all routes except static files
};