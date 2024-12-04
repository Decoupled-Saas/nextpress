import { NextResponse } from 'next/server'
import { createPost, getPosts, updatePost, deletePost } from '@/lib/posts'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET() {
    try {
        const allPosts = await getPosts(true);
        return NextResponse.json(allPosts)
    } catch (error) {
        console.error('Error fetching posts:', error)
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions)

    if (!session || !['admin', 'editor'].includes(session.user?.role as string)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const body = await request.json()
        const { title, content, status, slug } = body

        if (!title || !content || !status || !slug) {
            return NextResponse.json({ error: 'Title, content, status, and slug are required' }, { status: 400 })
        }

        const newPost = await createPost({ title, content, status, slug })
        return NextResponse.json(newPost, { status: 201 })
    } catch (error) {
        console.error('Error creating post:', error)
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    const session = await getServerSession(authOptions)

    if (!session || !['admin', 'editor'].includes(session.user?.role as string)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const body = await request.json()
        const { id, title, content, status, slug } = body

        if (!id || !title || !content || !status || !slug) {
            return NextResponse.json({ error: 'ID, title, content, status, and slug are required' }, { status: 400 })
        }

        const updatedPost = await updatePost(id, { title, content, status, slug })
        if (!updatedPost) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 })
        }
        return NextResponse.json(updatedPost, { status: 200 })
    } catch (error) {
        console.error('Error updating post:', error)
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions)

    if (!session || !['admin', 'editor'].includes(session.user?.role as string)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
        }

        await deletePost(id)
        return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 })
    } catch (error) {
        console.error('Error deleting post:', error)
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
    }
}

