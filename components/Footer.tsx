import { getMessages } from '@/lib/i18n'
import { getLocale } from '@/lib/i18n-server'

export default async function Footer() {
  const copy = getMessages(await getLocale())

  return (
    <footer className="site-footer">
      <span>© {new Date().getFullYear()} Zhiheng Wang</span>
      <span>{copy.footer}</span>
    </footer>
  )
}
