'use client'

import { useRef, useState } from 'react'
import { useForm, useFormFields } from '@payloadcms/ui'
import type { FormState } from 'payload'
import { metadataPatch } from '@/lib/metadata/apply'
import type { GameCandidate, SearchResult } from '@/lib/metadata/types'
import './metadata.css'

export function MetadataSearch() {
  const type = useFormFields(([fields]) => fields.type?.value)
  const { getData, getFields, dispatchFields, setModified } = useForm()
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<SearchResult | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const requestId = useRef(0)
  if (type !== 'game') return null

  async function search() {
    const id = ++requestId.current
    setBusy(true); setMessage(''); setResult(null)
    try {
      const response = await fetch(`/api/metadata/games?q=${encodeURIComponent(query.trim())}`, { credentials: 'same-origin' })
      if (!response.ok) throw new Error(response.status === 401 ? '登录已过期，请重新登录。' : '搜索失败，请稍后重试。')
      const data: SearchResult = await response.json()
      if (id === requestId.current) setResult(data)
    } catch (error) { if (id === requestId.current) setMessage(error instanceof Error ? error.message : '搜索失败。') }
    finally { if (id === requestId.current) setBusy(false) }
  }

  function apply(candidate: GameCandidate) {
    const current = getData()
    if (current.type !== 'game') return
    const { sources, ...values } = metadataPatch(candidate, current)
    // Update Payload's native field state atomically. A full async reset races with
    // the form's background server validation and can return an aborted state.
    const state: FormState = { ...getFields() }
    for (const [path, value] of Object.entries(values)) {
      state[path] = { ...state[path], value, valid: true, errorMessage: undefined }
    }
    for (const path of Object.keys(state)) if (path.startsWith('sources.')) delete state[path]
    const rows = sources.map(source => ({ ...source, id: crypto.randomUUID() }))
    state.sources = { ...state.sources, disableFormData: true, value: rows.length, rows: rows.map(row => ({ id: row.id, collapsed: false })), valid: true }
    rows.forEach((row, index) => {
      for (const [key, value] of Object.entries(row)) {
        state[`sources.${index}.${key}`] = { value, initialValue: value, valid: true }
      }
    })
    dispatchFields({ type: 'REPLACE_STATE', state })
    setModified(true)
    setMessage(`已填入 ${candidate.title} 的 metadata，请检查后保存。`)
    setResult(null)
  }

  return <section className="metadata-search" aria-label="游戏 metadata 搜索">
    <label htmlFor="game-search">搜索游戏</label>
    <div className="metadata-search__input">
      <input id="game-search" value={query} maxLength={100} placeholder="TUNIC" disabled={busy}
        onChange={event => setQuery(event.target.value)}
        onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); if (query.trim().length >= 2 && !busy) void search() } }} />
      <button type="button" disabled={busy || query.trim().length < 2} onClick={() => void search()}>{busy ? '处理中…' : '搜索'}</button>
    </div>
    <p className="metadata-search__hint">填充基础资料；个人评分、状态、笔记和上传封面保持不变。</p>
    <div role="status" aria-live="polite">{message}</div>
    {result && <>
      {result.providers.filter(p => p.state !== 'ok').map(p => <p key={p.provider}>{p.provider.toUpperCase()}：{p.message}</p>)}
      {result.candidates.length === 0 && <p>没有搜索结果。</p>}
      <ul className="metadata-search__results">{result.candidates.map(candidate => <li key={`${candidate.provider}:${candidate.externalId}`}>
        {candidate.coverUrl && <img src={candidate.coverUrl} alt="" loading="lazy" referrerPolicy="no-referrer" />}
        <div><strong>{candidate.title}</strong><p>{candidate.releaseDate?.slice(0, 10)} · {candidate.provider.toUpperCase()}</p></div>
        <button type="button" disabled={busy} onClick={() => void apply(candidate)}>选择 {candidate.title}</button>
      </li>)}</ul>
    </>}
  </section>
}
