"use client"

import { useState } from "react"
import { Item } from "./items"

type Props = {
  item: Item
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, newText: string) => void
  onToggleProcured?: (id: string) => void
  onPriorityChange?: (id: string, priority: number) => void
  twoStageMode?: boolean
}

// 優先度ラベルと色
const priorityLabels: Record<number, string> = {
  1: "高",
  2: "中",
  3: "低",
}

// 優先度ごとの背景・ボーダー色
const priorityColors: Record<number, string> = {
  1: "bg-red-100 border-red-300",
  2: "bg-yellow-100 border-yellow-300",
  3: "bg-green-100 border-green-300",
}

// 優先度ごとの文字色（ホバー時またはチェック済み時に適用）
const priorityTextColors: Record<number, string> = {
  1: "text-dango-pink-600",
  2: "text-dango-cream-700",
  3: "text-dango-green-600",
}

export default function ChecklistItem({
  item,
  onToggle,
  onDelete,
  onUpdate,
  onToggleProcured,
  onPriorityChange,
  twoStageMode
}: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(item.text)

  const handleTextClick = () => {
    if (!item.isChecked) setIsEditing(true)
  }

  const handleSave = () => {
    if (editText.trim()) onUpdate(item.id, editText.trim())
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditText(item.text)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave()
    else if (e.key === "Escape") handleCancel()
  }

  // テキストのクラスを動的に生成
  const textClass = `block text-lg sm:text-xl font-medium transition-colors duration-200 cursor-pointer ${
    item.isChecked
      ? `line-through ${priorityTextColors[item.priority]}`
      : `text-gray-800 hover:${priorityTextColors[item.priority]}`
  }`

  return (
    <div
      className={`group relative rounded-2xl border p-4 sm:p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1
        ${priorityColors[item.priority]}`}
    >
      <div className="flex items-center gap-4">
        {/* 二段階チェックボックス */}
        {twoStageMode && onToggleProcured && (
          <div className="flex gap-2">
            <div className="relative">
              <input
                type="checkbox"
                id={`${item.id}-procured`}
                checked={item.isProcured || false}
                onChange={() => onToggleProcured(item.id)}
                className="sr-only"
              />
              <label
                htmlFor={`${item.id}-procured`}
                className={`flex items-center justify-center w-6 h-6 rounded-md border cursor-pointer
                  ${item.isProcured
                    ? "bg-dango-pink-400 border-dango-pink-500"
                    : "bg-white border-gray-300 group-hover:border-dango-pink-300"
                  }`}
              >
                {item.isProcured && <span className="text-white text-xs">🏠</span>}
              </label>
            </div>

            <div className="relative">
              <input
                type="checkbox"
                id={item.id}
                checked={item.isChecked}
                onChange={() => onToggle(item.id)}
                disabled={!item.isProcured}
                className="sr-only"
              />
              <label
                htmlFor={item.id}
                className={`flex items-center justify-center w-6 h-6 rounded-md border
                  ${!item.isProcured
                    ? "cursor-not-allowed opacity-50 bg-gray-100 border-gray-200"
                    : "cursor-pointer"
                  }
                  ${item.isChecked
                    ? "bg-dango-green-400 border-dango-green-500"
                    : item.isProcured
                    ? "bg-white border-gray-300 group-hover:border-dango-pink-300"
                    : "bg-gray-100 border-gray-200"
                  }`}
              >
                {item.isChecked && <span className="text-white text-xs">🎒</span>}
              </label>
            </div>
          </div>
        )}

        {/* 通常のチェックボックス */}
        {!twoStageMode && (
          <div className="relative">
            <input
              type="checkbox"
              id={item.id}
              checked={item.isChecked}
              onChange={() => onToggle(item.id)}
              className="sr-only"
            />
            <label
              htmlFor={item.id}
              className={`flex items-center justify-center w-6 h-6 rounded-md border cursor-pointer
                ${item.isChecked
                  ? "bg-dango-green-400 border-dango-green-500"
                  : "bg-white border-gray-300 group-hover:border-dango-pink-300"
                }`}
            >
              {item.isChecked && (
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </label>
          </div>
        )}

        {/* テキスト + 優先度ラベル */}
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="w-full text-lg sm:text-xl font-medium bg-white border border-dango-pink-300 rounded px-2 py-1 focus:outline-none focus:border-dango-pink-500"
              autoFocus
            />
          ) : (
            <span onClick={handleTextClick} className={textClass}>
              {item.text} （優先度: {priorityLabels[item.priority]}）
            </span>
          )}
        </div>

        {/* 優先度変更ドロップダウン */}
        {onPriorityChange && (
          <select
            value={item.priority}
            onChange={(e) => onPriorityChange(item.id, Number(e.target.value))}
            className="ml-2 text-sm border rounded px-1 py-0.5"
          >
            <option value={1}>高</option>
            <option value={2}>中</option>
            <option value={3}>低</option>
          </select>
        )}
      </div>

      {/* 削除ボタン */}
      <button
        onClick={() => onDelete(item.id)}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
      >
        ✕
      </button>
    </div>
  )
}
