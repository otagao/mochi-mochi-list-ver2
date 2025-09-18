"use client"

import { Template } from "./items"

type Props = {
  templates: Template[]
  onSelectTemplate: (template: Template) => void
  onClose: () => void
}

export default function TemplateSelector({ templates, onSelectTemplate, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">テンプレートを選択</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 text-2xl"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">用途に合わせたテンプレートを選んでください</p>
        </div>

        {/* テンプレート一覧 */}
        <div className="p-6 space-y-3">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={() => onSelectTemplate(template)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

type TemplateCardProps = {
  template: Template
  onSelect: () => void
}

function TemplateCard({ template, onSelect }: TemplateCardProps) {
  return (
    <button
      onClick={onSelect}
      className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-dango-pink-300 hover:bg-dango-cream-50 transition-all duration-200 hover:shadow-md group"
    >
      <div className="flex items-start gap-4">
        <div className="text-3xl">{template.emoji}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 group-hover:text-dango-pink-600 transition-colors duration-200">
            {template.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {template.description}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {template.items.length === 0 ? '空のリスト' : `${template.items.length}個のアイテム`}
          </p>
        </div>
        <div className="text-dango-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          →
        </div>
      </div>
    </button>
  )
}