import Link from 'next/link'
import { getPosts } from '@/lib/posts'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default async function BlogPage() {
    const posts = await getPosts()

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <Card key={post.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle>{post.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-muted-foreground">
                                {post.content.length > 150
                                    ? `${post.content.substring(0, 150)}...`
                                    : post.content}
                            </p>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {new Date(post.date).toLocaleDateString()}
              </span>
                            <Link
                                href={`/post/${post.slug}`}
                                className="text-primary hover:underline"
                            >
                                Read more
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}

