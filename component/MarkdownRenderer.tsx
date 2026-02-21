'use client'

import Markdown from 'react-markdown'

/**
 * Markdown描画コンポーネント
 * react-markdownを使用し、Apple風のTypographyで表示
 */
export default function MarkdownRenderer({ content }: { content: string }) {
    return (
        <div className="prose">
            <Markdown
                components={{
                    // 見出しにトラッキングとウェイトを適用
                    h1: ({ children, ...props }) => (
                        <h1 {...props}>{children}</h1>
                    ),
                    h2: ({ children, ...props }) => (
                        <h2 {...props}>{children}</h2>
                    ),
                    h3: ({ children, ...props }) => (
                        <h3 {...props}>{children}</h3>
                    ),
                    // リンクを新規タブで開く
                    a: ({ children, ...props }) => (
                        <a target="_blank" rel="noopener noreferrer" {...props}>
                            {children}
                        </a>
                    ),
                    // コードブロックのスタイリング
                    code: ({ children, className, ...props }) => {
                        const isInline = !className
                        if (isInline) {
                            return <code {...props}>{children}</code>
                        }
                        return (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        )
                    },
                }}
            >
                {content}
            </Markdown>
        </div>
    )
}
