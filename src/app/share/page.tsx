"use client"

import { Suspense } from 'react'
import SharePageContent from './SharePageContent'

export default function SharePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-dango-cream-100 via-dango-pink-50 to-dango-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dango-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    }>
      <SharePageContent />
    </Suspense>
  )
}