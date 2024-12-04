'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'

interface MenuItem {
    id: string;
    label: string;
    url: string;
    order: number;
}

export default function MenuContent() {
    const [label, setLabel] = useState('')
    const [url, setUrl] = useState('')
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null)
    const router = useRouter()

    useEffect(() => {
        fetchMenuItems()
    }, [])

    const fetchMenuItems = async () => {
        try {
            const response = await fetch('/api/menu')
            if (!response.ok) {
                throw new Error('Failed to fetch menu items')
            }
            const data = await response.json()
            setMenuItems(data)
        } catch (error) {
            console.error('Error fetching menu items:', error)
            toast.error('Failed to fetch menu items')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await fetch('/api/menu', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ label, url, order: menuItems.length }),
            })
            if (!response.ok) {
                throw new Error('Failed to add menu item')
            }
            setLabel('')
            setUrl('')
            fetchMenuItems()
            toast.success('Menu item added successfully')
        } catch (error) {
            console.error('Error adding menu item:', error)
            toast.error('Failed to add menu item')
        }
    }

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingItem) return

        try {
            const response = await fetch('/api/menu', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingItem),
            })

            if (!response.ok) {
                throw new Error('Failed to update menu item')
            }

            setMenuItems(menuItems.map(item =>
                item.id === editingItem.id ? editingItem : item
            ))

            setEditingItem(null)
            toast.success('Menu item updated successfully')
        } catch (error) {
            console.error('Error updating menu item:', error)
            toast.error('Failed to update menu item')
        }
    }

    const handleDeleteItem = async () => {
        if (!itemToDelete) return

        try {
            const response = await fetch(`/api/menu?id=${itemToDelete.id}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error('Failed to delete menu item')
            }

            setMenuItems(menuItems.filter(item => item.id !== itemToDelete.id))
            setIsDeleteDialogOpen(false)
            setItemToDelete(null)
            toast.success('Menu item deleted successfully')
        } catch (error) {
            console.error('Error deleting menu item:', error)
            toast.error('Failed to delete menu item')
        }
    }

    const onDragEnd = async (result: DropResult) => {
        if (!result.destination) {
            return;
        }

        const items = Array.from(menuItems);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const updatedItems = items.map((item, index) => ({
            ...item,
            order: index,
        }));

        setMenuItems(updatedItems);

        try {
            const response = await fetch('/api/menu/reorder', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedItems),
            });

            if (!response.ok) {
                throw new Error('Failed to reorder menu items');
            }

            toast.success('Menu items reordered successfully');
        } catch (error) {
            console.error('Error reordering menu items:', error);
            toast.error('Failed to reorder menu items');
            fetchMenuItems(); // Revert to original order if reordering fails
        }
    };

    return (
        <div className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    type="text"
                    placeholder="Menu Label"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    required
                />
                <Input
                    type="text"
                    placeholder="URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                />
                <Button type="submit">Add Menu Item</Button>
            </form>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="menu-items">
                    {(provided) => (
                        <Table {...provided.droppableProps} ref={provided.innerRef}>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Label</TableHead>
                                    <TableHead>URL</TableHead>
                                    <TableHead>Order</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {menuItems.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {(provided) => (
                                            <TableRow
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <TableCell>{item.label}</TableCell>
                                                <TableCell>{item.url}</TableCell>
                                                <TableCell>{item.order}</TableCell>
                                                <TableCell>
                                                    <Button variant="outline" className="mr-2" onClick={() => setEditingItem(item)}>
                                                        Edit
                                                    </Button>
                                                    <Button variant="destructive" onClick={() => {
                                                        setItemToDelete(item)
                                                        setIsDeleteDialogOpen(true)
                                                    }}>
                                                        Delete
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </TableBody>
                        </Table>
                    )}
                </Droppable>
            </DragDropContext>

            {editingItem && (
                <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Menu Item</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEditSubmit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="label" className="text-right">
                                        Label
                                    </label>
                                    <Input
                                        id="label"
                                        value={editingItem.label}
                                        onChange={(e) => setEditingItem({ ...editingItem, label: e.target.value })}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="url" className="text-right">
                                        URL
                                    </label>
                                    <Input
                                        id="url"
                                        value={editingItem.url}
                                        onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="order" className="text-right">
                                        Order
                                    </label>
                                    <Input
                                        id="order"
                                        type="number"
                                        value={editingItem.order}
                                        onChange={(e) => setEditingItem({ ...editingItem, order: parseInt(e.target.value) })}
                                        className="col-span-3"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Save changes</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this menu item? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteItem}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

