import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'
import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, company, email, twitter, bluesky, linkedin, github } = content

  return (
    <div className="pb-8 sm:pb-12">
      <header className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 px-6 py-12 shadow-[0_24px_80px_-44px_rgba(88,80,180,0.5)] backdrop-blur-xl sm:px-10 dark:border-white/10 dark:bg-gray-900/70">
        <div className="anime-grid absolute inset-0 -z-10 opacity-45" />
        <div className="absolute -top-20 -right-20 -z-10 h-56 w-56 rounded-full bg-pink-200/55 blur-3xl dark:bg-pink-500/10" />
        <p className="section-kicker">Character profile</p>
        <h1 className="section-title text-4xl sm:text-5xl">About me</h1>
      </header>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="soft-card p-6 text-center lg:sticky lg:top-28">
          {avatar && (
            <div className="relative mx-auto w-44">
              <div className="absolute inset-2 rotate-6 rounded-[2rem] bg-gradient-to-br from-cyan-300 to-pink-300 opacity-65" />
              <Image
                src={avatar}
                alt={name}
                width={192}
                height={192}
                className="relative aspect-square w-full -rotate-2 rounded-[2rem] border-4 border-white object-cover shadow-xl transition hover:rotate-0 dark:border-gray-900"
              />
            </div>
          )}
          <h2 className="mt-6 text-2xl font-black tracking-tight text-gray-950 dark:text-white">
            {name}
          </h2>
          <p className="text-primary-600 dark:text-primary-300 mt-2 text-sm font-semibold">
            {occupation}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{company}</p>
          <div className="mt-6 flex justify-center gap-4">
            <SocialIcon kind="mail" href={`mailto:${email}`} />
            <SocialIcon kind="github" href={github} />
            <SocialIcon kind="linkedin" href={linkedin} />
            <SocialIcon kind="x" href={twitter} />
            <SocialIcon kind="bluesky" href={bluesky} />
          </div>
        </aside>

        <article className="soft-card prose dark:prose-invert max-w-none p-7 sm:p-10">
          {children}
        </article>
      </div>
    </div>
  )
}
