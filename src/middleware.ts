import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ['/api/socket/io']
});

export const config = {
  matcher: ['/((?!_next|api/socket/io|favicon.ico).*)', '/']
};