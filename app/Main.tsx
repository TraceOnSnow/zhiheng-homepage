import type { Blog } from 'contentlayer/generated'
import type { CoreContent } from 'pliny/utils/contentlayer'
import { formatDate } from 'pliny/utils/formatDate'
import Image from '@/components/Image'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import projectsData from '@/data/projectsData'
import siteMetadata from '@/data/siteMetadata'

const MAX_DISPLAY = 3

const ArrowUpRight = ({ className = 'h-4 w-4' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M8 7h9v9" />
  </svg>
)

const Sparkle = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 2c.55 5.02 2.98 7.45 8 8-5.02.55-7.45 2.98-8 8-.55-5.02-2.98-7.45-8-8 5.02-.55 7.45-2.98 8-8Z" />
  </svg>
)

export default function Home({ posts }: { posts: CoreContent<Blog>[] }) {
  const featuredProject = projectsData[0]

  return (
    <div className="pb-8 sm:pb-12">
      <section className="relative isolate overflow-hidden rounded-[2rem] border border-white/70 bg-white/72 px-5 py-10 shadow-[0_24px_80px_-36px_rgba(88,80,180,0.45)] backdrop-blur-xl sm:px-10 sm:py-16 lg:px-14 dark:border-white/10 dark:bg-gray-900/72">
        <div className="anime-grid absolute inset-0 -z-20 opacity-50" />
        <div className="absolute -top-24 -right-20 -z-10 h-72 w-72 rounded-full bg-cyan-200/55 blur-3xl dark:bg-cyan-500/15" />
        <div className="absolute -bottom-24 -left-16 -z-10 h-72 w-72 rounded-full bg-pink-200/60 blur-3xl dark:bg-pink-500/15" />
        <Sparkle className="float-slow absolute top-8 right-[12%] h-7 w-7 text-pink-300 dark:text-pink-400/70" />
        <Sparkle className="float-delayed absolute bottom-16 left-[6%] h-4 w-4 text-cyan-400 dark:text-cyan-300/70" />

        <div className="grid items-center gap-10 lg:grid-cols-[1fr_320px] lg:gap-14">
          <div className="max-w-2xl">
            <div className="border-primary-200/80 bg-primary-50/90 text-primary-700 dark:border-primary-400/20 dark:bg-primary-500/10 dark:text-primary-200 mb-6 inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Building curious things with AI
            </div>

            <p className="mb-3 text-sm font-bold tracking-[0.22em] text-cyan-600 uppercase dark:text-cyan-300">
              Hello, world! I&apos;m
            </p>
            <h1 className="text-5xl leading-[0.98] font-black tracking-[-0.05em] text-balance text-gray-950 sm:text-6xl lg:text-7xl dark:text-white">
              Zhiheng
              <span className="text-gradient block pb-2">Wang.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600 sm:text-xl dark:text-gray-300">
              {siteMetadata.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/projects" className="button-primary group">
                Explore my work
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link href="/about" className="button-secondary">
                More about me
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[300px] lg:mx-0">
            <div className="absolute inset-4 rotate-6 rounded-[2.5rem] bg-gradient-to-br from-cyan-300 to-pink-300 opacity-70 blur-sm dark:opacity-40" />
            <div className="relative -rotate-2 rounded-[2.5rem] border border-white/80 bg-white/65 p-3 shadow-2xl backdrop-blur-md transition-transform duration-300 hover:rotate-0 dark:border-white/15 dark:bg-white/8">
              <Image
                src="/static/images/avatar.png"
                alt="Zhiheng Wang"
                width={401}
                height={401}
                priority
                className="aspect-square w-full rounded-[2rem] object-cover"
              />
              <div className="absolute -right-4 -bottom-3 rotate-3 rounded-2xl border border-white/80 bg-white/90 px-4 py-2 text-sm font-bold text-gray-800 shadow-lg backdrop-blur dark:border-white/10 dark:bg-gray-900/90 dark:text-gray-100">
                <span className="mr-1.5 text-pink-400">✦</span> always exploring
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="section-kicker">Selected work</p>
            <h2 className="section-title">Things I&apos;ve been making</h2>
          </div>
          <Link href="/projects" className="text-link hidden sm:inline-flex">
            All projects <ArrowUpRight />
          </Link>
        </div>

        {featuredProject && (
          <article className="group grid overflow-hidden rounded-[2rem] border border-gray-200/70 bg-white shadow-[0_20px_60px_-38px_rgba(76,65,140,0.5)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_-38px_rgba(76,65,140,0.65)] md:grid-cols-[1.1fr_0.9fr] dark:border-white/10 dark:bg-gray-900/75">
            {featuredProject.imgSrc && (
              <div className="relative min-h-60 overflow-hidden bg-gradient-to-br from-cyan-100 to-pink-100 md:min-h-80 dark:from-cyan-950 dark:to-pink-950">
                <Image
                  src={featuredProject.imgSrc}
                  alt={featuredProject.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  sizes="(min-width: 768px) 55vw, 100vw"
                />
              </div>
            )}
            <div className="flex flex-col justify-center p-7 sm:p-10">
              <div className="mb-5 flex flex-wrap gap-2">
                {['Web', 'Creative', 'Side project'].map((item) => (
                  <span key={item} className="soft-badge">
                    {item}
                  </span>
                ))}
              </div>
              <h3 className="text-3xl font-black tracking-tight text-gray-950 dark:text-white">
                {featuredProject.title}
              </h3>
              <p className="mt-4 line-clamp-4 leading-7 text-gray-600 dark:text-gray-300">
                {featuredProject.description}
              </p>
              {featuredProject.href && (
                <Link href={featuredProject.href} className="text-link mt-7 self-start">
                  View project <ArrowUpRight />
                </Link>
              )}
            </div>
          </article>
        )}
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-gradient-to-br from-cyan-50/85 via-white/90 to-pink-50/85 p-6 shadow-[0_24px_80px_-48px_rgba(88,80,180,0.5)] sm:p-10 dark:border-white/10 dark:from-cyan-950/35 dark:via-gray-900/80 dark:to-pink-950/30">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="section-kicker">Latest notes</p>
            <h2 className="section-title">From the blog</h2>
          </div>
          <Link href="/blog" className="text-link hidden sm:inline-flex">
            Read all <ArrowUpRight />
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {!posts.length && <p className="text-gray-500">No posts found.</p>}
          {posts.slice(0, MAX_DISPLAY).map((post, index) => {
            const { slug, date, title, summary, tags } = post
            return (
              <article key={slug} className="soft-card group flex min-h-64 flex-col p-6">
                <div className="mb-5 flex items-center justify-between text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
                  <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                  <span className="text-primary-400">0{index + 1}</span>
                </div>
                <h3 className="text-xl leading-7 font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
                  <Link
                    href={`/blog/${slug}`}
                    className="group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors"
                  >
                    {title}
                  </Link>
                </h3>
                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  {summary}
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {tags.slice(0, 2).map((tag) => (
                    <Tag key={tag} text={tag} />
                  ))}
                </div>
              </article>
            )
          })}
        </div>

        <Link href="/blog" className="button-secondary mt-6 w-full justify-center sm:hidden">
          Read all posts
        </Link>
      </section>
    </div>
  )
}
