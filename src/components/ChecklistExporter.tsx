"use client"

import { Item } from "./items"

interface Props {
  items: Item[]
}

export default function ChecklistExporter({ items }: Props) {
  const handleExportCSV = () => {
    const csvContent = items
      .map(item => `"${item.text}",${item.isChecked ? "完了" : "未完了"},${item.isProcured ? "調達済み" : "未調達"}`)
      .join("\n")

    const csvHeader = `"項目名","状態","調達状況"\n`
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
