import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/client";
import bcrypt from "bcrypt";

const handler: NextAuthOptions = NextAuth({
  providers: [
    CredentialsProvider({
      // Properties "name" and "credentials" define what we see on the /api/auth/signin page
      name: "e-mail address and password",
      credentials: {
        email: {
          label: "E-mail address",
          type: "text",
          placeholder: "john.doe@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      /* Function below captures the credentials from the fields defined above and checks if they are valid.
       * If not, return null -> this will show an error on the log-in page. If valid, return a user object. */
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
  // This defines that we use a JWT instead of a database to capture session data
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // This adds the userId to the session data so we can use it on client and server
    // To make TypeScript happy we need to adjust the Session interface : https://next-auth.js.org/getting-started/typescript#main-module
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
});

export { handler as GET, handler as POST };
