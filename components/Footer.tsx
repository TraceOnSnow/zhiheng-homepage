import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  return (
    <footer className="mt-16 pb-6 sm:mt-24">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/65 px-6 py-8 shadow-[0_20px_60px_-38px_rgba(76,65,140,0.5)] backdrop-blur-xl sm:px-10 dark:border-white/10 dark:bg-gray-900/65">
        <div className="absolute -right-16 -bottom-20 h-48 w-48 rounded-full bg-pink-200/45 blur-3xl dark:bg-pink-500/10" />
        <div className="relative flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
              Let&apos;s make something fun.
            </p>
            <p className="mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
              Somewhere between useful systems, playful ideas, and things worth writing down.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={6} />
            <SocialIcon kind="github" href={siteMetadata.github} size={6} />
            <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={6} />
          </div>
        </div>
        <div className="relative mt-8 flex flex-col gap-2 border-t border-gray-200/70 pt-5 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:text-gray-500">
          <span>
            © {new Date().getFullYear()} {siteMetadata.author}
          </span>
          <Link href="/" className="hover:text-primary-500 transition-colors">
            Designed with curiosity ✦
          </Link>
        </div>
      </div>
    </footer>
  )
}
