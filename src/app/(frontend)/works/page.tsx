import { getUI } from '@/lib/ui/server'
import { uiLabel } from '@/lib/ui/dictionary'
import Link from 'next/link'
import { cms, pageNumber, publicQuery } from '@/lib/cms'
import { Pagination, WorkCard } from '@/components/content'
import { workTypes } from '@/collections/Works'
export async function generateMetadata() { return { title: (await getUI()).t.works } }
export default async function Works({ searchParams }: { searchParams: Promise<{ page?: string; type?: string }> }) {
  const { t, language } = await getUI()
  const params = await searchParams
  const type = workTypes.find(type => type === params.type)
  const result = await (await cms()).find({ collection: 'works', ...publicQuery, where: type ? { type: { equals: type } } : undefined, sort: '-updatedAt', limit: 24, page: pageNumber(params.page), depth: 1 })
  return <><h1>{t.works}</h1><nav className="filters" aria-label={t.filters}><Link aria-current={!type ? 'page' : undefined} href="/works">{t.all}</Link>
    {workTypes.map(item => <Link key={item} aria-current={type === item ? 'page' : undefined} href={`/works?type=${item}`}>{uiLabel(language, item)}</Link>)}</nav>
    <div className="work-grid">{result.docs.map(work => <WorkCard key={work.id} work={work} />)}</div>
    {!result.totalDocs && <p className="empty">{t.emptyWorks}</p>}
    <Pagination page={result.page || 1} totalPages={result.totalPages} path={type ? `/works?type=${type}` : '/works'} />
  </>
}
