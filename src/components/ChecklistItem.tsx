"use client"

import { useState } from "react"
import { Item } from "./items"

type Props = {
  item: Item
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, newText: string) => void
  onToggleProcured?: (id: string) => void
  twoStageMode?: boolean
}

export default function ChecklistItem({ item, onToggle, onDelete, onUpdate, onToggleProcured, twoStageMode }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(item.text)

  const handleTextClick = () => {
    if (!item.isChecked) {
      setIsEditing(true)
    }
  }

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(item.id, editText.trim())
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditText(item.text)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  return (
    <div
      className={`group relative rounded-2xl border p-4 sm:p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1
        ${item.isChecked
          ? "bg-gradient-to-r from-dango-green-50 to-dango-pink-50 border-dango-green-200/50"
          : "bg-dango-cream-50/80 backdrop-blur-sm border-dango-cream-200/30 hover:bg-dango-cream-100/90"
        }`}
    >
      <div className="flex items-center gap-4">
        {/* 二段階チェックボックス */}
        {twoStageMode && onToggleProcured && (
          <div className="flex gap-2">
            {/* 家の中にあるチェック */}
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
                {item.isProcured && (
                  <span className="text-white text-xs">🏠</span>
                )}
              </label>
            </div>

            {/* カバンに入れたチェック */}
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
                {item.isChecked && (
                  <span className="text-white text-xs">🎒</span>
                )}
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

        {/* テキスト */}
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="flex-1 text-lg sm:text-xl font-medium bg-white border border-dango-pink-300 rounded px-2 py-1 focus:outline-none focus:border-dango-pink-500"
            autoFocus
          />
        ) : (
          <span
            onClick={handleTextClick}
            className={`flex-1 text-lg sm:text-xl font-medium transition-colors duration-200 cursor-pointer
              ${item.isChecked
                ? "line-through text-gray-400"
                : "text-gray-800 hover:text-dango-pink-600"
              }
            `}
          >
            {item.text}
          </span>
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
