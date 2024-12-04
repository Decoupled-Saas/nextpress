import Layout from '@/components/layout'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function UnauthorizedPage() {
    return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <h1 className="text-4xl font-bold mb-4">Unauthorized Access</h1>
                <p className="text-xl mb-8">You do not have permission to access this page.</p>
                <Button asChild>
                    <Link href="/">Return to Home</Link>
                </Button>
            </div>
        </Layout>
    )
}
