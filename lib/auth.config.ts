import type { NextAuthConfig, User, Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';

export const authConfig = {
  pages: {
    signIn: '/login',
    signOut: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      // Public routes
      const publicRoutes = ['/', '/login', '/register', '/forgot-password'];
      const isPublicRoute = publicRoutes.some((route) => pathname === route);

      if (isPublicRoute) {
        if (isLoggedIn) {
          let dashboardUrl = '/member/dashboard';
          if ((auth.user.role as any) === 'SUPER_ADMIN') {
            dashboardUrl = '/super-admin/dashboard';
          } else if (auth.user.role === 'ADMIN') {
            dashboardUrl = '/admin/dashboard';
          }
          return Response.redirect(new URL(dashboardUrl, nextUrl));
        }
        return true;
      }

      if (!isLoggedIn) return false;

      // Role-based protection
      const isSuperAdminRoute = pathname.startsWith('/super-admin');
      const isAdminRoute = pathname.startsWith('/admin');
      const isMemberRoute = pathname.startsWith('/member');
      const isAllowedForAdmin = ['/member/profile', '/member/history', '/member/expenses'].some(route => pathname === route);

      if ((auth.user.role as any) === 'SUPER_ADMIN') {
        if (!isSuperAdminRoute && !pathname.includes('profile')) {
          return Response.redirect(new URL('/super-admin/dashboard', nextUrl));
        }
        return true;
      }

      if (auth.user.role === 'ADMIN' && isMemberRoute && !isAllowedForAdmin) {
        return Response.redirect(new URL('/admin/dashboard', nextUrl));
      }

      if (auth.user.role === 'MEMBER' && (isAdminRoute || isSuperAdminRoute)) {
        return Response.redirect(new URL('/member/dashboard', nextUrl));
      }

      if (auth.user.role === 'ADMIN' && isSuperAdminRoute) {
        return Response.redirect(new URL('/admin/dashboard', nextUrl));
      }

      return true;
    },
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
        token.organizationId = user.organizationId;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.organizationId = token.organizationId;
      }
      return session;
    },
  },
  providers: [], // Add providers in auth.ts
} satisfies NextAuthConfig;
