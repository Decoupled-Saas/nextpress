import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { rateLimiter } from "@/lib/rate-limiter"
import bcrypt from "bcryptjs"
import { NextRequest, NextResponse } from 'next/server'

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await db.select().from(users).where(eq(users.email, credentials.email)).then(res => res[0]);

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: user.emailVerified,
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.emailVerified = user.emailVerified
      }
      if (account && account.isImpersonating) {
        token.isImpersonating = true
        token.originalUser = account.originalUser
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.emailVerified = token.emailVerified as Date | null
      }
      if (token.isImpersonating) {
        session.isImpersonating = true
        session.originalUser = token.originalUser
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
  },
}

const handler = NextAuth(authOptions)

export async function GET(req: NextRequest, res: NextResponse) {
  const rateLimiterResponse = rateLimiter(req)
  if (rateLimiterResponse) return rateLimiterResponse
  return handler(req as any, res)
}

export async function POST(req: NextRequest, res: NextResponse) {
  const rateLimiterResponse = rateLimiter(req)
  if (rateLimiterResponse) return rateLimiterResponse
  return handler(req as any, res)
}

