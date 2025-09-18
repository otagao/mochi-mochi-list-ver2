"use client"

import { Item } from "./items"

type Props = {
  items: Item[]
}

export default function Percent({ items }: Props) {
  const completedCount = items.filter(item => item.isChecked).length
  const progress = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0

  return (
    <div className="mb-4">
      <p className="mb-1 text-gray-700 font-medium">進捗: {progress}%</p>
     <div
  className="w-full h-4 rounded shadow-md"
  style={{ backgroundColor: "#fffffe" }} // 背景色を#fffffeに設定
>
       <div
  className="h-4 rounded transition-all duration-300"
  style={{
    width: `${progress}%`,
    background: "linear-gradient(to right, #f7bcc1, #c1345d)",
  }}
/>

      </div>

      {/*  100%の場合のみ表示 */}
  {progress === 100 && (
    <p className="mt-2 text-pink-600 font-semibold">準備完了！良い旅を♪</p>
  )}
    </div>
  )
}
