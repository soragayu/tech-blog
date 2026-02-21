'use client'

import { useState } from 'react'
import { uploadImage } from '@/utils/supabaseFunction'

/**
 * 画像アップローダーコンポーネント
 * 複数画像をアップロードし、MarkdownのURLをクリップボードにコピー
 */
export default function ImageUploader() {
    const [isUploading, setIsUploading] = useState(false)
    const [results, setResults] = useState<{ url: string }[]>([])
    const [error, setError] = useState<string | null>(null)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        setError(null)

        const formData = new FormData()
        formData.append('file', file)

        const res = await uploadImage(formData)

        if (res.error) {
            setError(res.error)
        } else if (res.url) {
            setResults((prev) => [...prev, { url: res.url! }])
        }

        setIsUploading(false)
        // ファイル入力をリセット（次のファイルを選べるように）
        e.target.value = ''
    }

    const copyMarkdown = (url: string) => {
        navigator.clipboard.writeText(`![画像の説明](${url})`)
        alert('Markdown形式でコピーしました！本文に貼り付けてください。')
    }

    const removeResult = (index: number) => {
        setResults((prev) => prev.filter((_, i) => i !== index))
    }

    return (
        <div className="border border-gray-200 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-medium text-gray-900">📷 画像アップロード</h3>
            <p className="text-xs text-gray-400">
                画像をアップロードすると、本文に貼り付けられるMarkdownコードが生成されます（何枚でもアップロード可能）
            </p>

            {/* ファイル選択 */}
            <label className="block">
                <span className="sr-only">画像を選択</span>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    disabled={isUploading}
                    className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2.5 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-medium
            file:bg-gray-900 file:text-white
            hover:file:bg-gray-800
            file:cursor-pointer file:transition-colors file:duration-300
            disabled:opacity-50 disabled:cursor-not-allowed"
                />
            </label>

            {/* ローディング */}
            {isUploading && (
                <p className="text-sm text-gray-400">アップロード中...</p>
            )}

            {/* エラー */}
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}

            {/* アップロード済み画像一覧 */}
            {results.length > 0 && (
                <div className="space-y-3">
                    <p className="text-xs font-medium text-gray-500">
                        アップロード済み ({results.length}枚)
                    </p>
                    {results.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <img
                                src={item.url}
                                alt={`アップロード画像 ${index + 1}`}
                                className="w-16 h-16 object-cover rounded-md border border-gray-200 shrink-0"
                            />
                            <code className="flex-1 text-xs font-mono text-gray-500 truncate">
                                ![画像]({item.url})
                            </code>
                            <button
                                type="button"
                                onClick={() => copyMarkdown(item.url)}
                                className="px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg hover:bg-gray-800 transition-colors shrink-0"
                            >
                                コピー
                            </button>
                            <button
                                type="button"
                                onClick={() => removeResult(index)}
                                className="text-gray-300 hover:text-red-400 transition-colors shrink-0"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
