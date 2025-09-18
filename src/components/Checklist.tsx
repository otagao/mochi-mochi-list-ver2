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
  const [twoStageMode, setTwoStageMode] = useState(false)

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

  // 調達チェックのON/OFF
  const toggleProcured = (id: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isProcured: !item.isProcured } : item
      )
    )
  }

  // 追加
  const addItem = (text: string) => {
    setItems(prev => [
      ...prev,
      { id: Date.now().toString(), text, isChecked: false, isProcured: false },
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
      id: `${template.id}-${index}-${Date.now()}`,
      isProcured: false
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

      {/* 二段階チェックリスト切り替えボタン */}
      <div className="mb-4">
        <button
          onClick={() => setTwoStageMode(!twoStageMode)}
          className={`px-4 py-2 rounded font-medium text-sm transition-all ${
            twoStageMode
              ? 'bg-dango-green-500 text-white shadow-md hover:bg-dango-green-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {twoStageMode ? '📦🎒 二段階チェックモード ON' : '二段階チェックモード OFF'}
        </button>
      </div>

      {/* スクロール追従ラベル */}
      {twoStageMode && (
        <div className="sticky top-0 z-10 bg-gray-100/95 backdrop-blur-sm border-b-2 border-gray-300/50 py-3 mb-4 shadow-sm">
          <div className="flex justify-center gap-8 text-sm font-semibold text-gray-800">
            <div className="flex items-center gap-1 px-3 py-1 bg-dango-pink-300 rounded-full">
              <span>📦</span>
              <span>調達</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-dango-green-300 rounded-full">
              <span>🎒</span>
              <span>カバン</span>
            </div>
          </div>
        </div>
      )}

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
            onToggleProcured={toggleProcured}
            twoStageMode={twoStageMode}
          />
        ))}
      </ul>

      {/* 入力フォーム */}
      <ChecklistInput onAdd={addItem} />

      {/* ドロップゾーン */}
      <ChecklistDropzone onAdd={addItem} />

      {/* エクスポート & インポート */}
      <div className="flex gap-3 mt-4 justify-center">
        <ChecklistExporter items={items} />
        <ChecklistImporter onImport={(imported) => setItems(imported)} />
      </div>
    </div>
  )
}
