"use client"

import { useState } from "react"
import type { RenderItem } from '@/features/share/types'

type Props = {
  item: RenderItem
  onToggle: (id: string) => void
  onDelete?: (id: string) => void
  onUpdate?: (id: string, newText: string) => void
  onPriorityChange?: (id: string, priority: number) => void
  onToggleProcured?: (id: string) => void
  isEditMode?: boolean
  twoStageMode?: boolean
}

// 優先度ラベル
const priorityLabels: Record<number, string> = {
  1: "高",
  2: "中",
  3: "低",
}

export default function ShareChecklistItem({
  item,
  onToggle,
  onDelete,
  onUpdate,
  onPriorityChange,
  onToggleProcured,
  isEditMode = false,
  twoStageMode = false
}: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(item.label)

  const handleEdit = () => {
    if (!isEditMode) return
    setIsEditing(true)
    setEditText(item.label)
  }

  const handleSave = () => {
    if (onUpdate && editText.trim()) {
      onUpdate(item.id, editText.trim())
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditText(item.label)
    setIsEditing(false)
  }

  const handlePriorityChange = (priority: number) => {
    if (isEditMode && onPriorityChange) {
      onPriorityChange(item.id, priority)
    }
  }

  // 優先度による背景色を取得
  const priorityBg = item.priority === 1 ? 'bg-red-100 border-red-300' :
                     item.priority === 3 ? 'bg-green-100 border-green-300' :
                     'bg-yellow-100 border-yellow-300' // デフォルトは中優先度

  return (
    <li className={`
      flex items-center p-3 border rounded-lg transition-all
      ${item.checked ? `opacity-75 ${priorityBg}` : priorityBg}
    `}>
      {/* 二段階チェック: 家の中にあるボタン */}
      {twoStageMode && (
        <button
          onClick={() => onToggleProcured && onToggleProcured(item.id)}
          className={`
            flex-shrink-0 w-5 h-5 rounded border-2 mr-2 flex items-center justify-center transition-colors text-xs
            ${item.isProcured
              ? 'bg-dango-pink-500 border-dango-pink-500 text-white'
              : 'border-gray-300 hover:border-dango-pink-400'
            }
          `}
          title="家の中にある"
        >
          {item.isProcured && <span className="text-white text-xs">🏠</span>}
        </button>
      )}

      {/* チェックボックス（カバンに入れた） */}
      <button
        onClick={() => onToggle(item.id)}
        className={`
          flex-shrink-0 w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-colors
          ${item.checked
            ? 'bg-dango-green-500 border-dango-green-500 text-white'
            : 'border-gray-300 hover:border-dango-green-400'
          }
          ${twoStageMode && !item.isProcured ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        title={twoStageMode ? "カバンに入れた" : "完了"}
        disabled={twoStageMode && !item.isProcured}
      >
        {item.checked && (
          twoStageMode ? (
            <span className="text-white text-xs">🎒</span>
          ) : (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )
        )}
      </button>

      {/* テキスト部分 */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave()
                if (e.key === 'Escape') handleCancel()
              }}
              className="flex-1 px-2 py-1 border rounded text-sm"
              autoFocus
            />
            <button
              onClick={handleSave}
              className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
            >
              保存
            </button>
            <button
              onClick={handleCancel}
              className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
            >
              キャンセル
            </button>
          </div>
        ) : (
          <span
            onClick={handleEdit}
            className={`
              block text-sm break-words cursor-pointer
              ${item.checked ? 'line-through text-gray-500' : 'text-gray-900'}
              ${isEditMode ? 'hover:bg-gray-100 rounded px-1' : ''}
            `}
          >
            {item.label}
          </span>
        )}
      </div>

      {/* 優先度バッジ */}
      <div className="flex items-center gap-2 ml-2">
        {isEditMode ? (
          <select
            value={item.priority}
            onChange={(e) => handlePriorityChange(Number(e.target.value))}
            className="text-xs border rounded px-1 py-0.5"
          >
            <option value={1}>高</option>
            <option value={2}>中</option>
            <option value={3}>低</option>
          </select>
        ) : (
          <span className="text-xs px-2 py-1 rounded font-medium bg-white/50">
            {priorityLabels[item.priority] || '中'}
          </span>
        )}

        {/* 削除ボタン（編集モード時のみ） */}
        {isEditMode && onDelete && (
          <button
            onClick={() => onDelete(item.id)}
            className="flex-shrink-0 w-6 h-6 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors flex items-center justify-center"
            title="削除"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </li>
  )
}