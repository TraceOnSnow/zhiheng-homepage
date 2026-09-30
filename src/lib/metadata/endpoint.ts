import type { Endpoint } from 'payload'
import { createGameSearch } from './games'

const search = createGameSearch({
  IGDB_CLIENT_ID: process.env.IGDB_CLIENT_ID,
  IGDB_CLIENT_SECRET: process.env.IGDB_CLIENT_SECRET,
  RAWG_API_KEY: process.env.RAWG_API_KEY,
})
export const searchEndpoint: Endpoint = {
  path: '/metadata/games', method: 'get',
  handler: async (req) => {
    const headers = { 'Cache-Control': 'private, no-store' }
    if (!req.user) return Response.json({ error: '请先登录。' }, { status: 401, headers })
    const query = new URL(req.url!).searchParams.get('q')?.normalize('NFKC').trim() || ''
    if (query.length < 2 || query.length > 100) return Response.json({ error: '搜索词需为 2–100 个字符。' }, { status: 400, headers })
    return Response.json(await search(query), { headers })
  },
}
