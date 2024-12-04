import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getPosts } from '@/lib/posts'
import { getPages } from '@/lib/pages'
import { getMenuItems } from '@/lib/menu'

export default async function DashboardPage() {
    const posts = await getPosts()
    const pages = await getPages()
    const menuItems = await getMenuItems()

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Posts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{posts.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Pages</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{pages.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{menuItems.length}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

