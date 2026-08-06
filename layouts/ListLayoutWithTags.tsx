'use client'

import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import tagData from 'app/tag-data.json'
import { getMessages, type Locale } from '@/lib/i18n'

interface PaginationProps {
  totalPages: number
  currentPage: number
}

interface PaginationLabels {
  previous: string
  next: string
  pagination: string
}

interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
  locale: Locale
}

function Pagination({
  totalPages,
  currentPage,
  labels,
}: PaginationProps & { labels: PaginationLabels }) {
  const pathname = usePathname()
  const basePath = pathname
    .replace(/^\//, '')
    .replace(/\/page\/\d+\/?$/, '')
    .replace(/\/$/, '')
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <nav
      className="mt-8 flex items-center justify-between border-t border-gray-200/70 pt-6 dark:border-white/10"
      aria-label={labels.pagination}
    >
      {prevPage ? (
        <Link
          className="button-secondary"
          href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
          rel="prev"
        >
          {labels.previous}
        </Link>
      ) : (
        <span />
      )}
      <span className="text-sm font-semibold text-gray-400">
        {currentPage} / {totalPages}
      </span>
      {nextPage ? (
        <Link className="button-secondary" href={`/${basePath}/page/${currentPage + 1}`} rel="next">
          {labels.next}
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
  locale,
}: ListLayoutProps) {
  const copy = getMessages(locale)
  const pathname = usePathname()
  const tagCounts = tagData as Record<string, number>
  const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a])
  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <div className="pb-8 sm:pb-12">
      <header className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 px-6 py-12 shadow-[0_24px_80px_-44px_rgba(88,80,180,0.5)] backdrop-blur-xl sm:px-10 dark:border-white/10 dark:bg-gray-900/70">
        <div className="anime-grid absolute inset-0 -z-10 opacity-45" />
        <div className="absolute -top-20 -right-20 -z-10 h-56 w-56 rounded-full bg-cyan-200/55 blur-3xl dark:bg-cyan-500/10" />
        <p className="section-kicker">{copy.pages.blogKicker}</p>
        <h1 className="section-title text-4xl sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">
          {copy.pages.blogDescription}
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="soft-card p-4">
            <p className="px-2 pb-3 text-xs font-extrabold tracking-[0.18em] text-gray-400 uppercase">
              {copy.pages.topics}
            </p>
            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
              <Link
                href="/blog"
                className={`rounded-xl px-3 py-2 text-sm font-bold whitespace-nowrap transition ${pathname.startsWith('/blog') ? 'bg-primary-100 text-primary-700 dark:bg-primary-400/15 dark:text-primary-200' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5'}`}
              >
                {copy.pages.allPosts} <span className="ml-1 opacity-55">{posts.length}</span>
              </Link>
              {sortedTags.map((tag) => {
                const active = decodeURI(pathname.split('/tags/')[1] || '') === slug(tag)
                return (
                  <Link
                    key={tag}
                    href={`/tags/${slug(tag)}`}
                    className={`rounded-xl px-3 py-2 text-sm font-semibold whitespace-nowrap transition ${active ? 'bg-primary-100 text-primary-700 dark:bg-primary-400/15 dark:text-primary-200' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5'}`}
                  >
                    {tag} <span className="ml-1 opacity-55">{tagCounts[tag]}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </aside>

        <div className="grid gap-4">
          {displayPosts.map((post, index) => {
            const { path, date, title: postTitle, summary, tags } = post
            return (
              <article key={path} className="soft-card group p-6 sm:p-7">
                <div className="flex gap-5">
                  <span className="text-primary-300 dark:text-primary-500 hidden pt-1 text-sm font-black sm:block">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <time
                      dateTime={date}
                      suppressHydrationWarning
                      className="text-xs font-bold tracking-wider text-gray-400 uppercase"
                    >
                      {formatDate(date, siteMetadata.locale)}
                    </time>
                    <h2 className="mt-2 text-2xl font-black tracking-tight text-gray-950 dark:text-white">
                      <Link
                        href={`/${path}`}
                        className="group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors"
                      >
                        {postTitle}
                      </Link>
                    </h2>
                    <p className="mt-3 line-clamp-2 leading-7 text-gray-600 dark:text-gray-300">
                      {summary}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {tags?.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
          {pagination && pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              labels={{
                previous: copy.pages.previous,
                next: copy.pages.next,
                pagination: copy.ui.pagination,
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
