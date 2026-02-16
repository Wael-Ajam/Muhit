import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - API routes, admin dashboard
  // - Static files (e.g. /favicon.ico)
  // - Next.js internals
  matcher: ['/', '/(ar|en)/:path*', '/((?!api|admin|_next|_vercel|studio|.*\\..*).*)']
};
