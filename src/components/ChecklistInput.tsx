"use client"
import { useState } from "react"

type Props = {
  onAdd: (text: string, priority: number) => void
}

export default function ChecklistInput({ onAdd }: Props) {
  const [text, setText] = useState("")
  const [priority, setPriority] = useState(2) // デフォルト: 中

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    onAdd(text, priority)
    setText("")
    setPriority(2)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-4 items-center">
      {/* テキスト入力 */}
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="追加するアイテム"
        className="flex-1 border rounded p-2"
      />

      {/* 優先度選択 */}
      <select
        value={priority}
        onChange={e => setPriority(Number(e.target.value))}
        className="border rounded p-2"
      >
        <option value={1}>高</option>
        <option value={2}>中</option>
        <option value={3}>低</option>
      </select>

      {/* 追加ボタン */}
      <button
        type="submit"
        className="px-4 py-2 text-white rounded"
        style={{ backgroundColor: "#5fa768" }}
      >
        追加
      </button>
    </form>
  )
}
