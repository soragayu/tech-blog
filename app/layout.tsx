import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import Header from "@/component/Header";
import Footer from "@/component/Footer";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google'

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sora-tech-blog.vercel.app"),
  title: "sora-tech-blog",
  description: "趣味人が練習しているプログラミングについてのブログ",
  verification: {
    google: "9RW057h1Via-yehwjiEZSbPd-E8zCgrV0MZ9Dt5ICsI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <GoogleAnalytics gaId="G-3GJ81VQZK4" />
      </body>
    </html>
  );
}
