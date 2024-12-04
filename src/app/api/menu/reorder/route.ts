import { NextRequest, NextResponse } from 'next/server'
import { reorderMenuItems } from '@/lib/menu'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function PUT(request: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session || !['admin', 'editor'].includes(session.user?.role as string)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const items = await request.json()

        if (!Array.isArray(items)) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
        }

        await reorderMenuItems(items)
        return NextResponse.json({ message: 'Menu items reordered successfully' }, { status: 200 })
    } catch (error) {
        console.error('Error reordering menu items:', error)
        return NextResponse.json({ error: 'Failed to reorder menu items' }, { status: 500 })
    }
}

