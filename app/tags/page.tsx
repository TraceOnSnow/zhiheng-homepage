import Link from '@/components/Link'
import { slug } from 'github-slugger'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'
import { getMessages } from '@/lib/i18n'
import { getLocale } from '@/lib/i18n-server'

export async function generateMetadata() {
  const copy = getMessages(await getLocale())
  return genPageMetadata({
    title: copy.pages.tagsTitle,
    description: copy.pages.tagsMetaDescription,
  })
}

export default async function Page() {
  const copy = getMessages(await getLocale())
  const tagCounts = tagData as Record<string, number>
  const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a])

  return (
    <div className="pb-8 sm:pb-12">
      <header className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 px-6 py-12 shadow-[0_24px_80px_-44px_rgba(88,80,180,0.5)] backdrop-blur-xl sm:px-10 dark:border-white/10 dark:bg-gray-900/70">
        <div className="anime-grid absolute inset-0 -z-10 opacity-45" />
        <p className="section-kicker">{copy.pages.tagsKicker}</p>
        <h1 className="section-title text-4xl sm:text-5xl">{copy.pages.tagsTitle}</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          {copy.pages.tagsDescription}
        </p>
      </header>

      <div className="mt-8 flex flex-wrap gap-3">
        {sortedTags.map((tag) => (
          <Link
            key={tag}
            href={`/tags/${slug(tag)}`}
            className="soft-card hover:text-primary-700 dark:hover:text-primary-200 inline-flex items-center gap-2 px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-200"
          >
            <span className="text-primary-400">#</span>
            {tag}
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-400 dark:bg-white/5">
              {tagCounts[tag]}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
