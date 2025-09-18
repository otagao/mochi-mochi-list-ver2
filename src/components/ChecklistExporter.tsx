"use client"

import { Item } from "./items"

interface Props {
  items: Item[]
}

export default function ChecklistExporter({ items }: Props) {
  const handleExportCSV = () => {
    const csvContent = items
      .map(item => `"${item.text}",${item.isChecked ? "完了" : "未完了"}`)
      .join("\n")

    const csvHeader = `"項目名","状態"\n`
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
      className="mt-4 rounded-lg bg-dango-green-500 px-4 py-2 text-white shadow hover:bg-dango-green-600 transition"
    >
      端末に保存（CSV形式）
    </button>
  )
}
