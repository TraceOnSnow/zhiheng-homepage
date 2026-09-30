import { cms, pageNumber, publicQuery } from '@/lib/cms'
import { Pagination, PostCard } from '@/components/content'
export const metadata = { title: '文章' }
export default async function Posts({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams
  const result = await (await cms()).find({ collection: 'posts', ...publicQuery, sort: '-publishedAt', depth: 1, limit: 12, page: pageNumber(page) })
  return <><h1>文章</h1><div className="stack">{result.docs.map(post => <PostCard key={post.id} post={post} />)}</div>
    {!result.totalDocs && <p className="empty">暂无已发布文章。</p>}<Pagination page={result.page || 1} totalPages={result.totalPages} path="/posts" /></>
}
