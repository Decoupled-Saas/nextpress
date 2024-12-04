import { db } from './db';
import { menuItems } from './db/schema';
import { eq, desc } from 'drizzle-orm';

export interface MenuItem {
    id: string;
    label: string;
    url: string;
    order: number;
}

export async function getMenuItems(): Promise<MenuItem[]> {
    return db.select().from(menuItems).orderBy(desc(menuItems.order));
}

export async function createMenuItem(item: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    const [newItem] = await db.insert(menuItems).values(item).returning();
    return newItem;
}

export async function updateMenuItem(id: string, item: Partial<MenuItem>): Promise<MenuItem | undefined> {
    const [updatedItem] = await db.update(menuItems)
        .set(item)
        .where(eq(menuItems.id, id))
        .returning();
    return updatedItem;
}

export async function deleteMenuItem(id: string): Promise<void> {
    await db.delete(menuItems).where(eq(menuItems.id, id));
}

export async function reorderMenuItems(items: MenuItem[]): Promise<void> {
    await db.transaction(async (tx) => {
        for (const item of items) {
            await tx.update(menuItems)
                .set({ order: item.order })
                .where(eq(menuItems.id, item.id));
        }
    });
}

