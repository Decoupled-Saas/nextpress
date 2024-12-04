import { db } from './db';
import { pages } from './db/schema';
import { eq } from 'drizzle-orm';

export interface Page {
    id: string;
    title: string;
    content: string;
    slug: string;
    status: 'draft' | 'published';
}

export async function getPages(includeUnpublished = false): Promise<Page[]> {
    if (includeUnpublished) {
        return db.select().from(pages);
    }
    return db.select().from(pages).where(eq(pages.status, 'published'));
}

export async function getPage(slug: string): Promise<Page | undefined> {
    const result = await db.select().from(pages).where(eq(pages.slug, slug));
    return result[0];
}

export async function createPage(page: Omit<Page, 'id'>): Promise<Page> {
    const [newPage] = await db.insert(pages).values(page).returning();
    return newPage;
}

export async function updatePage(id: string, page: Omit<Page, 'id'>): Promise<Page> {
    const [updatedPage] = await db.update(pages)
        .set(page)
        .where(eq(pages.id, id))
        .returning();
    return updatedPage;
}

export async function deletePage(id: string): Promise<void> {
    await db.delete(pages).where(eq(pages.id, id));
}

