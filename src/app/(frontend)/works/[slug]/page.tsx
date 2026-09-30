import { notFound } from 'next/navigation'
import { cms, pageNumber, publicQuery } from '@/lib/cms'
import { Cover, Pagination, PostCard, Tags, dateLabel } from '@/components/content'

async function getWork(slug: string) {
  return (await (await cms()).find({ collection: 'works', ...publicQuery, where: { slug: { equals: slug } }, limit: 1, depth: 1 })).docs[0]
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const work = await getWork((await params).slug)
  return { title: work?.title || '作品不存在' }
}
export default async function Work({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> }) {
  const work = await getWork((await params).slug)
  if (!work) notFound()
  const posts = await (await cms()).find({ collection: 'posts', ...publicQuery, where: { relatedWorks: { contains: work.id } }, sort: '-publishedAt', limit: 12, page: pageNumber((await searchParams).page), depth: 1 })
  return <>
    <article className="card work-detail"><Cover media={work.cover} url={work.coverUrl} alt={work.title} className="detail-cover" />
      <div><span className="muted">{work.type}</span><h1>{work.title}</h1>
        {work.aliases?.length ? <p className="muted">{work.aliases.join(' / ')}</p> : null}
        <p>{work.rating != null && <strong className="rating">{work.rating} / 10</strong>} {work.status}</p>
        <dl>{work.releaseDate && <><dt>发行日期</dt><dd>{dateLabel(work.releaseDate)}</dd></>}
          {!!work.creators?.length && <><dt>创作者</dt><dd>{work.creators.join(' / ')}</dd></>}
          {!!work.platforms?.length && <><dt>平台</dt><dd>{work.platforms.join(' / ')}</dd></>}
        </dl><Tags tags={work.tags} />
        {work.description && <p className="preserve-lines">{work.description}</p>}
        {!!work.sources?.length && <p className="muted sources">资料来源：{work.sources.map(source => source.url ? <a key={source.id} href={source.url} rel="noopener noreferrer">{source.provider.toUpperCase()} ↗</a> : <span key={source.id}>{source.provider}:{source.externalId}</span>)}</p>}
      </div>
    </article>
    {work.note && <section className="card note"><h2>感想</h2><p className="preserve-lines">{work.note}</p></section>}
    {!!work.experiences?.length && <section className="card note"><h2>体验记录</h2>{work.experiences.map(experience => <div className="experience" key={experience.id}>
      <p className="muted">{dateLabel(experience.startedOn)}{experience.endedOn && ` → ${dateLabel(experience.endedOn)}`} · {experience.status} {experience.platform}</p>
      {experience.progress && <p>{experience.progress}</p>}{experience.note && <p className="preserve-lines">{experience.note}</p>}
    </div>)}</section>}
    <div className="section-heading"><h2>相关文章</h2></div><div className="stack">{posts.docs.map(post => <PostCard key={post.id} post={post} />)}</div>
    {!posts.totalDocs && <p className="empty">暂无相关文章。</p>}<Pagination page={posts.page || 1} totalPages={posts.totalPages} path={`/works/${work.slug}`} />
  </>
}
