import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from "@/lib/auth"
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export async function PUT(request: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const { userId, newPassword } = await request.json()

        if (!userId || !newPassword) {
            return NextResponse.json({ error: 'User ID and new password are required' }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        const [updatedUser] = await db.update(users)
            .set({ password: hashedPassword })
            .where(eq(users.id, userId))
            .returning();

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({ message: 'Password changed successfully' }, { status: 200 })
    } catch (error) {
        console.error('Error changing user password:', error)
        return NextResponse.json({ error: 'Failed to change user password' }, { status: 500 })
    }
}

