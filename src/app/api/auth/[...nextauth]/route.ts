import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

// Simulação de um banco de dados de usuários para demonstração
const users = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@example.com",
    password: "senha123", // Em produção, use hash de senha
  },
  {
    id: "2",
    name: "Maria Oliveira",
    email: "maria@example.com",
    password: "senha456", // Em produção, use hash de senha
  },
];

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Em produção, busque o usuário no banco de dados
        const user = users.find((user) => user.email === credentials.email);

        if (user && user.password === credentials.password) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        }

        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "seu-client-id-aqui",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "seu-client-secret-aqui",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "seu-client-id-aqui",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "seu-client-secret-aqui",
    }),
  ],
  pages: {
    signIn: "/auth/login",
    signOut: "/",
    error: "/auth/error",
    newUser: "/auth/register",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "seu-secret-aqui",
});

export { handler as GET, handler as POST };