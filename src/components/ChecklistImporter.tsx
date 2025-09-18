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
        // CSV行をパース（カンマで分割、引用符を考慮）
        const columns = line.split(",")

        // " で囲まれているので除去
        const text = columns[0]?.replace(/^"|"$/g, "") || ""
        const status = columns[1]?.trim()
        const procuredStatus = columns[2]?.trim()

        return {
          id: Date.now().toString() + index, // 新しいユニークIDを割り振る
          text,
          isChecked: status === "完了",
          // 3列目がない場合（2列構成）は「カバンに入れた」のみに反映
          // 3列目がある場合は調達状況を反映
          isProcured: procuredStatus ? procuredStatus === "調達済み" : false,
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
