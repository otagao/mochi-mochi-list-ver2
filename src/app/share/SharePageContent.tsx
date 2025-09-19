"use client"

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { loadBookmarkList, verifyCreatorName, updateBaseList, exportListToCSV } from '@/features/share/bookmark'
import type { BookmarkViewData, RenderItem, BaseListDoc } from '@/features/share/types'
import ShareChecklistItem from './ShareChecklistItem'
import ChecklistInput from '@/components/ChecklistInput'

// 優先度付きのソート関数（Checklist.tsxと同じ）
function sortItems(items: RenderItem[]): RenderItem[] {
  return [...items].sort((a, b) => {
    // チェックの有無で先後
    if (a.checked !== b.checked) {
      return a.checked ? 1 : -1
    }
    // 優先度で比較（1=高, 2=中, 3=低）
    return a.priority - b.priority
  })
}

export default function SharePageContent() {
  const searchParams = useSearchParams()
  const eventId = searchParams.get('id')

  const [data, setData] = useState<BookmarkViewData | null>(null)
  const [items, setItems] = useState<RenderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [showCreatorDialog, setShowCreatorDialog] = useState(false)
  const [creatorNameInput, setCreatorNameInput] = useState('')
  const [twoStageMode, setTwoStageMode] = useState(false)

  const loadData = useCallback(async () => {
    if (!eventId) {
      setError('イベントIDが指定されていません')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const result = await loadBookmarkList(eventId)
      setData(result)
      setItems(sortItems(result.items.map(item => ({
        ...item,
        isProcured: false // 初期状態では未調達
      }))))
    } catch (err) {
      setError(err instanceof Error ? err.message : '読み込みエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }, [eventId])

  useEffect(() => {
    loadData()
  }, [loadData])

  const toggleItem = (id: string) => {
    setItems(prev =>
      sortItems(
        prev.map(item => {
          if (item.id === id) {
            // 二段階モードで家の中にない場合はチェックできない
            if (twoStageMode && !item.isProcured) {
              return item
            }
            return { ...item, checked: !item.checked }
          }
          return item
        })
      )
    )
  }

  const toggleProcured = (id: string) => {
    setItems(prev =>
      sortItems(
        prev.map(item => {
          if (item.id === id) {
            const newIsProcured = !item.isProcured
            // 家の中にないとカバンチェックも外す
            return {
              ...item,
              isProcured: newIsProcured,
              checked: newIsProcured ? item.checked : false
            }
          }
          return item
        })
      )
    )
  }

  const handleCreatorVerification = async () => {
    if (!creatorNameInput.trim() || !eventId) return

    try {
      const isValid = await verifyCreatorName(eventId, creatorNameInput)
      if (isValid) {
        setIsEditMode(true)
        setShowCreatorDialog(false)
        setCreatorNameInput('')
      } else {
        alert('作成者名が一致しません')
      }
    } catch {
      alert('確認中にエラーが発生しました')
    }
  }

  const addItem = (text: string, priority: number = 2) => {
    if (!data) return
    const newItem: RenderItem = {
      id: Date.now().toString(),
      label: text,
      checked: false,
      priority: priority,
      isProcured: false
    }
    setItems(prev => sortItems([...prev, newItem]))
  }

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const updateItem = (id: string, newText: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, label: newText } : item
      )
    )
  }

  const updatePriority = (id: string, priority: number) => {
    setItems(prev =>
      sortItems(
        prev.map(item =>
          item.id === id ? { ...item, priority } : item
        )
      )
    )
  }

  const saveChanges = async () => {
    if (!data || !eventId) return

    try {
      const baseList: BaseListDoc = {
        title: data.title,
        items: items.map(item => ({
          id: item.id,
          label: item.label,
          priority: item.priority
        }))
      }
      await updateBaseList(eventId, baseList)
      setIsEditMode(false)
      alert('更新しました')
      loadData() // 再読み込み
    } catch {
      alert('更新中にエラーが発生しました')
    }
  }

  const handleExportCSV = () => {
    if (!data) return
    exportListToCSV({
      eventName: data.eventName,
      title: data.title,
      items
    })
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-dango-cream-100 via-dango-pink-50 to-dango-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dango-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-dango-cream-100 via-dango-pink-50 to-dango-green-50 flex items-center justify-center">
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow text-center">
          <p className="text-red-600 mb-4">❌ {error}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-dango-pink-500 text-white rounded hover:bg-dango-pink-600"
          >
            ホームに戻る
          </button>
        </div>
      </main>
    )
  }

  if (!data) return null

  return (
    <main className="min-h-screen bg-gradient-to-br from-dango-cream-100 via-dango-pink-50 to-dango-green-50">
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23f1f5f9' fillOpacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <div className="relative z-10 max-w-md mx-auto p-4">
        {/* 注意バナー */}
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4">
          <p className="text-sm">
            ⚠️ このページのチェック状態は保存されません。ページを閉じると消えます。<br />
            <strong>CSVエクスポート</strong>やスクリーンショットで保存してください。
          </p>
        </div>

        {/* メインコンテンツ */}
        <div className="bg-white rounded shadow p-4">
          {/* ヘッダー */}
          <div className="mb-4">
            <h1 className="text-xl font-bold text-dango-pink-700">{data.eventName}</h1>
            <p className="text-sm text-gray-600">作成者: {data.creatorName}</p>
            <h2 className="text-lg font-semibold mt-2">{data.title}</h2>
          </div>

          {/* 二段階チェックリスト切り替えボタン */}
          <div className="mb-4">
            <button
              onClick={() => setTwoStageMode(!twoStageMode)}
              className={`px-4 py-2 rounded font-medium text-sm transition-all ${
                twoStageMode
                  ? 'bg-dango-green-500 text-white shadow-md hover:bg-dango-green-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {twoStageMode ? '🏠🎒 二段階チェックモード ON' : '二段階チェックモード OFF'}
            </button>
          </div>

          {/* スクロール追従ラベル */}
          {twoStageMode && (
            <div className="sticky top-0 z-10 bg-gray-100/95 backdrop-blur-sm border-b-2 border-gray-300/50 py-3 mb-4 shadow-sm">
              <div className="flex justify-center gap-8 text-sm font-semibold text-gray-800">
                <div className="flex items-center gap-1 px-3 py-1 bg-dango-pink-300 rounded-full">
                  <span>🏠</span>
                  <span>家の中にある</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-dango-green-300 rounded-full">
                  <span>🎒</span>
                  <span>カバンに入れた</span>
                </div>
              </div>
            </div>
          )}

          {/* アクションボタン */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={handleExportCSV}
              className="flex-1 px-3 py-2 bg-dango-green-500 text-white rounded text-sm hover:bg-dango-green-600"
            >
              📁 CSV保存
            </button>
            {!isEditMode && (
              <button
                onClick={() => setShowCreatorDialog(true)}
                className="flex-1 px-3 py-2 bg-dango-pink-500 text-white rounded text-sm hover:bg-dango-pink-600"
              >
                ✏️ 編集
              </button>
            )}
            {isEditMode && (
              <>
                <button
                  onClick={saveChanges}
                  className="flex-1 px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  💾 保存
                </button>
                <button
                  onClick={() => setIsEditMode(false)}
                  className="px-3 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                >
                  ✖️
                </button>
              </>
            )}
          </div>

          {/* チェックリスト */}
          <ul className="space-y-2 mb-4">
            {items.map(item => (
              <ShareChecklistItem
                key={item.id}
                item={item}
                onToggle={toggleItem}
                onDelete={isEditMode ? deleteItem : undefined}
                onUpdate={isEditMode ? updateItem : undefined}
                onPriorityChange={isEditMode ? updatePriority : undefined}
                onToggleProcured={toggleProcured}
                isEditMode={isEditMode}
                twoStageMode={twoStageMode}
              />
            ))}
          </ul>

          {/* 編集モード時の入力フォーム */}
          {isEditMode && (
            <ChecklistInput onAdd={addItem} />
          )}
        </div>

        {/* 作成者確認ダイアログ */}
        {showCreatorDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-sm mx-4">
              <h3 className="text-lg font-bold mb-4">作成者確認</h3>
              <p className="text-sm text-gray-600 mb-4">
                このリストを編集するには作成者名を入力してください
              </p>
              <input
                type="text"
                value={creatorNameInput}
                onChange={(e) => setCreatorNameInput(e.target.value)}
                placeholder="作成者名"
                className="w-full p-2 border rounded mb-4"
                onKeyDown={(e) => e.key === 'Enter' && handleCreatorVerification()}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreatorVerification}
                  className="flex-1 px-4 py-2 bg-dango-pink-500 text-white rounded hover:bg-dango-pink-600"
                >
                  確認
                </button>
                <button
                  onClick={() => {
                    setShowCreatorDialog(false)
                    setCreatorNameInput('')
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}