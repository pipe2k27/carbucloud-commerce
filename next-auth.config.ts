import Google from "next-auth/providers/google";

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id; // Ensure userId is stored in JWT
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.sub; // Make userId available in session
      return session;
    },
  },
};
