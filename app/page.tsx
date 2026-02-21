import { getPosts } from '@/utils/supabaseFunction'
import PostCard from '@/component/PostCard'

/**
 * トップページ
 * 最新の記事一覧をカード型で表示する
 */
export default async function Home() {
  const posts = await getPosts()

  return (
    <div className="min-h-screen bg-[#F5F5F7] px-6 py-24 sm:py-32">
      <div className="max-w-4xl mx-auto">
        {/* ヒーローセクション */}
        <section className="mb-24 text-center">
          <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight text-[#1D1D1F] text-balance mb-6">
            sora-tech-blog
          </h1>
          <p className="text-xl sm:text-2xl text-[#86868B] font-medium tracking-tight text-balance mx-auto max-w-2xl">
            趣味人が練習しているプログラミングについてのブログ
          </p>
        </section>

        {/* 記事一覧 */}
        <section>
          <h2 className="text-xs font-semibold text-[#86868B] uppercase tracking-widest mb-12 text-center">
            Latest Posts
          </h2>

          {posts.length > 0 ? (
            <div className="flex flex-col gap-12">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="py-32 px-8 text-center bg-white/70 backdrop-blur-md rounded-3xl ring-1 ring-black/5 shadow-sm">
              <p className="text-2xl font-semibold tracking-tight text-[#1D1D1F] text-balance">
                まだ記事がありません
              </p>
              <p className="mt-4 text-lg font-medium text-[#86868B] tracking-tight text-balance">
                最初の記事を書いてみましょう
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
