'use client'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { languageCookie, type Language } from '@/lib/ui/dictionary'
export function LanguageSwitch({ language }: { language: Language }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  function switchLanguage() {
    const next = language === 'zh' ? 'en' : 'zh'
    document.cookie = `${languageCookie}=${next}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`
    startTransition(() => router.refresh())
  }
  return <button className="language-switch" type="button" disabled={pending} onClick={switchLanguage}
    aria-label={language === 'zh' ? 'Switch to English' : '切换为中文'} lang={language === 'zh' ? 'en' : 'zh-CN'}>
    {language === 'zh' ? 'English' : '中文'}
  </button>
}
