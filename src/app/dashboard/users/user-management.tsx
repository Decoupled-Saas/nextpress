'use client'

import { useState } from 'react'
import { User } from '@/lib/db/schema'
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { useRouter } from 'next/navigation'

type UserManagementProps = {
    initialUsers: User[]
}

export default function UserManagement({ initialUsers }: UserManagementProps) {
    const [users, setUsers] = useState(initialUsers)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [userToDelete, setUserToDelete] = useState<User | null>(null)
    const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false)
    const [userToChangePassword, setUserToChangePassword] = useState<User | null>(null)
    const [newPassword, setNewPassword] = useState('')
    const router = useRouter()

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            const response = await fetch('/api/users/role', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, role: newRole }),
            })

            if (!response.ok) {
                throw new Error('Failed to update user role')
            }

            setUsers(users.map(user =>
                user.id === userId ? { ...user, role: newRole } : user
            ))

            toast.success('User role updated successfully')
        } catch (error) {
            console.error('Error updating user role:', error)
            toast.error('Failed to update user role')
        }
    }

    const handleEditUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!editingUser) return

        try {
            const response = await fetch('/api/users/edit', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingUser),
            })

            if (!response.ok) {
                throw new Error('Failed to update user')
            }

            setUsers(users.map(user =>
                user.id === editingUser.id ? editingUser : user
            ))

            setEditingUser(null)
            toast.success('User updated successfully')
        } catch (error) {
            console.error('Error updating user:', error)
            toast.error('Failed to update user')
        }
    }

    const handleDeleteUser = async () => {
        if (!userToDelete) return

        try {
            const response = await fetch(`/api/users/delete?userId=${userToDelete.id}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error('Failed to delete user')
            }

            setUsers(users.filter(user => user.id !== userToDelete.id))
            setIsDeleteDialogOpen(false)
            setUserToDelete(null)
            toast.success('User deleted successfully')
        } catch (error) {
            console.error('Error deleting user:', error)
            toast.error('Failed to delete user')
        }
    }

    const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!userToChangePassword) return

        try {
            const response = await fetch('/api/users/change-password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userToChangePassword.id, newPassword }),
            })

            if (!response.ok) {
                throw new Error('Failed to change user password')
            }

            setIsChangePasswordDialogOpen(false)
            setUserToChangePassword(null)
            setNewPassword('')
            toast.success('User password changed successfully')
        } catch (error) {
            console.error('Error changing user password:', error)
            toast.error('Failed to change user password')
        }
    }

    const handleImpersonateUser = async (userId: string) => {
        try {
            const response = await fetch('/api/users/impersonate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            })

            if (!response.ok) {
                throw new Error('Failed to impersonate user')
            }

            toast.success('Impersonating user')
            router.push('/') // Redirect to home page as the impersonated user
        } catch (error) {
            console.error('Error impersonating user:', error)
            toast.error('Failed to impersonate user')
        }
    }

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Actions</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                                <Select
                                    onValueChange={(value) => handleRoleChange(user.id, value)}
                                    defaultValue={user.role}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="user">User</SelectItem>
                                        <SelectItem value="editor">Editor</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell>
                                <Button variant="outline" className="ml-2" onClick={() => setEditingUser(user)}>
                                    Edit
                                </Button>
                                <Button variant="destructive" className="ml-2" onClick={() => {
                                    setUserToDelete(user)
                                    setIsDeleteDialogOpen(true)
                                }}>
                                    Delete
                                </Button>
                                <Button variant="outline" className="ml-2" onClick={() => {
                                    setUserToChangePassword(user)
                                    setIsChangePasswordDialogOpen(true)
                                }}>
                                    Change Password
                                </Button>
                                <Button variant="outline" className="ml-2" onClick={() => handleImpersonateUser(user.id)}>
                                    Impersonate
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {editingUser && (
                <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEditUser}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="name" className="text-right">
                                        Name
                                    </label>
                                    <Input
                                        id="name"
                                        value={editingUser.name || ''}
                                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="email" className="text-right">
                                        Email
                                    </label>
                                    <Input
                                        id="email"
                                        value={editingUser.email}
                                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
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
                            Are you sure you want to delete this user? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteUser}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isChangePasswordDialogOpen} onOpenChange={setIsChangePasswordDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change User Password</DialogTitle>
                        <DialogDescription>
                            Enter a new password for the user.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleChangePassword}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="newPassword" className="text-right">
                                    New Password
                                </label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Change Password</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}

