'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import '@uiw/react-markdown-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

const MarkdownEditor = dynamic(
    () => import('@uiw/react-markdown-editor').then((mod) => mod.default),
    { ssr: false }
)

interface MarkdownEditorProps {
    initialValue: string
    onChange: (value: string) => void
}

export default function MarkdownEditorWrapper({ initialValue, onChange }: MarkdownEditorProps) {
    const [value, setValue] = useState(initialValue)

    const handleChange = (value: string) => {
        setValue(value)
        onChange(value)
    }

    return (
        <MarkdownEditor
            value={value}
            onChange={handleChange}
            style={{ height: '400px' }}
        />
    )
}

