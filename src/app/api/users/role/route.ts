import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from "@/lib/auth"
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function PUT(request: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const { userId, role } = await request.json()

        if (!userId || !role) {
            return NextResponse.json({ error: 'User ID and role are required' }, { status: 400 })
        }

        const [updatedUser] = await db.update(users)
            .set({ role })
            .where(eq(users.id, userId))
            .returning();

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json(updatedUser, { status: 200 })
    } catch (error) {
        console.error('Error updating user role:', error)
        return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 })
    }
}

