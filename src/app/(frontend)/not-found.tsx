import { getUI } from '@/lib/ui/server'
import Link from 'next/link'
export default async function NotFound() { const { t } = await getUI(); return <section className="card"><h1>{t.notFound}</h1><Link href="/">{t.home}</Link></section> }
