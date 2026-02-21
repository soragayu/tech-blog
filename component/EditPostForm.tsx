'use client'

import { updatePost } from '@/utils/supabaseFunction'
import { useActionState } from 'react'
import ImageUploader from '@/component/ImageUploader'

/**
 * 記事編集フォーム（クライアントコンポーネント）
 */
export default function EditPostForm({
    id,
    initialTitle,
    initialContent,
}: {
    id: string
    initialTitle: string
    initialContent: string
}) {
    const [state, formAction, isPending] = useActionState(
        async (_prevState: { error: string } | null, formData: FormData) => {
            const result = await updatePost(formData)
            return result ?? null
        },
        null
    )

    return (
        <form action={formAction} className="space-y-8">
            <input type="hidden" name="id" value={id} />

            {state?.error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                    {state.error}
                </div>
            )}

            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-600 mb-2">
                    Title
                </label>
                <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    defaultValue={initialTitle}
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-transparent transition-all duration-300 text-lg"
                />
            </div>

            <ImageUploader />

            <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-600 mb-2">
                    Content (Markdown)
                </label>
                <textarea
                    id="content"
                    name="content"
                    required
                    rows={20}
                    defaultValue={initialContent}
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-transparent transition-all duration-300 font-mono text-sm leading-relaxed resize-y"
                />
            </div>

            <div className="flex items-center gap-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-8 py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                    {isPending ? 'Updating...' : 'Update'}
                </button>
                {isPending && <span className="text-sm text-gray-400">更新中...</span>}
            </div>
        </form>
    )
}
