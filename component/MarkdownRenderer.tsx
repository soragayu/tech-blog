'use client'

import React from 'react'

import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

/**
 * Markdown描画コンポーネント
 * react-markdownを使用し、Apple風のTypographyで表示
 * rehype-highlightでシンタックスハイライト対応
 */

/**
 * ```tsx:app/layout.tsx 記法を前処理で分離する
 * → ファイル名情報を HTML コメントとして保持し、言語のみをコードブロックに渡す
 */
function preprocessContent(md: string): { text: string; filenames: Map<number, string> } {
    const filenames = new Map<number, string>()
    let blockIndex = 0
    let text = md

    // ```tsx:filepath 記法 → ファイル名を分離
    text = text.replace(/```(\w+):([^\n]+)/g, (_, lang, filepath) => {
        filenames.set(blockIndex++, filepath)
        return '```' + lang
    })

    // ==テキスト== 記法 → 赤文字に変換（コードブロック外のみ）
    text = text.replace(/(```[\s\S]*?```)|==(.+?)==/g, (match, codeBlock, redText) => {
        if (codeBlock) return codeBlock
        return `<span style="color: #ef4444; font-weight: 600">${redText}</span>`
    })

    return { text, filenames }
}

/**
 * コードブロック内の ==テキスト== を赤い span に変換するヘルパー
 */
function highlightRedText(children: React.ReactNode): React.ReactNode {
    return React.Children.map(children, (child) => {
        if (typeof child === 'string') {
            const parts = child.split(/(==(?:.+?)==)/g)
            if (parts.length === 1) return child
            return parts.map((part, i) => {
                const match = part.match(/^==(.+?)==$/)
                if (match) {
                    return <span key={i} style={{ color: '#ef4444', fontWeight: 600 }}>{match[1]}</span>
                }
                return part
            })
        }
        return child
    })
}
export default function MarkdownRenderer({ content }: { content: string }) {
    const { text, filenames } = preprocessContent(content)
    let blockIndex = 0

    return (
        <div className="prose">
            <Markdown
                rehypePlugins={[rehypeRaw]}
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
                    // コードブロックのスタイリング（ファイル名表示 + シンタックスハイライト対応）
                    pre: ({ children, ...props }) => {
                        const currentIndex = blockIndex++
                        const filename = filenames.get(currentIndex) || null

                        if (filename) {
                            return (
                                <div className="not-prose rounded-xl overflow-hidden border border-gray-200 my-6">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 border-b border-gray-200">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span className="text-sm font-mono text-gray-600">{filename}</span>
                                    </div>
                                    <pre {...props} className="!m-0 !rounded-none" style={{ padding: '1rem' }}>{children}</pre>
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
                        return (
                            <code className={className} {...props}>
                                {highlightRedText(children)}
                            </code>
                        )
                    },
                }}
            >
                {text}
            </Markdown>
        </div>
    )
}
