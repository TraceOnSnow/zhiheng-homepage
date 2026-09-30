import type { Metadata } from 'next'
import Link from 'next/link'
import './styles.css'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  metadataBase: new URL(process.env.SERVER_URL || 'http://localhost:3000'),
  title: { default: 'Zhiheng Wang · TraceOnSnow', template: '%s · TraceOnSnow' },
  description: 'AI Engineer · Agent Systems · Multimodal Knowledge Graphs · Rice CS',
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-CN"><body>
    <header className="site-header"><Link className="brand" href="/">TraceOnSnow<span> / Zhiheng Wang</span></Link>
      <nav aria-label="主导航"><Link href="/posts">文章</Link><Link href="/works">作品记录</Link><Link href="/projects">Projects</Link><a href="https://github.com/TraceOnSnow">GitHub ↗</a></nav>
    </header>
    <main className="site-main">{children}</main>
    <footer className="site-footer"><span>© {new Date().getFullYear()} Zhiheng Wang</span><Link href="/admin">管理</Link></footer>
  </body></html>
}
