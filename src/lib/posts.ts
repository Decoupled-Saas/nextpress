import { db } from './db';
import { posts } from './db/schema';
import { eq, and } from 'drizzle-orm';

export interface Post {
    id: string;
    title: string;
    content: string;
    date: string;
    status: 'draft' | 'published';
    slug: string;
}

export async function getPosts(includeUnpublished = false): Promise<Post[]> {
    if (includeUnpublished) {
        return db.select().from(posts);
    }
    return db.select().from(posts).where(eq(posts.status, 'published'));
}

export async function getPost(slug: string): Promise<Post | undefined> {
    const result = await db.select().from(posts).where(and(eq(posts.slug, slug), eq(posts.status, 'published')));
    return result[0];
}

export async function createPost(post: Omit<Post, 'id'>): Promise<Post> {
    const [newPost] = await db.insert(posts).values({
        ...post,
        date: new Date(), // Ensure we're always using a new Date object
    }).returning();
    return newPost;
}

export async function updatePost(id: string, post: Partial<Omit<Post, 'id'>>): Promise<Post | undefined> {
    const [updatedPost] = await db.update(posts)
        .set({
            ...post,
            // Only update the date if it's a new publication or if a new date is provided
            ...(post.status === 'published' || post.date ? { date: new Date() } : {}),
        })
        .where(eq(posts.id, id))
        .returning();
    return updatedPost;
}

export async function deletePost(id: string): Promise<void> {
    await db.delete(posts).where(eq(posts.id, id));
}

