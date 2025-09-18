export interface Item {
  id: string
  text: string
  isChecked: boolean
}

export const initialItems: Item[] = [
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
