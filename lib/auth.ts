import NextAuth, { DefaultSession } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from './prisma';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { authConfig } from './auth.config';
import { Role } from '@prisma/client';

// Extend the session type to include our custom fields
declare module 'next-auth' {
  interface User {
    role: Role;
    organizationId: string;
  }
  interface Session {
    user: User & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: Role;
    organizationId: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.isActive) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              organizationId: user.organizationId,
            };
          }
        }

        return null;
      },
    }),
  ],
});

// Helper functions for server components/actions
export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.role === 'ADMIN';
}

export async function getTenantContext() {
  const user = await getCurrentUser();
  return user?.organizationId;
}
