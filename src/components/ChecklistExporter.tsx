"use client"

import { Item } from "./items"

interface Props {
  items: Item[]
}

// 優先度を数値 → ラベルに変換
const priorityToLabel = (priority: number): string => {
  switch (priority) {
    case 1:
      return "高"
    case 2:
      return "中"
    case 3:
      return "低"
    default:
      return "未設定"
  }
}

export default function ChecklistExporter({ items }: Props) {
  const handleExportCSV = () => {
    const csvContent = items
      .map(item =>
        `"${item.text}",${item.isChecked ? "完了" : "未完了"},${item.isProcured ? "調達済み" : "未調達"},${priorityToLabel(item.priority)}`
      )
      .join("\n")

    const csvHeader = `"項目名","状態","調達状況","優先度"\n`
    const blob = new Blob([csvHeader + csvContent], { type: "text/csv;charset=utf-8;" })

    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "checklist.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <button
      onClick={handleExportCSV}
      className="flex-1 h-16 px-4 py-3 rounded-lg bg-dango-green-500 text-white shadow hover:bg-dango-green-600 transition flex flex-col items-center justify-center text-sm"
    >
      <span>端末に保存</span>
      <span>（CSV形式）</span>
    </button>
  )
}
