import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    // Option 1: Google Login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    
    // Option 2: Hardcoded Password
    CredentialsProvider({
      name: "Master Password",
      credentials: {
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Checks if the typed password matches your environment variable
        if (credentials?.password === process.env.ADMIN_PASSWORD) {
          // Return a mock user object if successful
          return { id: "admin", name: "Admin", email: "admin@portfolio.local" };
        }
        return null; // Reject if password is wrong
      }
    })
  ],
  pages: {
    signIn: '/admin/login', // Tells NextAuth to use our custom stylish login page
  },
  callbacks: {
    async signIn({ user, account }) {
      // SECURITY CHECK: If logging in with Google, ensure it is YOUR email
      if (account?.provider === "google") {
        const allowedEmail = process.env.ADMIN_EMAIL; 
        if (user.email === allowedEmail) {
          return true; // Allowed
        }
        return false; // Blocked: Not the admin email
      }
      return true; // Allowed (Credentials login already verified the password above)
    }
  },
  session: {
    strategy: "jwt", // Use JSON Web Tokens for fast, secure sessions
  }
});

export { handler as GET, handler as POST };