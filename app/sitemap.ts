import type { MetadataRoute } from 'next'
import { createClient } from '@/utils/supabase/server'

/**
 * 動的サイトマップ生成
 * Supabaseから全記事を取得し、GoogleクローラーがすべてのURLを発見できるようにする
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://sora-tech-blog.vercel.app'

    // Supabaseから全記事のIDと作成日を取得
    const supabase = await createClient()
    const { data: posts } = await supabase
        .from('posts')
        .select('id, created_at')
        .order('created_at', { ascending: false })

    // 記事ページのURL一覧を生成
    const postEntries: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
        url: `${baseUrl}/posts/${post.id}`,
        lastModified: new Date(post.created_at),
        changeFrequency: 'monthly',
        priority: 0.7,
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        ...postEntries,
    ]
}
