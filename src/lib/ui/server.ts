import { cache } from 'react'
import { cookies } from 'next/headers'
import { dictionaries, languageCookie, type Language } from './dictionary'
export const getUI = cache(async () => {
  const language: Language = (await cookies()).get(languageCookie)?.value === 'en' ? 'en' : 'zh'
  return { language, locale: language === 'en' ? 'en-US' : 'zh-CN', t: dictionaries[language] }
})
