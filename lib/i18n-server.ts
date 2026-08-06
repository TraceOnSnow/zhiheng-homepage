import { cookies } from 'next/headers'
import { defaultLocale, type Locale } from './i18n'

export async function getLocale(): Promise<Locale> {
  const locale = (await cookies()).get('NEXT_LOCALE')?.value
  return locale === 'zh' ? 'zh' : defaultLocale
}
