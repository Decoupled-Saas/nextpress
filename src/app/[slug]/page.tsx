/* eslint-disable */
import { getPage } from '@/lib/pages'
import Layout from '@/components/layout'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'

interface PageProps {
    params: {
        slug: string
    }
}

type Params = Promise<{ slug: string[] }>

export default async function Page({ params }: {params: Params}) {
    const { slug } = await params;

    const page = await getPage(slug)

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

