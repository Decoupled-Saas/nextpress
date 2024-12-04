import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function PUT(request: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const { id, name, email } = await request.json()

        if (!id || !name || !email) {
            return NextResponse.json({ error: 'User ID, name, and email are required' }, { status: 400 })
        }

        const [updatedUser] = await db.update(users)
            .set({ name, email })
            .where(eq(users.id, id))
            .returning();

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({ message: 'User updated successfully', user: updatedUser }, { status: 200 })
    } catch (error) {
        console.error('Error updating user:', error)
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }
}

