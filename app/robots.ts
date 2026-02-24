import type { MetadataRoute } from 'next'

/**
 * robots.txt 生成
 * クローラーのアクセスルールとsitemapの場所を定義
 */
export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://sora-tech-blog.vercel.app'

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/login/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
