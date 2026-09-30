import Link from 'next/link'
import { cms, pageNumber, publicQuery } from '@/lib/cms'
import { Pagination, WorkCard } from '@/components/content'
import { workTypes } from '@/collections/Works'
export const metadata = { title: '作品记录' }
export default async function Works({ searchParams }: { searchParams: Promise<{ page?: string; type?: string }> }) {
  const params = await searchParams
  const type = workTypes.find(type => type === params.type)
  const result = await (await cms()).find({ collection: 'works', ...publicQuery, where: type ? { type: { equals: type } } : undefined, sort: '-updatedAt', limit: 24, page: pageNumber(params.page), depth: 1 })
  return <><h1>作品记录</h1><nav className="filters" aria-label="作品分类"><Link aria-current={!type ? 'page' : undefined} href="/works">全部</Link>
    {workTypes.map(item => <Link key={item} aria-current={type === item ? 'page' : undefined} href={`/works?type=${item}`}>{item}</Link>)}</nav>
    <div className="work-grid">{result.docs.map(work => <WorkCard key={work.id} work={work} />)}</div>
    {!result.totalDocs && <p className="empty">暂无作品记录。</p>}
    <Pagination page={result.page || 1} totalPages={result.totalPages} path={type ? `/works?type=${type}` : '/works'} />
  </>
}
