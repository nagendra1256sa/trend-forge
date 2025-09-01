import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// const publicRoutes: string[] = ["/auth/login"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  // Add rout path here for protected routes
  const protectedPaths = ['/dashboard', '/order-type', '/order', '/table-layouts', '/table-layouts/edit-table', '/table-layouts/edit-table/[id]', '/menu-items', '/employees','/reasons'];

  const { pathname } = request.nextUrl;
  const isProtectedPath = protectedPaths.some(path =>
    pathname.startsWith(path)
  );
  
  if (isProtectedPath && !token) {
    const loginUrl = new URL('/auth/login', request.url);
    // loginUrl.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }


};
