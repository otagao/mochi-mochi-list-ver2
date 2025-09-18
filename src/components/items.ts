export interface Item {
  id: string
  text: string
  isChecked: boolean
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
  { id: '1', text: '着替え（3日分）', isChecked: false },
  { id: '2', text: '下着・靴下', isChecked: false },
  { id: '3', text: '歯ブラシ・歯磨き粉', isChecked: false },
  { id: '4', text: 'シャンプー・リンス', isChecked: false },
  { id: '5', text: 'タオル', isChecked: false },
  { id: '6', text: '充電器', isChecked: false },
  { id: '7', text: 'スマートフォン', isChecked: false },
  { id: '8', text: '財布', isChecked: false },
  { id: '9', text: '保険証', isChecked: false },
  { id: '10', text: '薬（常用薬）', isChecked: false },
  { id: '11', text: 'メガネ・コンタクト', isChecked: false },
  { id: '12', text: '化粧品', isChecked: false },
  { id: '13', text: '本・読み物', isChecked: false },
  { id: '14', text: 'お土産用スペース', isChecked: false },
]

const shoppingTemplate: Item[] = [
  { id: '1', text: '牛乳', isChecked: false },
  { id: '2', text: 'パン', isChecked: false },
  { id: '3', text: '卵', isChecked: false },
  { id: '4', text: '野菜（キャベツ）', isChecked: false },
  { id: '5', text: '野菜（にんじん）', isChecked: false },
  { id: '6', text: '野菜（玉ねぎ）', isChecked: false },
  { id: '7', text: '肉類', isChecked: false },
  { id: '8', text: '魚類', isChecked: false },
  { id: '9', text: 'お米', isChecked: false },
  { id: '10', text: '調味料', isChecked: false },
  { id: '11', text: 'ティッシュ', isChecked: false },
  { id: '12', text: 'トイレットペーパー', isChecked: false },
]

const workTemplate: Item[] = [
  { id: '1', text: 'ノートパソコン', isChecked: false },
  { id: '2', text: 'ノートパソコン充電器', isChecked: false },
  { id: '3', text: 'マウス', isChecked: false },
  { id: '4', text: 'ノート・メモ帳', isChecked: false },
  { id: '5', text: 'ペン・筆記用具', isChecked: false },
  { id: '6', text: '資料・書類', isChecked: false },
  { id: '7', text: '名刺', isChecked: false },
  { id: '8', text: 'イヤホン', isChecked: false },
  { id: '9', text: 'USBメモリ', isChecked: false },
  { id: '10', text: 'クリアファイル', isChecked: false },
]

const partyTemplate: Item[] = [
  { id: '1', text: 'プレゼント', isChecked: false },
  { id: '2', text: 'カード・メッセージ', isChecked: false },
  { id: '3', text: 'カメラ', isChecked: false },
  { id: '4', text: '飲み物', isChecked: false },
  { id: '5', text: 'お菓子・ケーキ', isChecked: false },
  { id: '6', text: '装飾用品', isChecked: false },
  { id: '7', text: '音楽再生機器', isChecked: false },
  { id: '8', text: 'ゲーム・カードゲーム', isChecked: false },
  { id: '9', text: '紙皿・紙コップ', isChecked: false },
  { id: '10', text: 'ゴミ袋', isChecked: false },
]

export const templates: Template[] = [
  {
    id: 'empty',
    name: 'まっさらな状態',
    description: '何もない状態から始める',
    emoji: '📝',
    items: []
  },
  {
    id: 'travel',
    name: '旅行準備',
    description: '旅行・出張の持ち物リスト',
    emoji: '🧳',
    items: travelTemplate
  },
  {
    id: 'shopping',
    name: 'お買い物',
    description: '日用品・食材の買い物リスト',
    emoji: '🛒',
    items: shoppingTemplate
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

// 後方互換性のため
export const initialItems: Item[] = travelTemplate
