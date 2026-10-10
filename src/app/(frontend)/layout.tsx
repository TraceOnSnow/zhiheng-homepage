import type { Metadata } from 'next'
import Link from 'next/link'
import './styles.css'
import { getUI } from '@/lib/ui/server'
import { LanguageSwitch } from '@/components/LanguageSwitch'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  metadataBase: new URL(process.env.SERVER_URL || 'http://localhost:3000'),
  title: { default: 'Zhiheng Wang · TraceOnSnow', template: '%s · TraceOnSnow' },
  description: 'AI Engineer · Agent Systems · Multimodal Knowledge Graphs · Rice CS',
}
export default async function Layout({ children }: { children: React.ReactNode }) {
  const { language, locale, t } = await getUI()
  return <html lang={locale}><body>
    <header className="site-header"><Link className="brand" href="/">TraceOnSnow<span> / Zhiheng Wang</span></Link>
      <nav aria-label={t.navigation}><Link href="/posts">{t.posts}</Link><Link href="/works">{t.works}</Link><Link href="/projects">{t.projects}</Link><a href="https://github.com/TraceOnSnow">GitHub ↗</a><LanguageSwitch language={language} /></nav>
    </header>
    <main className="site-main">{children}</main>
    <footer className="site-footer"><span>© {new Date().getFullYear()} Zhiheng Wang</span><div><Link href="/credits">{t.credits}</Link> · <Link href="/admin">{t.admin}</Link></div></footer>
  </body></html>
}
