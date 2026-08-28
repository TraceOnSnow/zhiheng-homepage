import Link from 'next/link'
import { getMessages } from '@/lib/i18n'
import { getLocale } from '@/lib/i18n-server'
import { portalLinks } from '@/data/portal'
import LanguageSwitch from './LanguageSwitch'
import ThemeSwitch from './ThemeSwitch'

export default async function Header() {
  const locale = await getLocale()
  const copy = getMessages(locale)

  return (
    <header className="site-header">
      <Link href="/" className="wordmark" aria-label="traceonsnow home">
        traceonsnow<span>.</span>
      </Link>
      <nav className="quiet-nav" aria-label="Primary navigation">
        <a href={portalLinks.blog} target="_blank" rel="noreferrer">
          {copy.nav.blog}
        </a>
        <a href={portalLinks.github} target="_blank" rel="noreferrer">
          {copy.nav.github}
        </a>
        <LanguageSwitch locale={locale} />
        <ThemeSwitch labels={copy.ui} />
      </nav>
    </header>
  )
}
