// Server module. Only endpoint.ts imports this at runtime; browser code imports types.
// Adapted from HayakuShelf's IGDB/RAWG normalization and isolated provider searches.
import type { GameCandidate, Provider, SearchResult } from './types'

type Environment = { IGDB_CLIENT_ID?: string; IGDB_CLIENT_SECRET?: string; RAWG_API_KEY?: string }
type IGDBGame = {
  id: number; name: string; slug?: string; url?: string; first_release_date?: number; summary?: string
  cover?: { url?: string }; alternative_names?: { name?: string }[]
  involved_companies?: { developer?: boolean; company?: { name?: string } }[]
  platforms?: { name?: string }[]
}
type RAWGGame = { id: number; name: string; slug?: string; released?: string; background_image?: string; platforms?: { platform?: { name?: string } }[] }
const unique = (items: (string | undefined)[]) => [...new Set(items.filter((x): x is string => Boolean(x?.trim())).map(x => x.trim()))]
const safeURL = (value?: string) => {
  if (!value) return undefined
  try { const url = new URL(value.startsWith('//') ? `https:${value}` : value); return url.protocol === 'https:' ? url.href : undefined }
  catch { return undefined }
}
class ProviderError extends Error {
  constructor(readonly status: number, readonly retryAfter = 60_000) { super('Provider request failed') }
}

export function createGameSearch(env: Environment, fetcher: typeof fetch = fetch) {
  let token: { value: string; expires: number } | undefined
  let pendingToken: Promise<string> | undefined
  const cache = new Map<string, { expires: number; candidates: GameCandidate[] }>()
  const pending = new Map<string, Promise<GameCandidate[]>>()
  const cooldown = new Map<Provider, number>()

  async function json<T>(url: string | URL, init?: RequestInit): Promise<T> {
    const response = await fetcher(url, { ...init, cache: 'no-store', signal: AbortSignal.timeout(8_000) })
    if (!response.ok) {
      const retry = response.headers.get('retry-after')
      const delay = retry && /^\d+$/.test(retry) ? Number(retry) * 1000 : retry ? Date.parse(retry) - Date.now() : 60_000
      throw new ProviderError(response.status, Number.isFinite(delay) ? Math.max(1000, Math.min(delay, 3_600_000)) : 60_000)
    }
    return response.json() as Promise<T>
  }

  async function accessToken() {
    if (token && token.expires > Date.now()) return token.value
    if (pendingToken) return pendingToken
    pendingToken = (async () => {
      const data = await json<{ access_token: string; expires_in: number }>('https://id.twitch.tv/oauth2/token', {
        method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ client_id: env.IGDB_CLIENT_ID!, client_secret: env.IGDB_CLIENT_SECRET!, grant_type: 'client_credentials' }),
      })
      if (!data.access_token) throw new ProviderError(502)
      token = { value: data.access_token, expires: Date.now() + Math.max(0, (data.expires_in - 60) * 1000) }
      return token.value
    })()
    try { return await pendingToken } finally { pendingToken = undefined }
  }

  async function igdb(query: string): Promise<GameCandidate[]> {
    const bearer = await accessToken()
    let games: IGDBGame[]
    try {
      games = await json<IGDBGame[]>('https://api.igdb.com/v4/games', {
        method: 'POST', headers: { 'Client-ID': env.IGDB_CLIENT_ID!, Authorization: `Bearer ${bearer}`, 'Content-Type': 'text/plain' },
        body: `search ${JSON.stringify(query)}; fields name,slug,url,first_release_date,summary,cover.url,alternative_names.name,involved_companies.developer,involved_companies.company.name,platforms.name; limit 8;`,
      })
    } catch (error) { if (error instanceof ProviderError && error.status === 401) token = undefined; throw error }
    return games.map(game => ({
      provider: 'igdb', externalId: String(game.id), title: game.name,
      aliases: unique([game.name, ...(game.alternative_names || []).map(x => x.name)]),
      coverUrl: safeURL(game.cover?.url?.replace('t_thumb', 't_cover_big')),
      releaseDate: game.first_release_date ? new Date(game.first_release_date * 1000).toISOString() : undefined,
      creators: unique((game.involved_companies || []).filter(x => x.developer).map(x => x.company?.name)),
      platforms: unique((game.platforms || []).map(x => x.name)), description: game.summary,
      source: { provider: 'igdb', externalId: String(game.id), url: safeURL(game.url) || (game.slug ? `https://www.igdb.com/games/${encodeURIComponent(game.slug)}` : undefined), fetchedAt: new Date().toISOString() },
    }))
  }

  async function rawg(query: string): Promise<GameCandidate[]> {
    const url = new URL('https://api.rawg.io/api/games')
    url.search = new URLSearchParams({ key: env.RAWG_API_KEY!, search: query, search_precise: 'true', page_size: '8' }).toString()
    const data = await json<{ results?: RAWGGame[] }>(url)
    return (data.results || []).map(game => ({
      provider: 'rawg', externalId: String(game.id), title: game.name, aliases: [game.name],
      coverUrl: safeURL(game.background_image),
      releaseDate: game.released && Number.isFinite(Date.parse(game.released)) ? new Date(game.released).toISOString() : undefined,
      creators: [], platforms: unique((game.platforms || []).map(x => x.platform?.name)),
      source: { provider: 'rawg', externalId: String(game.id), url: `https://rawg.io/games/${encodeURIComponent(game.slug || String(game.id))}`, fetchedAt: new Date().toISOString() },
    }))
  }

  async function cached(provider: Provider, query: string, search: () => Promise<GameCandidate[]>) {
    const key = `${provider}:${query.toLowerCase()}`
    const hit = cache.get(key)
    if (hit && hit.expires > Date.now()) return hit.candidates
    if ((cooldown.get(provider) || 0) > Date.now()) throw new ProviderError(429)
    if (pending.has(key)) return pending.get(key)!
    const request = search().then(candidates => {
      if (cache.size >= 100) cache.delete(cache.keys().next().value!)
      cache.set(key, { expires: Date.now() + 300_000, candidates })
      return candidates
    }).catch(error => {
      if (error instanceof ProviderError && error.status === 429) cooldown.set(provider, Date.now() + error.retryAfter)
      throw error
    }).finally(() => { pending.delete(key) })
    pending.set(key, request)
    return request
  }

  return async (input: string): Promise<SearchResult> => {
    const query = input.normalize('NFKC').trim()
    if (query.length < 2 || query.length > 100) throw new Error('搜索词需为 2–100 个字符。')
    const sources = [
      { provider: 'igdb' as const, enabled: Boolean(env.IGDB_CLIENT_ID && env.IGDB_CLIENT_SECRET), search: () => igdb(query) },
      { provider: 'rawg' as const, enabled: Boolean(env.RAWG_API_KEY), search: () => rawg(query) },
    ]
    const settled = await Promise.allSettled(sources.map(source => source.enabled ? cached(source.provider, query, source.search) : Promise.resolve([])))
    const result: SearchResult = { candidates: [], providers: [] }
    settled.forEach((response, i) => {
      const source = sources[i]
      if (!source.enabled) result.providers.push({ provider: source.provider, state: 'unavailable', message: '服务端尚未配置凭据。' })
      else if (response.status === 'fulfilled') {
        result.candidates.push(...response.value)
        result.providers.push({ provider: source.provider, state: 'ok' })
      } else {
        const rateLimited = response.reason instanceof ProviderError && response.reason.status === 429
        result.providers.push({ provider: source.provider, state: rateLimited ? 'rate-limited' : 'error', message: rateLimited ? '请求过于频繁，请稍后重试。' : '来源暂时不可用，请稍后重试。' })
      }
    })
    // Keep editions/provider results separate: titles alone are not identity.
    return result
  }
}
