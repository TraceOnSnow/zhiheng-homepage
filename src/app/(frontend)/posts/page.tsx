import { getUI } from '@/lib/ui/server'
import { cms, pageNumber, publicQuery } from '@/lib/cms'
import { Pagination, PostCard } from '@/components/content'
export async function generateMetadata() { return { title: (await getUI()).t.posts } }
export default async function Posts({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { t } = await getUI()
  const { page } = await searchParams
  const result = await (await cms()).find({ collection: 'posts', ...publicQuery, sort: '-publishedAt', depth: 1, limit: 12, page: pageNumber(page) })
  return <><h1>{t.posts}</h1><div className="stack">{result.docs.map(post => <PostCard key={post.id} post={post} />)}</div>
    {!result.totalDocs && <p className="empty">{t.emptyPosts}</p>}<Pagination page={result.page || 1} totalPages={result.totalPages} path="/posts" /></>
}
