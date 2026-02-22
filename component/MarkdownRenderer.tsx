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
                    // コードブロックのスタイリング（```tsx:ファイルパス 記法対応）
                    pre: ({ children, ...props }) => {
                        // children から code 要素の className を取得してファイル名を抽出
                        const codeChild = Array.isArray(children) ? children[0] : children
                        const codeProps = (codeChild as React.ReactElement)?.props as Record<string, string> | undefined
                        const className = codeProps?.className || ''
                        const match = className.match(/^language-([^:]+):(.+)$/)
                        const filename = match ? match[2] : null

                        if (filename) {
                            return (
                                <div className="not-prose rounded-xl overflow-hidden border border-gray-200 my-6">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 border-b border-gray-200">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span className="text-sm font-mono text-gray-600">{filename}</span>
                                    </div>
                                    <pre {...props} className="!mt-0 !rounded-t-none">
                                        {children}
                                    </pre>
                                </div>
                            )
                        }
                        return <pre {...props}>{children}</pre>
                    },
                    code: ({ children, className, ...props }) => {
                        const isInline = !className
                        if (isInline) {
                            return <code {...props}>{children}</code>
                        }
                        // ```tsx:path 記法の場合、language-tsx のみを className に設定
                        const match = className?.match(/^language-([^:]+):(.+)$/)
                        const langClass = match ? `language-${match[1]}` : className
                        return (
                            <code className={langClass} {...props}>
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
