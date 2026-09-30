import Link from 'next/link'
import type { Media, Post, Work } from '@/payload-types'

export const dateLabel = (date?: string | null) => date ? new Date(date).toLocaleDateString('zh-CN', { timeZone: 'UTC' }) : ''
export function Cover({ media, url, alt, className = '' }: { media?: number | Media | null; url?: string | null; alt: string; className?: string }) {
  const upload = media && typeof media === 'object' ? media : null
  const src = upload?.sizes?.card?.url || upload?.url || url
  if (!src) return null
  return <img src={src} alt={upload?.alt || alt} className={className} loading="lazy" referrerPolicy="no-referrer" />
}
export function Tags({ tags }: { tags?: string[] | null }) {
  return tags?.length ? <div className="tags">{tags.map(tag => <span key={tag}>{tag}</span>)}</div> : null
}
export function PostCard({ post }: { post: Post }) {
  return <article className="card post-card">
    <Cover media={post.cover} alt={post.title} className="post-cover" />
    <div><time className="muted" dateTime={post.publishedAt || undefined}>{dateLabel(post.publishedAt)}</time>
      <h2><Link href={`/posts/${post.slug}`}>{post.title}</Link></h2>
      {post.excerpt && <p>{post.excerpt}</p>}<Tags tags={post.tags} />
    </div>
  </article>
}
export function WorkCard({ work }: { work: Work }) {
  return <article className="card work-card">
    <Link href={`/works/${work.slug}`} className="work-cover-link" aria-label={work.title}>
      {work.cover || work.coverUrl ? <Cover media={work.cover} url={work.coverUrl} alt={work.title} className="work-cover" /> : <div className="cover-placeholder">{work.title}</div>}
    </Link>
    <div className="work-card-body"><span className="muted">{work.type} {work.releaseDate && `· ${work.releaseDate.slice(0, 4)}`}</span>
      <h2><Link href={`/works/${work.slug}`}>{work.title}</Link></h2>
      <p>{work.rating != null && <strong className="rating">{work.rating} / 10</strong>} <span className="muted">{work.status}</span></p>
      <Tags tags={work.tags} />
    </div>
  </article>
}
export function Pagination({ page, totalPages, path }: { page: number; totalPages: number; path: string }) {
  if (totalPages < 2) return null
  const separator = path.includes('?') ? '&' : '?'
  return <nav className="pagination" aria-label="分页">
    {page > 1 && <Link href={`${path}${separator}page=${page - 1}`}>← 上一页</Link>}
    <span>{page} / {totalPages}</span>
    {page < totalPages && <Link href={`${path}${separator}page=${page + 1}`}>下一页 →</Link>}
  </nav>
}
