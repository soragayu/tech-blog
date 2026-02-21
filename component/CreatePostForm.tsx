'use client'

import { createPost } from '@/utils/supabaseFunction'
import { useActionState } from 'react'

/**
 * 記事投稿フォーム（クライアントコンポーネント）
 * タイトルとMarkdown本文を入力して投稿
 */
export default function CreatePostForm() {
    const [state, formAction, isPending] = useActionState(
        async (_prevState: { error: string } | null, formData: FormData) => {
            const result = await createPost(formData)
            // 成功時はredirectされるので、ここに来るのはエラー時のみ
            return result ?? null
        },
        null
    )

    return (
        <form action={formAction} className="space-y-8">
            {/* エラーメッセージ */}
            {state?.error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                    {state.error}
                </div>
            )}

            {/* タイトル */}
            <div>
                <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-600 mb-2"
                >
                    Title
                </label>
                <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    autoFocus
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-transparent transition-all duration-300 text-lg"
                    placeholder="記事のタイトル"
                />
            </div>

            {/* Markdown本文 */}
            <div>
                <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-600 mb-2"
                >
                    Content (Markdown)
                </label>
                <textarea
                    id="content"
                    name="content"
                    required
                    rows={20}
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-transparent transition-all duration-300 font-mono text-sm leading-relaxed resize-y"
                    placeholder="# 見出し&#10;&#10;Markdownで記事を書きましょう..."
                />
            </div>

            {/* 送信ボタン */}
            <div className="flex items-center gap-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-8 py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                    {isPending ? 'Publishing...' : 'Publish'}
                </button>

                {isPending && (
                    <span className="text-sm text-gray-400">投稿中...</span>
                )}
            </div>
        </form>
    )
}
