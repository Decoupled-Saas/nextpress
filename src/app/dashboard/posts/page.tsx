import {Suspense} from "react";
import PostsContent from "@/app/dashboard/posts/posts-content";

export default function PostsPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Manage Posts</h1>
            <Suspense fallback={<div>Loading...</div>}>
                <PostsContent />
            </Suspense>
        </div>
    )
}
