import { isAuthenticated, getPostById } from '@/utils/supabaseFunction'
import { redirect, notFound } from 'next/navigation'
import EditPostForm from '@/component/EditPostForm'
import MarkdownGuide from '@/component/MarkdownGuide'
import ImageUploader from '@/component/ImageUploader'

/**
 * 記事編集ページ（管理者専用）
 */
export default async function AdminEditPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
        redirect('/login')
    }

    const { id } = await params
    const post = await getPostById(id)

    if (!post) {
        notFound()
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-16">
            <header className="mb-12">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                    Edit Post
                </h1>
                <p className="mt-3 text-gray-400">
                    記事を編集しましょう
                </p>
            </header>

            <MarkdownGuide />

            <div className="mt-4">
                <ImageUploader />
            </div>

            <div className="mt-8">
                <EditPostForm
                    id={post.id}
                    initialTitle={post.title}
                    initialContent={post.content}
                />
            </div>
        </div>
    )
}
