"use client"

import { useState } from "react"
import ChecklistItem from "./ChecklistItem"
import ChecklistInput from "./ChecklistInput"
import ChecklistDropzone from "./ChecklistDropzone"
import Percent from "./percent"
import { initialItems, Item } from "./items"
import ChecklistExporter from "./ChecklistExporter"

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

  //  ソート
  const sortedItems = [...items].sort((a, b) => {
    return Number(a.isChecked) - Number(b.isChecked)
  })


  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      {/* タイトル */}
      <h1 className="text-xl font-bold mb-4">もちもちリスト</h1>

      {/* ✅ 進捗バー */}
      <Percent items={items} />

      {/* チェックリスト */}
      <ul className="space-y-2">
        {sortedItems.map(item => (
          <ChecklistItem
            key={item.id}
            item={item}
            onToggle={toggleItem}
            onDelete={deleteItem}
            onUpdate={updateItem}
          />
        ))}
      </ul>

      {/* 入力フォーム */}
      <ChecklistInput onAdd={addItem} />

      {/* ドロップゾーン */}
      <ChecklistDropzone onAdd={addItem} />

      {/* エクスポートボタン */}
      <ChecklistExporter items={items} />
    </div>
  )
}
