"use client"

import { useRef, useState } from "react"

type Props = {
  onAdd: (text: string) => void
}

export default function ChecklistDropzone({ onAdd }: Props) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const file = e.dataTransfer.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const content = reader.result as string
      content.split("\n").forEach(line => {
        if (line.trim()) onAdd(line.trim())
      })
    }
    reader.readAsText(file)
  }

  return (
    <div
      onDragOver={e => {
        e.preventDefault()
        setIsDragOver(true)
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`mt-4 p-4 border-2 border-dashed rounded cursor-pointer text-center transition-colors
        ${isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"}`}
    >
      <p className="text-gray-500">ファイルをドラッグ&ドロップ、またはクリックして追加</p>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".txt"
        onChange={e => {
          const file = e.target.files?.[0]
          if (!file) return
          const reader = new FileReader()
          reader.onload = () => {
            const content = reader.result as string
            content.split("\n").forEach(line => {
              if (line.trim()) onAdd(line.trim())
            })
          }
          reader.readAsText(file)
        }}
      />
    </div>
  )
}
