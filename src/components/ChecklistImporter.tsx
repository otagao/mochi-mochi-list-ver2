"use client"

import { useRef } from "react"
import { Item } from "./items"

type Props = {
  onImport: (items: Item[]) => void
}

// 優先度ラベル → 数値変換
const priorityFromLabel = (label: string): number => {
  switch (label) {
    case "高":
      return 1
    case "中":
      return 2
    case "低":
      return 3
    default:
      return 2 // デフォルトは中
  }
}

export default function ChecklistImporter({ onImport }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const content = reader.result as string
      const lines = content.split("\n").filter(line => line.trim() !== "")
      const dataLines = lines.slice(1) // ヘッダーを除外

      const importedItems: Item[] = dataLines.map((line, index) => {
        const columns = line.split(",")
        const text = columns[0]?.replace(/^"|"$/g, "") || ""
        const status = columns[1]?.trim()
        const procuredStatus = columns[2]?.trim()
        const priorityLabel = columns[3]?.trim() || "中"

        return {
          id: Date.now().toString() + index,
          text,
          isChecked: status === "完了",
          isProcured: procuredStatus === "調達済み",
          priority: priorityFromLabel(priorityLabel), // ✅ 追加
        }
      })

      onImport(importedItems)
    }
    reader.readAsText(file)
  }

  return (
    <>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex-1 h-16 px-4 py-3 rounded-lg bg-dango-green-500 text-white shadow hover:bg-dango-green-600 transition flex flex-col items-center justify-center text-sm"
      >
        <span>リストを読み込み</span>
        <span>（CSV形式）</span>
      </button>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".csv"
        onChange={handleFileChange}
      />
    </>
  )
}
