import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import { getMessages } from '@/lib/i18n'
import { getLocale } from '@/lib/i18n-server'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import LanguageSwitch from './LanguageSwitch'

const Header = async () => {
  const locale = await getLocale()
  const { nav, ui } = getMessages(locale)
  const labels = Object.fromEntries(
    Object.entries(nav).map(([key, value]) => [key, value])
  ) as Record<string, string>

  return (
    <header className="sticky top-3 z-50 mb-8 pt-3 sm:top-4 sm:mb-10 sm:pt-4">
      <div className="flex min-h-16 items-center justify-between rounded-2xl border border-white/75 bg-white/75 px-3 shadow-[0_12px_40px_-24px_rgba(72,62,130,0.55)] backdrop-blur-xl sm:px-5 dark:border-white/10 dark:bg-gray-950/72">
        <Link
          href="/"
          aria-label={siteMetadata.headerTitle}
          className="group flex items-center gap-2.5 rounded-xl py-2 pr-2"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-100 to-pink-100 shadow-sm transition-transform duration-300 group-hover:-rotate-6 dark:from-cyan-500/20 dark:to-pink-500/20">
            <Logo />
          </span>
          <span className="hidden text-lg font-black tracking-tight text-gray-900 sm:block dark:text-white">
            Zhiheng<span className="text-primary-500">.</span>
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <nav
            className="no-scrollbar hidden items-center gap-1 overflow-x-auto md:flex"
            aria-label={ui.mainNavigation}
          >
            {headerNavLinks
              .filter((link) => link.key !== 'home' && link.key !== 'resume')
              .map((link) => (
                <Link key={link.key} href={link.href} className="nav-link">
                  {labels[link.key]}
                </Link>
              ))}
          </nav>
          <div className="mx-1 hidden h-5 w-px bg-gray-200 md:block dark:bg-white/10" />
          <SearchButton label={ui.search} />
          <LanguageSwitch locale={locale} />
          <ThemeSwitch
            labels={{
              light: ui.light,
              dark: ui.dark,
              system: ui.system,
              switcher: ui.themeSwitcher,
            }}
          />
          <Link
            href="/static/files/Resume_zhiheng.pdf"
            className="resume-button hidden sm:inline-flex"
          >
            {nav.resume}
          </Link>
          <MobileNav labels={labels} toggleLabel={ui.toggleMenu} />
        </div>
      </div>
    </header>
  )
}

export default Header
