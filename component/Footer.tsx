/**
 * ミニマルなフッター
 * コピーライトのみのシンプルなデザイン
 */
export default function Footer() {
    return (
        <footer className="border-t border-gray-200/60 mt-auto">
            <div className="max-w-4xl mx-auto px-6 py-8">
                <p className="text-sm text-gray-400 text-center">
                    © {new Date().getFullYear()} sora-tech-blog
                </p>
            </div>
        </footer>
    )
}
