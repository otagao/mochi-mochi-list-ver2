"use client"

import { Item } from "./items"

type Props = {
  item: Item
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export default function ChecklistItem({ item, onToggle, onDelete }: Props) {
  return (
    <div
      className={`group relative rounded-2xl border p-4 sm:p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1
        ${item.isChecked
          ? "bg-gradient-to-r from-dango-green-50 to-dango-pink-50 border-dango-green-200/50"
          : "bg-dango-cream-50/80 backdrop-blur-sm border-dango-cream-200/30 hover:bg-dango-cream-100/90"
        }`}
    >
      <div className="flex items-center gap-4">
        {/* チェックボックス */}
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

        {/* テキスト */}
        <span
          className={`flex-1 text-lg sm:text-xl font-medium transition-colors duration-200
            ${item.isChecked ? "line-through text-gray-400" : "text-gray-800"}
          `}
        >
          {item.text}
        </span>
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
