import { getUI } from '@/lib/ui/server'
import { uiLabel } from '@/lib/ui/dictionary'
import Link from 'next/link'
import type { Media, Post, Work } from '@/payload-types'

export const dateLabel = (date?: string | null, locale = 'zh-CN') => date ? new Date(date).toLocaleDateString(locale, { timeZone: 'UTC' }) : ''
export function Cover({ media, url, alt, className = '' }: { media?: number | Media | null; url?: string | null; alt: string; className?: string }) {
  const upload = media && typeof media === 'object' ? media : null
  const src = upload?.sizes?.card?.url || upload?.url || url
  if (!src) return null
  return <img src={src} alt={upload?.alt || alt} className={className} loading="lazy" referrerPolicy="no-referrer" />
}
export function Tags({ tags }: { tags?: string[] | null }) {
  return tags?.length ? <div className="tags">{tags.map(tag => <span key={tag}>{tag}</span>)}</div> : null
}
export async function PostCard({ post }: { post: Post }) {
  const { locale } = await getUI()
  return <article className="card post-card">
    <Cover media={post.cover} alt={post.title} className="post-cover" />
    <div><time className="muted" dateTime={post.publishedAt || undefined}>{dateLabel(post.publishedAt, locale)}</time>
      <h2><Link href={`/posts/${post.slug}`}>{post.title}</Link></h2>
      {post.excerpt && <p>{post.excerpt}</p>}<Tags tags={post.tags} />
    </div>
  </article>
}
export async function WorkCard({ work }: { work: Work }) {
  const { language } = await getUI()
  return <article className="card work-card">
    <Link href={`/works/${work.slug}`} className="work-cover-link" aria-label={work.title}>
      {work.cover || work.coverUrl ? <Cover media={work.cover} url={work.coverUrl} alt={work.title} className="work-cover" /> : <div className="cover-placeholder">{work.title}</div>}
    </Link>
    <div className="work-card-body"><span className="muted">{uiLabel(language, work.type)} {work.releaseDate && `· ${work.releaseDate.slice(0, 4)}`}</span>
      <h2><Link href={`/works/${work.slug}`}>{work.title}</Link></h2>
      <p>{work.rating != null && <strong className="rating">{work.rating} / 10</strong>} <span className="muted">{uiLabel(language, work.status)}</span></p>
      <Tags tags={work.tags} />
    </div>
  </article>
}
export async function Pagination({ page, totalPages, path }: { page: number; totalPages: number; path: string }) {
  const { t } = await getUI()
  if (totalPages < 2) return null
  const separator = path.includes('?') ? '&' : '?'
  return <nav className="pagination" aria-label={t.pagination}>
    {page > 1 && <Link href={`${path}${separator}page=${page - 1}`}>{t.previous}</Link>}
    <span>{page} / {totalPages}</span>
    {page < totalPages && <Link href={`${path}${separator}page=${page + 1}`}>{t.next}</Link>}
  </nav>
}
