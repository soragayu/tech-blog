'use client'

import { signIn } from '@/utils/supabaseFunction'
import { useActionState } from 'react'

/**
 * ログインページ
 * 管理者パスワードのみのシンプルなフォーム
 */
export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(
        async (_prevState: { error: string } | null, formData: FormData) => {
            const result = await signIn(formData)
            // signIn が成功した場合は redirect されるので、
            // ここに到達するのはエラーの場合のみ
            return result ?? null
        },
        null
    )

    return (
        <div className="max-w-md mx-auto px-6 py-32">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                    Sign In
                </h1>
                <p className="mt-3 text-gray-400">
                    管理者パスワードを入力してください
                </p>
            </div>

            <form action={formAction} className="space-y-6">
                {/* エラーメッセージ */}
                {state?.error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                        {state.error}
                    </div>
                )}

                {/* パスワード入力 */}
                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-600 mb-2"
                    >
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        autoFocus
                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-transparent transition-all duration-300"
                        placeholder="••••••••"
                    />
                </div>

                {/* 送信ボタン */}
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                    {isPending ? 'Signing in...' : 'Sign In'}
                </button>
            </form>
        </div>
    )
}
