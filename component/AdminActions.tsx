'use client'

import { deletePost } from '@/utils/supabaseFunction'
import Link from 'next/link'
import { useTransition } from 'react'

/**
 * 管理者用の記事操作ボタン（編集・削除）
 */
export default function AdminActions({ postId }: { postId: string }) {
    const [isPending, startTransition] = useTransition()

    const handleDelete = () => {
        if (!confirm('本当にこの記事を削除しますか？この操作は取り消せません。')) {
            return
        }
        startTransition(async () => {
            await deletePost(postId)
        })
    }

    return (
        <div className="flex items-center gap-3">
            <Link
                href={`/admin/edit/${postId}`}
                className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors duration-300"
            >
                ✏️ 編集
            </Link>
            <button
                onClick={handleDelete}
                disabled={isPending}
                className="px-5 py-2 bg-white text-red-500 text-sm font-medium rounded-lg border border-red-200 hover:bg-red-50 disabled:opacity-50 transition-colors duration-300"
            >
                {isPending ? '削除中...' : '🗑️ 削除'}
            </button>
        </div>
    )
}
