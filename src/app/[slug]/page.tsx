import { getPage } from '@/lib/pages'
import Layout from '@/components/layout'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'

export default async function Page({ params }: { params: { slug: string } }) {
    const page = await getPage(params.slug)

    if (!page || page.status !== 'published') {
        notFound()
    }

    return (
        <Layout>
            <article>
                <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
                <div className="prose max-w-none">
                    <ReactMarkdown>{page.content}</ReactMarkdown>
                </div>
            </article>
        </Layout>
    )
}