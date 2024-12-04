import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    try {
        const { currentPassword, newPassword } = await req.json()

        const [user] = await db.select().from(users).where(eq(users.id, session.user.id));

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10)

        await db.update(users)
            .set({ password: hashedNewPassword })
            .where(eq(users.id, session.user.id));

        return NextResponse.json({ message: 'Password changed successfully' })
    } catch (error) {
        console.error('Password change error:', error)
        return NextResponse.json({ error: 'Failed to change password' }, { status: 500 })
    }
}

