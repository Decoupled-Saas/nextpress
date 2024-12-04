'use client'

import { useState, useEffect } from 'react'
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
import { Label } from '@/components/ui/label'

interface Plan {
    id: string;
    name: string;
    price: number;
    duration: number;
    stripeProductId: string;
    stripePriceId: string;
}

export default function PlansContent() {
    const [plans, setPlans] = useState<Plan[]>([])
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [planToDelete, setPlanToDelete] = useState<Plan | null>(null)
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
    const [isCreating, setIsCreating] = useState(false)

    useEffect(() => {
        fetchPlans()
    }, [])

    const fetchPlans = async () => {
        try {
            const response = await fetch('/api/plans')
            if (!response.ok) {
                throw new Error('Failed to fetch plans')
            }
            const data = await response.json()
            setPlans(data)
        } catch (error) {
            console.error('Error fetching plans:', error)
            toast.error('Failed to fetch plans')
        }
    }

    const handleDelete = async () => {
        if (!planToDelete) return

        try {
            const response = await fetch(`/api/plans/${planToDelete.id}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error('Failed to delete plan')
            }

            setIsDeleteDialogOpen(false)
            setPlanToDelete(null)
            fetchPlans()
            toast.success('Plan deleted successfully')
        } catch (error) {
            console.error('Error deleting plan:', error)
            toast.error('Failed to delete plan')
        }
    }

    const handleSave = async (plan: Omit<Plan, 'id'> & { id?: string }) => {
        try {
            const url = plan.id ? `/api/plans/${plan.id}` : '/api/plans'
            const method = plan.id ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(plan),
            })

            if (!response.ok) {
                throw new Error(`Failed to ${plan.id ? 'update' : 'create'} plan`)
            }

            fetchPlans()
            setEditingPlan(null)
            setIsCreating(false)
            toast.success(`Plan ${plan.id ? 'updated' : 'created'} successfully`)
        } catch (error) {
            console.error(`Error ${plan.id ? 'updating' : 'creating'} plan:`, error)
            toast.error(`Failed to ${plan.id ? 'update' : 'create'} plan`)
        }
    }

    const PlanForm = ({ plan, onSave, onCancel }: { plan: Plan | null, onSave: (plan: Omit<Plan, 'id'> & { id?: string }) => void, onCancel: () => void }) => {
        const [name, setName] = useState(plan?.name || '')
        const [price, setPrice] = useState(plan?.price.toString() || '')
        const [duration, setDuration] = useState(plan?.duration.toString() || '')
        const [stripeProductId, setStripeProductId] = useState(plan?.stripeProductId || '')
        const [stripePriceId, setStripePriceId] = useState(plan?.stripePriceId || '')

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault()
            onSave({
                id: plan?.id,
                name,
                price: Number(price),
                duration: Number(duration),
                stripeProductId,
                stripePriceId,
            })
        }

        return (
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Plan Name</Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="price">Price (in cents)</Label>
                    <Input
                        id="price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="duration">Duration (in days)</Label>
                    <Input
                        id="duration"
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="stripeProductId">Stripe Product ID</Label>
                    <Input
                        id="stripeProductId"
                        value={stripeProductId}
                        onChange={(e) => setStripeProductId(e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="stripePriceId">Stripe Price ID</Label>
                    <Input
                        id="stripePriceId"
                        value={stripePriceId}
                        onChange={(e) => setStripePriceId(e.target.value)}
                        required
                    />
                </div>
                <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        {plan ? 'Update Plan' : 'Create Plan'}
                    </Button>
                </div>
            </form>
        )
    }

    if (editingPlan || isCreating) {
        return (
            <PlanForm
                plan={editingPlan}
                onSave={handleSave}
                onCancel={() => {
                    setEditingPlan(null)
                    setIsCreating(false)
                }}
            />
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Subscription Plans</h2>
                <Button onClick={() => setIsCreating(true)}>Create New Plan</Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Stripe Product ID</TableHead>
                        <TableHead>Stripe Price ID</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {plans.map((plan) => (
                        <TableRow key={plan.id}>
                            <TableCell>{plan.name}</TableCell>
                            <TableCell>${(plan.price / 100).toFixed(2)}</TableCell>
                            <TableCell>{plan.duration} days</TableCell>
                            <TableCell>{plan.stripeProductId}</TableCell>
                            <TableCell>{plan.stripePriceId}</TableCell>
                            <TableCell>
                                <Button variant="outline" className="mr-2" onClick={() => setEditingPlan(plan)}>
                                    Edit
                                </Button>
                                <Button variant="destructive" onClick={() => {
                                    setPlanToDelete(plan)
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
                            Are you sure you want to delete this plan? This action cannot be undone.
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

