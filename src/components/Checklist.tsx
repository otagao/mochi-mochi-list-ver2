"use client"

import { useState } from "react"
import ChecklistItem from "./ChecklistItem"
import ChecklistInput from "./ChecklistInput"
import ChecklistDropzone from "./ChecklistDropzone"
import Percent from "./percent"
import { initialItems, Item, templates, Template } from "./items"
import ChecklistExporter from "./ChecklistExporter"
import ChecklistImporter from "./ChecklistImporter" 
import TemplateSelector from "./TemplateSelector"
import TemplateButton from "./TemplateButton"

export default function Checklist() {
  const [items, setItems] = useState<Item[]>([])
  const [showTemplateSelector, setShowTemplateSelector] = useState(true)

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

  // 更新
  const updateItem = (id: string, newText: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, text: newText } : item
      )
    )
  }

  // テンプレート選択
  const handleSelectTemplate = (template: Template) => {
    const itemsWithUniqueIds = template.items.map((item, index) => ({
      ...item,
      id: `${template.id}-${index}-${Date.now()}`
    }))
    setItems(itemsWithUniqueIds)
    setShowTemplateSelector(false)
  }

  // テンプレートセレクターを閉じる
  const handleCloseTemplateSelector = () => {
    setShowTemplateSelector(false)
  }

  // 新しいテンプレート選択を開始
  const handleNewTemplate = () => {
    setShowTemplateSelector(true)
  }

  // ソート（未完了が上、完了が下）
  const sortedItems = [...items].sort((a, b) => {
    return Number(a.isChecked) - Number(b.isChecked)
  })

  // テンプレート選択中の場合
  if (showTemplateSelector) {
    return (
      <TemplateSelector
        templates={templates}
        onSelectTemplate={handleSelectTemplate}
        onClose={handleCloseTemplateSelector}
      />
    )
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      {/* タイトル */}
      <h1 className="text-xl font-bold mb-4">もちもちリスト</h1>

      {/* テンプレート選択ボタン */}
      <TemplateButton onNewTemplate={handleNewTemplate} />

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

      {/* エクスポート & インポート */}
      <div className="flex gap-2 mt-4">
        <ChecklistExporter items={items} />
        <ChecklistImporter onImport={(imported) => setItems(imported)} />
      </div>
    </div>
  )
}
