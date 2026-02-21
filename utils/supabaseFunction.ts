'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// ============================================
// 認証関連（環境変数ベースのパスワード認証）
// ============================================

const AUTH_COOKIE_NAME = 'admin_session'
const AUTH_COOKIE_VALUE = 'authenticated'

/**
 * 管理者ログイン
 * 環境変数 ADMIN_PASSWORD と照合し、一致すればHTTPOnly Cookieをセット
 */
export async function signIn(formData: FormData) {
    const password = formData.get('password') as string
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminPassword) {
        return { error: 'サーバー設定エラー: ADMIN_PASSWORDが未設定です' }
    }

    if (password !== adminPassword) {
        return { error: 'パスワードが正しくありません' }
    }

    const cookieStore = await cookies()
    cookieStore.set(AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7日間
        path: '/',
    })

    redirect('/admin/create')
}

/**
 * 管理者ログアウト
 * 認証用Cookieを削除
 */
export async function signOut() {
    const cookieStore = await cookies()
    cookieStore.delete(AUTH_COOKIE_NAME)
    redirect('/')
}

/**
 * 管理者認証チェック
 * Cookie を確認してログイン状態かどうかを返す
 */
export async function isAuthenticated(): Promise<boolean> {
    const cookieStore = await cookies()
    const session = cookieStore.get(AUTH_COOKIE_NAME)
    return session?.value === AUTH_COOKIE_VALUE
}

// ============================================
// 記事 CRUD 操作
// ============================================

/** 記事の型定義 */
export type Post = {
    id: string
    title: string
    content: string
    created_at: string
}

/**
 * 全記事取得（新しい順）
 */
export async function getPosts(): Promise<Post[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('posts')
        .select('id, title, content, created_at')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('記事取得エラー:', error.message)
        return []
    }

    return data ?? []
}

/**
 * 記事IDで単一記事を取得
 */
export async function getPostById(id: string): Promise<Post | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('posts')
        .select('id, title, content, created_at')
        .eq('id', id)
        .single()

    if (error) {
        console.error('記事取得エラー:', error.message)
        return null
    }

    return data
}

/**
 * 新規記事を作成（認証チェック付き）
 */
export async function createPost(formData: FormData) {
    // 認証チェック
    const authenticated = await isAuthenticated()
    if (!authenticated) {
        return { error: '認証されていません' }
    }

    const title = formData.get('title') as string
    const content = formData.get('content') as string

    if (!title || !content) {
        return { error: 'タイトルと本文を入力してください' }
    }

    const supabase = await createClient()
    const { error } = await supabase
        .from('posts')
        .insert({ title, content })

    if (error) {
        console.error('記事作成エラー:', error.message)
        return { error: '記事の作成に失敗しました' }
    }

    redirect('/')
}

// ============================================
// 画像アップロード（Supabase Storage）
// ============================================

/**
 * 画像をSupabase Storageにアップロード
 * 公開URLを返す
 */
export async function uploadImage(formData: FormData) {
    // 認証チェック
    const authenticated = await isAuthenticated()
    if (!authenticated) {
        return { error: '認証されていません', url: null }
    }

    const file = formData.get('file') as File
    if (!file || file.size === 0) {
        return { error: 'ファイルを選択してください', url: null }
    }

    // ファイルサイズチェック（5MB以下）
    if (file.size > 5 * 1024 * 1024) {
        return { error: 'ファイルサイズは5MB以下にしてください', url: null }
    }

    // ユニークなファイル名を生成
    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    // FileをBufferに変換（Server Action経由で安定して送るため）
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const supabase = await createClient()
    const { error } = await supabase.storage
        .from('blog-images')
        .upload(fileName, buffer, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type,
        })

    if (error) {
        console.error('画像アップロードエラー:', error.message)
        return { error: `アップロード失敗: ${error.message}`, url: null }
    }

    // 公開URLを取得
    const { data: urlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName)

    return { error: null, url: urlData.publicUrl }
}

// ============================================
// 記事の編集・削除
// ============================================

/**
 * 記事を削除（認証チェック付き）
 */
export async function deletePost(id: string) {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
        return { error: '認証されていません' }
    }

    const supabase = await createClient()
    const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('記事削除エラー:', error.message)
        return { error: '記事の削除に失敗しました' }
    }

    redirect('/')
}

/**
 * 記事を更新（認証チェック付き）
 */
export async function updatePost(formData: FormData) {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
        return { error: '認証されていません' }
    }

    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const content = formData.get('content') as string

    if (!id || !title || !content) {
        return { error: 'すべてのフィールドを入力してください' }
    }

    const supabase = await createClient()
    const { error } = await supabase
        .from('posts')
        .update({ title, content })
        .eq('id', id)

    if (error) {
        console.error('記事更新エラー:', error.message)
        return { error: '記事の更新に失敗しました' }
    }

    redirect(`/posts/${id}`)
}


