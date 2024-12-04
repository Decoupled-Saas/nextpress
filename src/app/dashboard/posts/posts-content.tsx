'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast } from "sonner"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import EditPost from './edit-post'

interface Post {
    id: string;
    title: string;
    content: string;
    date: string;
    status: 'draft' | 'published';
    slug: string;
}

export default function PostsContent() {
    const [posts, setPosts] = useState<Post[]>([])
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [postToDelete, setPostToDelete] = useState<Post | null>(null)
    const [editingPost, setEditingPost] = useState<Post | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const router = useRouter()

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        try {
            const response = await fetch('/api/posts')
            if (!response.ok) {
                throw new Error('Failed to fetch posts')
            }
            const data = await response.json()
            setPosts(data)
        } catch (error) {
            console.error('Error fetching posts:', error)
            toast.error('Failed to fetch posts')
        }
    }

    const handleDelete = async () => {
        if (!postToDelete) return

        try {
            const response = await fetch(`/api/posts/${postToDelete.id}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error('Failed to delete post')
            }

            setIsDeleteDialogOpen(false)
            setPostToDelete(null)
            fetchPosts()
            toast.success('Post deleted successfully')
        } catch (error) {
            console.error('Error deleting post:', error)
            toast.error('Failed to delete post')
        }
    }

    const handleSave = async (post: Omit<Post, 'id' | 'date'> & { id?: string }) => {
        try {
            const url = post.id ? `/api/posts/${post.id}` : '/api/posts'
            const method = post.id ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(post),
            })

            if (!response.ok) {
                throw new Error(`Failed to ${post.id ? 'update' : 'create'} post`)
            }

            fetchPosts()
            setEditingPost(null)
            setIsCreating(false)
            toast.success(`Post ${post.id ? 'updated' : 'created'} successfully`)
        } catch (error) {
            console.error(`Error ${post.id ? 'updating' : 'creating'} post:`, error)
            toast.error(`Failed to ${post.id ? 'update' : 'create'} post`)
        }
    }

    if (editingPost || isCreating) {
        return (
            <EditPost
                post={editingPost}
                onSave={handleSave}
                onCancel={() => {
                    setEditingPost(null)
                    setIsCreating(false)
                }}
            />
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Posts</h2>
                <Button onClick={() => setIsCreating(true)}>Create New Post</Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {posts.map((post) => (
                        <TableRow key={post.id}>
                            <TableCell>{post.title}</TableCell>
                            <TableCell>{post.slug}</TableCell>
                            <TableCell>{new Date(post.date).toLocaleDateString()}</TableCell>
                            <TableCell>{post.status}</TableCell>
                            <TableCell>
                                <Button variant="outline" className="mr-2" onClick={() => setEditingPost(post)}>
                                    Edit
                                </Button>
                                <Button variant="destructive" onClick={() => {
                                    setPostToDelete(post)
                                    setIsDeleteDialogOpen(true)
                                }}>
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this post? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}