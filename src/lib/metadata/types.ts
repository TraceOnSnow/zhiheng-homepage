export type Provider = 'igdb' | 'rawg'
export type Source = { provider: string; externalId: string; url?: string; fetchedAt?: string }
export type GameCandidate = {
  provider: Provider
  externalId: string
  title: string
  aliases: string[]
  coverUrl?: string
  releaseDate?: string
  creators: string[]
  platforms: string[]
  description?: string
  source: Source
}
export type SearchResult = {
  candidates: GameCandidate[]
  providers: { provider: Provider; state: 'ok' | 'unavailable' | 'error' | 'rate-limited'; message?: string }[]
}
