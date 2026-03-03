'use client'

import { useState, useCallback } from 'react'

/**
 * コードブロック用コピーボタン
 * クリック時にコードをクリップボードにコピーし、チェックマークでフィードバック
 */
export default function CodeCopyButton({ code }: { code: string }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(code)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            // フォールバック: 古いブラウザ対応
            const textarea = document.createElement('textarea')
            textarea.value = code
            textarea.style.position = 'fixed'
            textarea.style.opacity = '0'
            document.body.appendChild(textarea)
            textarea.select()
            document.execCommand('copy')
            document.body.removeChild(textarea)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }, [code])

    return (
        <button
            onClick={handleCopy}
            aria-label={copied ? 'コピーしました' : 'コードをコピー'}
            className="
                absolute top-3 right-3
                p-1.5 rounded-md
                text-gray-400 hover:text-gray-600
                bg-white/80 hover:bg-white
                border border-gray-200/60
                backdrop-blur-sm
                opacity-0 group-hover:opacity-100
                transition-all duration-200
                cursor-pointer
            "
        >
            {copied ? (
                // チェックマークアイコン
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ) : (
                // コピーアイコン
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            )}
        </button>
    )
}
