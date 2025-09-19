export interface Item {
  id: string
  text: string
  isChecked: boolean
  isProcured?: boolean // 家の中にあるかどうか（二段階チェックリスト用）
  priority: number   // ★ 追加：1=高, 2=中, 3=低
}

export interface Template {
  id: string
  name: string
  description: string
  emoji: string
  items: Item[]
}

// テンプレート定義
const travelTemplate: Item[] = [
  { id: '1', text: '着替え（3日分）', isChecked: false, priority: 2},
  { id: '2', text: '下着・靴下', isChecked: false, priority: 2},
  { id: '3', text: '歯ブラシ・歯磨き粉', isChecked: false, priority: 3},
  { id: '4', text: 'シャンプー・リンス', isChecked: false, priority: 3},
  { id: '5', text: 'タオル', isChecked: false, priority: 3},
  { id: '6', text: '充電器', isChecked: false, priority: 3},
  { id: '7', text: 'スマートフォン', isChecked: false, priority: 1},
  { id: '8', text: '財布', isChecked: false, priority: 1},
  { id: '9', text: '保険証', isChecked: false, priority: 1},
  { id: '10', text: '薬（常用薬）', isChecked: false, priority: 1},
  { id: '11', text: 'メガネ・コンタクト', isChecked: false, priority: 1},
  { id: '12', text: '化粧品', isChecked: false, priority: 2},
  { id: '13', text: '本・読み物', isChecked: false, priority: 3},
  { id: '14', text: 'お土産用スペース', isChecked: false, priority: 3},
]


const workTemplate: Item[] = [
  { id: '1', text: 'ノートパソコン', isChecked: false, priority: 1},
  { id: '2', text: 'ノートパソコン充電器', isChecked: false, priority: 1},
  { id: '3', text: 'マウス', isChecked: false, priority: 2},
  { id: '4', text: 'ノート・メモ帳', isChecked: false, priority: 3},
  { id: '5', text: 'ペン・筆記用具', isChecked: false, priority: 3},
  { id: '6', text: '資料・書類', isChecked: false, priority: 1},
  { id: '7', text: '名刺', isChecked: false, priority: 1},
  { id: '8', text: 'イヤホン', isChecked: false, priority: 2},
  { id: '9', text: 'USBメモリ', isChecked: false, priority: 2},
  { id: '10', text: 'クリアファイル', isChecked: false, priority: 3},
]

const partyTemplate: Item[] = [
  { id: '1', text: 'プレゼント', isChecked: false, priority: 1},
  { id: '2', text: 'カード・メッセージ', isChecked: false, priority: 2},
  { id: '3', text: 'カメラ', isChecked: false, priority: 2},
  { id: '4', text: '飲み物', isChecked: false, priority: 3},
  { id: '5', text: 'お菓子・ケーキ', isChecked: false, priority: 2},
  { id: '6', text: '装飾用品', isChecked: false, priority: 3},
  { id: '7', text: '音楽再生機器', isChecked: false, priority: 2},
  { id: '8', text: 'ゲーム・カードゲーム', isChecked: false, priority: 2},
  { id: '9', text: '紙皿・紙コップ', isChecked: false, priority: 3},
  { id: '10', text: 'ゴミ袋', isChecked: false, priority: 3},
]

export const templates: Template[] = [
  {
    id: 'empty',
    name: 'まっさらな状態',
    description: '何もない状態から始める',
    emoji: '📝',
    items: [],
  },
  {
    id: 'travel',
    name: '旅行準備',
    description: '旅行・出張の持ち物リスト',
    emoji: '🧳',
    items: travelTemplate
  },
  {
    id: 'work',
    name: '仕事・会議',
    description: '仕事や会議の準備リスト',
    emoji: '💼',
    items: workTemplate
  },
  {
    id: 'party',
    name: 'パーティー',
    description: 'パーティーやイベントの準備リスト',
    emoji: '🎉',
    items: partyTemplate
  }
]

// ★ 追加：優先度ラベル
export function getPriorityLabel(priority: number): string {
  switch (priority) {
    case 1: return "高"
    case 2: return "中"
    case 3: return "低"
    default: return ""
  }
}

// ★ 追加：優先度バッジ用クラス
export function getPriorityBadgeClass(priority: number): string {
  switch (priority) {
    case 1: return "bg-red-500 text-white"
    case 2: return "bg-yellow-400 text-black"
    case 3: return "bg-green-500 text-white"
    default: return "bg-gray-300 text-black"
  }
}

// 後方互換性のため
export const initialItems: Item[] = travelTemplate
