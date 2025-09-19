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

// ✅ 優先度付きのソート関数
function sortItems(items: Item[]): Item[] {
  return [...items].sort((a, b) => {
    // チェックの有無で先後
    if (a.isChecked !== b.isChecked) {
      return a.isChecked ? 1 : -1
    }
    // 優先度で比較（1=高, 2=中, 3=低）
    return a.priority - b.priority
  })
}

export default function Checklist() {
  const [items, setItems] = useState<Item[]>([])
  const [showTemplateSelector, setShowTemplateSelector] = useState(true)
  const [twoStageMode, setTwoStageMode] = useState(false)

  // チェックボックスのON/OFF
  const toggleItem = (id: string) => {
    setItems(prev =>
      sortItems(
        prev.map(item => {
          if (item.id === id) {
            // 二段階モードで家の中にない場合はチェックできない
            if (twoStageMode && !item.isProcured) {
              return item
            }
            return { ...item, isChecked: !item.isChecked }
          }
          return item
        })
      )
    )
  }

  // 削除
  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  // 家の中にあるチェックのON/OFF
  const toggleProcured = (id: string) => {
    setItems(prev =>
      sortItems(
        prev.map(item => {
          if (item.id === id) {
            const newIsProcured = !item.isProcured
            // 家の中にないとカバンチェックも外す
            return {
              ...item,
              isProcured: newIsProcured,
              isChecked: newIsProcured ? item.isChecked : false
            }
          }
          return item
        })
      )
    )
  }

  // 追加（✅ priority にデフォルト値をつけた）
  const addItem = (text: string, priority: number = 2) => {
    setItems(prev =>
      sortItems([
        ...prev,
        { id: Date.now().toString(), text, isChecked: false, isProcured: false, priority },
      ])
    )
  }

  // 更新
  const updateItem = (id: string, newText: string) => {
    setItems(prev =>
      sortItems(
        prev.map(item =>
          item.id === id ? { ...item, text: newText } : item
        )
      )
    )
  }

  // 優先度変更
  const updatePriority = (id: string, priority: number) => {
    setItems(prev =>
      sortItems(
        prev.map(item =>
          item.id === id ? { ...item, priority } : item
        )
      )
    )
  }

  // テンプレート選択
  const handleSelectTemplate = (template: Template) => {
    const itemsWithUniqueIds = template.items.map((item, index) => ({
      ...item,
      id: `${template.id}-${index}-${Date.now()}`,
      isProcured: false,
      priority: item.priority ?? 2, // ✅ デフォルト: 中
    }))
    setItems(sortItems(itemsWithUniqueIds))
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

  // 優先度付きでソート
  const sortedItems = sortItems(items)

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
          {twoStageMode ? '🏠🎒 二段階チェックモード ON' : '二段階チェックモード OFF'}
        </button>
      </div>

      {/* スクロール追従ラベル */}
      {twoStageMode && (
        <div className="sticky top-0 z-10 bg-gray-100/95 backdrop-blur-sm border-b-2 border-gray-300/50 py-3 mb-4 shadow-sm">
          <div className="flex justify-center gap-8 text-sm font-semibold text-gray-800">
            <div className="flex items-center gap-1 px-3 py-1 bg-dango-pink-300 rounded-full">
              <span>🏠</span>
              <span>家の中にある</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-dango-green-300 rounded-full">
              <span>🎒</span>
              <span>カバンに入れた</span>
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
            onPriorityChange={updatePriority}
            twoStageMode={twoStageMode}
          />
        ))}
      </ul>

      {/* 入力フォーム */}
      <ChecklistInput onAdd={addItem} />

      {/* ドロップゾーン（✅ priority のデフォルトでOK） */}
      <ChecklistDropzone onAdd={(text) => addItem(text)} />

      {/* エクスポート & インポート */}
      <div className="flex gap-3 mt-4 justify-center">
        <ChecklistExporter items={items} />
        <ChecklistImporter onImport={(imported) => setItems(sortItems(imported))} />
      </div>
    </div>
  )
}
