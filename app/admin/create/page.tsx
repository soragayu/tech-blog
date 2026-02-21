import { isAuthenticated } from '@/utils/supabaseFunction'
import { redirect } from 'next/navigation'
import CreatePostForm from '@/component/CreatePostForm'
import MarkdownGuide from '@/component/MarkdownGuide'
import ImageUploader from '@/component/ImageUploader'

/**
 * 管理者用記事投稿ページ
 * 未認証ならログインにリダイレクト
 */
export default async function AdminCreatePage() {
    // 認証チェック
    const authenticated = await isAuthenticated()
    if (!authenticated) {
        redirect('/login')
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-16">
            <header className="mb-12">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                    New Post
                </h1>
                <p className="mt-3 text-gray-400">
                    Markdownで記事を書きましょう
                </p>
            </header>

            <MarkdownGuide />

            <div className="mt-4">
                <ImageUploader />
            </div>

            <div className="mt-8">
                <CreatePostForm />
            </div>
        </div>
    )
}
