"use client"

type Props = {
  onNewTemplate: () => void
}

export default function TemplateButton({ onNewTemplate }: Props) {
  return (
    <button
      onClick={onNewTemplate}
      className="mb-4 px-4 py-2 bg-dango-pink-100 hover:bg-dango-pink-200 text-dango-pink-700 rounded-lg transition-colors duration-200 text-sm font-medium"
    >
      📝 新しいテンプレートを選択
    </button>
  )
}