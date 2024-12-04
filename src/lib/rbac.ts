import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

type Role = 'user' | 'admin' | 'editor'

export async function checkRole(allowedRoles: Role[]) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        redirect('/api/auth/signin')
    }

    const userRole = session.user.role as Role

    if (!allowedRoles.includes(userRole)) {
        redirect('/unauthorized')
    }
}

