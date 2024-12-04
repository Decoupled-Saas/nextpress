import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { updatePage, deletePage } from '@/lib/pages'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)

    if (!session || !['admin', 'editor'].includes(session.user?.role as string)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const id = params.id
    const body = await request.json()
    const { title, content, slug, status } = body

    if (!title || !content || !slug || !status) {
        return NextResponse.json({ error: 'Title, content, slug, and status are required' }, { status: 400 })
    }

    try {
        const updatedPage = await updatePage(id, { title, content, slug, status })
        return NextResponse.json(updatedPage, { status: 200 })
    } catch (error) {
        console.error('Error updating page:', error)
        return NextResponse.json({ error: 'Failed to update page' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)

    if (!session || !['admin', 'editor'].includes(session.user?.role as string)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const id = params.id

    try {
        await deletePage(id)
        return NextResponse.json({ message: 'Page deleted successfully' }, { status: 200 })
    } catch (error) {
        console.error('Error deleting page:', error)
        return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 })
    }
}

