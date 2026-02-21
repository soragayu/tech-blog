import Link from 'next/link'
import type { Post } from '@/utils/supabaseFunction'

/**
 * 記事カードコンポーネント
 * ホバー時に微細なアニメーションを適用するApple風デザイン
 */
export default function PostCard({ post }: { post: Post }) {
    // 日付フォーマット
    const formattedDate = new Date(post.created_at).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    // Markdownの冒頭をプレーンテキストとして抽出（最大120文字）
    const excerpt = post.content
        .replace(/!\[[^\]]*\]\([^)]*\)/g, '')   // 画像 ![alt](url) を除去
        .replace(/\[[^\]]*\]\([^)]*\)/g, '')    // リンク [text](url) を除去
        .replace(/#{1,6}\s/g, '')               // 見出し記号を除去
        .replace(/```[\s\S]*?```/g, '')         // コードブロックを除去
        .replace(/`[^`]+`/g, '')                // インラインコードを除去
        .replace(/[*_~]/g, '')                  // Markdown装飾記号を除去
        .replace(/\n+/g, ' ')                   // 改行をスペースに
        .replace(/\s+/g, ' ')                   // 連続する空白を1つに
        .slice(0, 120)
        .trim()

    return (
        <Link href={`/posts/${post.id}`} className="block group">
            <article className="py-8 border-b border-gray-200/60 transition-all duration-300 group-hover:pl-2">
                {/* 投稿日 */}
                <time className="text-sm text-gray-400 tracking-wide">
                    {formattedDate}
                </time>

                {/* タイトル */}
                <h2 className="mt-2 text-2xl font-semibold text-gray-900 tracking-tight group-hover:text-gray-600 transition-colors duration-300">
                    {post.title}
                </h2>

                {/* 抜粋 */}
                {excerpt && (
                    <p className="mt-3 text-base text-gray-600 leading-relaxed">
                        {excerpt}…
                    </p>
                )}

                {/* 「読む」リンク */}
                <span className="inline-block mt-4 text-sm text-blue-600 group-hover:text-blue-800 transition-colors duration-300">
                    Read more →
                </span>
            </article>
        </Link>
    )
}
