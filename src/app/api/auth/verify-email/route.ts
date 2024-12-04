import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users, verificationTokens } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
        return NextResponse.json({ error: 'Missing token' }, { status: 400 })
    }

    const verificationToken = await db.select().from(verificationTokens).where(eq(verificationTokens.token, token))

    if (!verificationToken) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
    }

    if (new Date() > verificationToken.expires) {
        return NextResponse.json({ error: 'Token expired' }, { status: 400 })
    }

    await db.update(users).set({ emailVerified: new Date() }).where(eq(users.email, verificationToken.identifier))
    await db.delete(verificationTokens).where(eq(verificationTokens.token, token))

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/email-verified`)
}

