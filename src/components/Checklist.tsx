"use client"

import { useState } from "react"
import ChecklistItem from "./ChecklistItem"
import ChecklistInput from "./ChecklistInput"
import ChecklistDropzone from "./ChecklistDropzone"
import Percent from "./percent"
import { initialItems, Item } from "./items"

export default function Checklist() {
  const [items, setItems] = useState<Item[]>(initialItems)

  // チェックボックスのON/OFF
  const toggleItem = (id: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    )
  }

  // 削除
  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  // 追加
  const addItem = (text: string) => {
    setItems(prev => [
      ...prev,
      { id: Date.now().toString(), text, isChecked: false },
    ])
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      {/* タイトル */}
      <h1 className="text-xl font-bold mb-4">もちもちリスト</h1>

      {/* ✅ 進捗バー */}
      <Percent items={items} />

      {/* チェックリスト */}
      <ul className="space-y-2">
        {items.map(item => (
          <ChecklistItem
            key={item.id}
            item={item}
            onToggle={toggleItem}
            onDelete={deleteItem}
          />
        ))}
      </ul>

      {/* 入力フォーム */}
      <ChecklistInput onAdd={addItem} />

      {/* ドロップゾーン */}
      <ChecklistDropzone onAdd={addItem} />
    </div>
  )
}
