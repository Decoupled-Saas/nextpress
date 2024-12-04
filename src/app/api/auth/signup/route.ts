import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { rateLimiter } from '@/lib/rate-limiter'
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '@/lib/email';
import WelcomeEmail from '@/emails/welcome-email';
import crypto from 'crypto';
import { verificationTokens } from '@/lib/db/schema';

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

        // Create verification token
        const token = crypto.randomBytes(32).toString('hex');
        await db.insert(verificationTokens).values({
            identifier: email,
            token,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        });

        // Send welcome email
        const verificationLink = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;
        await sendEmail({
            to: email,
            subject: 'Welcome to NextPress - Verify Your Email',
            react: WelcomeEmail({ username: name, verificationLink }),
        });

        return NextResponse.json({ message: 'User created successfully', userId: newUser.id }, { status: 201 })
    } catch (error) {
        console.error('Signup error:', error)
        return NextResponse.json({ message: 'An error occurred during signup' }, { status: 500 })
    }
}

