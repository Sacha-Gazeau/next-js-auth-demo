import NextAuth, { AuthOptions, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/client";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "e-mail address and password",
      credentials: {
        email: {
          label: "E-mail address",
          type: "text",
          placeholder: "john.doe@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) {
          return null;
        }
        const passwordsMatch = await bcrypt.compare(
          credentials.password,
          user.hashedPassword!
        );

        return passwordsMatch ? user : null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session: async ({ session }) => {
      const user = await prisma.user.findUnique({
        where: { email: session?.user?.email ?? undefined },
      });
      if (user?.id) {
        session.userId = user?.id;
      }
      return session;
    },
  },
};

const handler: NextAuthOptions = NextAuth(authOptions);

export { handler as GET, handler as POST };
