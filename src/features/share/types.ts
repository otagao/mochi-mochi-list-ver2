// 簡易共有機能の型定義

export type BaseListItem = {
  id: string
  label: string
  priority: number
}

export type BaseListDoc = {
  title: string
  items: BaseListItem[]
}

export type BookmarkEventDoc = {
  mode: 'bookmark'
  name: string
  creatorName: string
  createdAt: unknown // serverTimestamp
  updatedAt: unknown
  baseListVersion: number
}

export type RenderItem = {
  id: string
  label: string
  checked: boolean
  priority: number
  isProcured?: boolean // 二段階チェック用
}

export type BookmarkViewData = {
  eventName: string
  creatorName: string
  title: string
  items: RenderItem[]
}