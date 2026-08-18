import Main from './Main'
import { getLocale } from '@/lib/i18n-server'

export default async function Page() {
  return <Main locale={await getLocale()} />
}
