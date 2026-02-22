'use client'

import { useState } from 'react'

/**
 * Markdownの書き方ガイド（管理者専用）
 * 折りたたみ式でフォームの邪魔にならないデザイン
 */
export default function MarkdownGuide() {
    const [isOpen, setIsOpen] = useState(false)

    const examples = [
        { title: '見出し', code: '## 大見出し\n### 中見出し\n#### 小見出し' },
        { title: 'テキスト装飾', code: '**太字テキスト**\n*斜体テキスト*\n~~取り消し線~~\n`インラインコード`' },
        { title: 'リスト', code: '- 箇条書き1\n- 箇条書き2\n\n1. 番号付き1\n2. 番号付き2' },
        { title: 'コードブロック', code: '```javascript\nconst hello = "Hello!"\nconsole.log(hello)\n```' },
        { title: 'ファイル名付きコードブロック', code: '```tsx:app/layout.tsx\nimport React from "react"\n```', note: '言語の後に :ファイルパス でファイル名タブが表示されます' },
        { title: '赤文字', code: '==ここが赤くなります==', note: '== で囲むと赤い強調表示になります' },
        { title: '画像', code: '![画像の説明](https://画像のURL)', note: '📷 画像アップローダーでアップロードしてURLを取得できます' },
        { title: 'リンク', code: '[表示テキスト](https://リンク先URL)' },
        { title: '引用', code: '> これは引用文です。' },
        { title: '区切り線', code: '---' },
    ]

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 flex items-center justify-between text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors duration-300"
            >
                <span>📖 Markdownの書き方ガイド</span>
                <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    ▼
                </span>
            </button>

            {isOpen && (
                <div className="px-6 pb-6 text-sm text-gray-600 space-y-4 border-t border-gray-200">
                    {examples.map((item) => (
                        <div key={item.title} className={item.title === '見出し' ? 'pt-4' : ''}>
                            <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                            {item.note && (
                                <p className="text-gray-400 text-xs mb-2">{item.note}</p>
                            )}
                            <pre className="bg-gray-100 rounded-lg p-3 text-xs font-mono whitespace-pre">{item.code}</pre>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
