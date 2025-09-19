"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    // URLパスを解析して適切なページにリダイレクト
    const path = window.location.pathname
    const shareMatch = path.match(/^\/s\/(.+)$/)

    if (shareMatch) {
      // 共有ページの場合、クライアントサイドでレンダリング
      router.replace(`/share/${shareMatch[1]}`)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-dango-cream-100 via-dango-pink-50 to-dango-green-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dango-pink-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">読み込み中...</p>
      </div>
    </div>
  )
}