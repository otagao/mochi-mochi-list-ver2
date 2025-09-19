"use client"

import { useState } from 'react'
import { createBookmarkEvent } from '@/features/share/bookmark'
import { ensureAnonLogin } from '@/lib/firebase'
import type { Item } from './items'
import type { BaseListDoc } from '@/features/share/types'

interface Props {
  items: Item[]
}

export default function ShareButton({ items }: Props) {
  const [showModal, setShowModal] = useState(false)
  const [eventName, setEventName] = useState('')
  const [creatorName, setCreatorName] = useState('')
  const [shareUrl, setShareUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreateShare = async () => {
    if (!eventName.trim() || !creatorName.trim()) {
      alert('イベント名と作成者名を入力してください')
      return
    }

    setLoading(true)
    try {
      // 匿名ログインを確実に行う
      await ensureAnonLogin()

      // 現在のリストを共有用の形式に変換
      const baseList: BaseListDoc = {
        title: 'もちもちリスト',
        items: items.map(item => ({
          id: item.id,
          label: item.text,
          priority: item.priority
        }))
      }

      const result = await createBookmarkEvent({
        name: eventName,
        creatorName: creatorName,
        baseList
      })

      setShareUrl(result.shareUrl)
    } catch (error) {
      console.error('共有URL作成エラー:', error)
      alert('共有URLの作成に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      alert('URLをコピーしました！')
    } catch {
      // フォールバック
      const textarea = document.createElement('textarea')
      textarea.value = shareUrl
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      alert('URLをコピーしました！')
    }
  }

  const resetModal = () => {
    setShowModal(false)
    setEventName('')
    setCreatorName('')
    setShareUrl('')
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full px-4 py-3 bg-dango-pink-500 text-white rounded-lg shadow hover:bg-dango-pink-600 transition flex items-center justify-center gap-2 text-sm font-medium"
      >
        <span>🔗</span>
        <span>共有URL発行</span>
      </button>

      {/* モーダル */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            {!shareUrl ? (
              // URL発行前
              <>
                <h3 className="text-lg font-bold mb-4">共有URL発行</h3>
                <p className="text-sm text-gray-600 mb-4">
                  しおり的簡易共有：リストを他の人と共有できますが、チェック状態は保存されません。
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      イベント名
                    </label>
                    <input
                      type="text"
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      placeholder="例: 旅行の準備"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      作成者名
                    </label>
                    <input
                      type="text"
                      value={creatorName}
                      onChange={(e) => setCreatorName(e.target.value)}
                      placeholder="例: 田中太郎"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <button
                    onClick={handleCreateShare}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-dango-pink-500 text-white rounded hover:bg-dango-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? '作成中...' : 'URL発行'}
                  </button>
                  <button
                    onClick={resetModal}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    キャンセル
                  </button>
                </div>
              </>
            ) : (
              // URL発行後
              <>
                <h3 className="text-lg font-bold mb-4">共有URL発行完了</h3>
                <p className="text-sm text-gray-600 mb-4">
                  以下のURLを共有してください：
                </p>

                <div className="bg-gray-100 p-3 rounded mb-4 break-all text-sm">
                  {shareUrl}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="flex-1 px-4 py-2 bg-dango-green-500 text-white rounded hover:bg-dango-green-600"
                  >
                    📋 URLをコピー
                  </button>
                  <button
                    onClick={() => window.open(shareUrl, '_blank')}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    🔗 開く
                  </button>
                  <button
                    onClick={resetModal}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    閉じる
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}