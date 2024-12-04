import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { rateLimiter } from '@/lib/rate-limiter'
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
    const rateLimiterResponse = rateLimiter(req)
    if (rateLimiterResponse) return rateLimiterResponse

    try {
        const { name, email, password } = await req.json()

        // Check if user already exists
        const existingUser = await db.select().from(users).where(eq(users.email, email));
        if (existingUser.length > 0) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 })
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create the user
        const [newUser] = await db.insert(users).values({
            id: uuidv4(),
            name,
            email,
            password: hashedPassword,
            role: 'user',
        }).returning();

        return NextResponse.json({ message: 'User created successfully' }, { status: 201 })
    } catch (error) {
        console.error('Signup error:', error)
        return NextResponse.json({ message: 'An error occurred during signup' }, { status: 500 })
    }
}

