import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from "@/lib/auth"
import { updatePost, deletePost } from '@/lib/posts'

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await getServerSession(authOptions)

    if (!session || !['admin', 'editor'].includes(session.user?.role as string)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const id = params.id
    const body = await request.json()
    const { title, content, status } = body

    if (!title || !content || !status) {
        return NextResponse.json({ error: 'Title, content, and status are required' }, { status: 400 })
    }

    try {
        const updatedPost = await updatePost(id, { title, content, status })
        if (!updatedPost) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 })
        }
        return NextResponse.json(updatedPost, { status: 200 })
    } catch (error) {
        console.error('Error updating post:', error)
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await getServerSession(authOptions)

    if (!session || !['admin', 'editor'].includes(session.user?.role as string)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const id = params.id

    try {
        await deletePost(id)
        return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 })
    } catch (error) {
        console.error('Error deleting post:', error)
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
    }
}

