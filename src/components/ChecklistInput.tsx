"use client"
import { useState } from "react"

type Props = {
  onAdd: (text: string) => void
}

export default function ChecklistInput({ onAdd }: Props) {
  const [text, setText] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    onAdd(text)
    setText("")
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="追加するアイテム"
        className="flex-1 border rounded p-2"
      />
      <button type="submit" className="px-4 py-2 text-white rounded"
      style={{backgroundColor: "#4a8c52" }}>
        追加
      </button>
    </form>
  )
}
