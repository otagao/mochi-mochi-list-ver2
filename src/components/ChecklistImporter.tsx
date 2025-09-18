"use client"

import { useRef } from "react"
import { Item } from "./items"

type Props = {
  onImport: (items: Item[]) => void
}

export default function ChecklistImporter({ onImport }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const content = reader.result as string

      // 行ごとに分割
      const lines = content.split("\n").filter(line => line.trim() !== "")
      // 先頭行（ヘッダー）をスキップ
      const dataLines = lines.slice(1)

      const importedItems: Item[] = dataLines.map((line, index) => {
        // 「"タスク名",完了」or 「"タスク名",未完了」
        const [rawText, status] = line.split(",")

        // " で囲まれているので除去
        const text = rawText?.replace(/^"|"$/g, "") || ""

        return {
          id: Date.now().toString() + index, // 新しいユニークIDを割り振る
          text,
          isChecked: status?.trim() === "完了",
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
        className="px-4 py-2 rounded-lg bg-dango-green-500 text-white shadow hover:bg-dango-green-600 transition"
        
      >
        リストを読み込み（CSV形式）
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
