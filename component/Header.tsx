import Link from 'next/link'

/**
 * すりガラス効果付きStickyヘッダー
 * Apple公式サイト風のミニマルなナビゲーション
 */
export default function Header() {
    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/60">
            <nav className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
                {/* サイトタイトル */}
                <Link
                    href="/"
                    className="text-base font-semibold text-gray-900 tracking-tight hover:opacity-70 transition-opacity duration-300"
                >
                    sora-tech-blog
                </Link>

                {/* ナビゲーションリンク */}
                <div className="flex items-center gap-6">
                    <Link
                        href="/"
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-300"
                    >
                        Home
                    </Link>
                    <Link
                        href="/admin/create"
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-300"
                    >
                        Write
                    </Link>
                </div>
            </nav>
        </header>
    )
}
