import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Táto funkcia sa spustí pri každej požiadavke na chránenú trasu

export function middleware(request: NextRequest) {
  // 1. Skúsime prečítať HTTP-Only cookies, ktoré nám poslal náš backend
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  // 2. Ak nemáme ani jeden z tokenov, používateľ nie je prihlásený
  if (!accessToken && !refreshToken) {
    // Vytvoríme URL pre domovskú stránku
    const homeUrl = new URL('/', request.url);
    
    // Voliteľné: Môžeme do URL pridať parameter, aby sme po presmerovaní vedeli ukázať hlášku
    // homeUrl.searchParams.set('error', 'unauthorized');
    
    // Odošleme používateľa okamžite späť na domovskú stránku
    return NextResponse.redirect(homeUrl);
  }

  // 3. Ak token existuje, pustíme používateľa na požadovanú stránku
  return NextResponse.next();
}

// 4. Tu prísne definujeme, na ktoré URL adresy sa má Middleware aplikovať
export const config = {
  matcher: [

    '/attendance/:path*',
    '/kids/:path*',
    '/parents/:path*',
    '/employees/:path*',
    '/chat/:path*',
    '/lunch-checkout/:path*',
    '/profile/:path*',
    '/announcements/:path*'
  ],
};