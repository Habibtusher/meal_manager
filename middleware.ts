import NextAuth from 'next-auth';
import { authConfig } from './lib/auth.config';
import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';
import type { NextRequest } from 'next/server';

// Create the i18n middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'never' // Don't use locale prefixes in URLs
});

// Create the auth middleware
const authMiddleware = NextAuth(authConfig).auth;

// Combine both middlewares
export default async function middleware(request: NextRequest) {
  // Run auth middleware first
  const authResponse = await authMiddleware(request as any);
  
  // If auth middleware returns a response (redirect), return it
  if (authResponse) {
    return authResponse;
  }
  
  // Otherwise, run i18n middleware
  return intlMiddleware(request);
}

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|.*\\.json$|sw\\.js$|favicon\\.ico$|.*\\.svg$).*)'],
};
