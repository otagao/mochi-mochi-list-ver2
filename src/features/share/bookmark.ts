import { nanoid } from 'nanoid'
import { db } from '@/lib/firebase'
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import type { BaseListDoc, BaseListItem, BookmarkEventDoc, BookmarkViewData, RenderItem } from './types'

// 共有イベント作成
export async function createBookmarkEvent(params: {
  name: string
  creatorName: string
  baseList: BaseListDoc
}): Promise<{ eventId: string; shareUrl: string }> {
  const eventId = nanoid(16)

  const eventRef = doc(db, 'events', eventId)
  const baseRef = doc(db, 'events', eventId, 'lists', 'base')

  // イベントドキュメント作成
  await setDoc(eventRef, {
    mode: 'bookmark',
    name: params.name,
    creatorName: params.creatorName,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    baseListVersion: 1,
  } as BookmarkEventDoc)

  // ベースリスト作成（チェック状態は保存しない）
  await setDoc(baseRef, {
    title: params.baseList.title,
    items: params.baseList.items.map(item => ({
      id: item.id,
      label: item.label,
      priority: item.priority
    })),
  })

  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
  return { eventId, shareUrl: `${origin}/share?id=${eventId}` }
}

// ブックマーク共有リスト読み取り（常に未チェック状態で返す）
export async function loadBookmarkList(eventId: string): Promise<BookmarkViewData> {
  const eventSnap = await getDoc(doc(db, 'events', eventId))
  if (!eventSnap.exists()) {
    throw new Error('イベントが見つかりません')
  }

  const event = eventSnap.data() as BookmarkEventDoc
  if (event.mode !== 'bookmark') {
    throw new Error('このイベントは簡易共有ではありません')
  }

  const baseSnap = await getDoc(doc(db, 'events', eventId, 'lists', 'base'))
  if (!baseSnap.exists()) {
    throw new Error('リストが見つかりません')
  }

  const base = baseSnap.data() as { title: string; items: BaseListItem[] }

  return {
    eventName: event.name,
    creatorName: event.creatorName,
    title: base.title,
    items: base.items.map(item => ({
      ...item,
      checked: false, // 常に未チェック状態で返す
      priority: item.priority || 2 // 優先度が設定されていない場合はデフォルト値
    }))
  }
}

// 作成者名確認
export async function verifyCreatorName(eventId: string, inputName: string): Promise<boolean> {
  const snap = await getDoc(doc(db, 'events', eventId))
  if (!snap.exists()) return false

  const data = snap.data() as BookmarkEventDoc
  return normalize(data.creatorName) === normalize(inputName)
}

// ベースリスト更新（作成者のみ）
export async function updateBaseList(eventId: string, next: BaseListDoc): Promise<void> {
  const baseRef = doc(db, 'events', eventId, 'lists', 'base')
  const eventRef = doc(db, 'events', eventId)

  await updateDoc(baseRef, {
    title: next.title,
    items: next.items.map(item => ({
      id: item.id,
      label: item.label,
      priority: item.priority
    }))
  })

  await updateDoc(eventRef, {
    updatedAt: serverTimestamp()
  })
}

// CSV エクスポート
export function exportListToCSV(args: {
  eventName: string
  title: string
  items: RenderItem[]
}): void {
  const header = ['項目名', '状態']
  const rows = args.items.map(item => [
    item.label,
    item.checked ? '完了' : '未完了'
  ])

  const csv = [header, ...rows]
    .map(row => row.map(escapeCSV).join(','))
    .join('\n')

  const bom = '\uFEFF' // UTF-8 BOM for Excel compatibility
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' })

  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${sanitize(args.eventName)}_${sanitize(args.title)}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

// ユーティリティ関数
function normalize(s: string): string {
  return String(s ?? '').trim().toLowerCase()
}

function escapeCSV(s: string | number): string {
  const str = String(s ?? '')
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
}

function sanitize(s: string): string {
  return s.replace(/[\\/:*?"<>|]/g, '_').slice(0, 64)
}