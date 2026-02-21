import { getPostById, isAuthenticated } from '@/utils/supabaseFunction'
import MarkdownRenderer from '@/component/MarkdownRenderer'
import AdminActions from '@/component/AdminActions'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

/**
 * 動的メタデータ生成
 */
export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>
}): Promise<Metadata> {
    const { id } = await params
    const post = await getPostById(id)

    if (!post) {
        return { title: '記事が見つかりません - sora-tech-blog' }
    }

    return {
        title: `${post.title} - sora-tech-blog`,
        description: post.content.slice(0, 160).replace(/[#*_`~\[\]\n]/g, ''),
    }
}

/**
 * 記事詳細ページ
 * MarkdownRendererでcontentを美しく表示
 */
export default async function PostPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const [post, authenticated] = await Promise.all([
        getPostById(id),
        isAuthenticated(),
    ])

    if (!post) {
        notFound()
    }

    // 日付フォーマット
    const formattedDate = new Date(post.created_at).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    return (
        <div className="max-w-4xl mx-auto px-6 py-16">
            {/* 戻るリンク */}
            <Link
                href="/"
                className="inline-block text-sm text-gray-400 hover:text-gray-600 transition-colors duration-300 mb-12"
            >
                ← Back to Home
            </Link>

            {/* 記事ヘッダー */}
            <header className="mb-12">
                <time className="text-sm text-gray-400 tracking-wide">
                    {formattedDate}
                </time>
                <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                    {post.title}
                </h1>
                {authenticated && (
                    <div className="mt-6">
                        <AdminActions postId={post.id} />
                    </div>
                )}
            </header>

            {/* 区切り線 */}
            <hr className="border-gray-200/60 mb-12" />

            {/* 記事本文 */}
            <article className="mx-auto">
                <MarkdownRenderer content={post.content} />
            </article>

            {/* フッターナビゲーション */}
            <div className="mt-20 pt-8 border-t border-gray-200/60">
                <Link
                    href="/"
                    className="text-sm text-gray-400 hover:text-gray-600 transition-colors duration-300"
                >
                    ← Back to Home
                </Link>
            </div>
        </div>
    )
}
