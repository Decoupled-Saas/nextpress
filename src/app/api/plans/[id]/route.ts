import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from "@/lib/auth"
import { db } from '@/lib/db'
import { subscriptionPlans } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import stripe from '@/lib/stripe'

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const id = params.id
    const { name, price, duration, stripeProductId, stripePriceId } = await request.json()

    if (!name || !price || !duration || !stripeProductId || !stripePriceId) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    try {
        // Verify that the Stripe Product and Price exist
        await stripe.products.retrieve(stripeProductId)
        await stripe.prices.retrieve(stripePriceId)

        const [updatedPlan] = await db.update(subscriptionPlans)
            .set({ name, price, duration, stripeProductId, stripePriceId })
            .where(eq(subscriptionPlans.id, id))
            .returning()

        if (!updatedPlan) {
            return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
        }

        return NextResponse.json(updatedPlan, { status: 200 })
    } catch (error) {
        console.error('Error updating plan:', error)
        return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const id = params.id

    try {
        const [deletedPlan] = await db.delete(subscriptionPlans)
            .where(eq(subscriptionPlans.id, id))
            .returning()

        if (!deletedPlan) {
            return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
        }

        // Note: We're not deleting the Stripe Product or Price here
        // You may want to archive them in Stripe instead

        return NextResponse.json({ message: 'Plan deleted successfully' }, { status: 200 })
    } catch (error) {
        console.error('Error deleting plan:', error)
        return NextResponse.json({ error: 'Failed to delete plan' }, { status: 500 })
    }
}

