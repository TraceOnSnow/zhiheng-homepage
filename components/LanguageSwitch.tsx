'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { Locale } from '@/lib/i18n'

interface Props {
  locale: Locale
}

export default function LanguageSwitch({ locale }: Props) {
  const router = useRouter()
  const [currentLocale, setCurrentLocale] = useState(locale)

  useEffect(() => {
    setCurrentLocale(locale)
  }, [locale])

  const toggleLocale = () => {
    const nextLocale: Locale = currentLocale === 'en' ? 'zh' : 'en'
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; samesite=lax`
    setCurrentLocale(nextLocale)
    router.refresh()
  }

  return (
    <button
      type="button"
      className="icon-button px-2.5 text-xs font-black tracking-wide"
      aria-label={currentLocale === 'en' ? '切换到中文' : 'Switch to English'}
      title={currentLocale === 'en' ? '切换到中文' : 'Switch to English'}
      onClick={toggleLocale}
    >
      {currentLocale === 'en' ? '中' : 'EN'}
    </button>
  )
}
