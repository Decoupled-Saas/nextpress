import { getPost } from "@/lib/posts";
import Layout from "@/components/layout";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PostPage(props: PostPageProps) {
  const params = await props.params;
  const post = await getPost(params.slug);

  if (!post || post.status !== "published") {
    notFound();
  }

  return (
    <Layout>
      <article className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-4">
          {new Date(post.date).toLocaleDateString()}
        </p>
        <div className="prose max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
    </Layout>
  );
}
