import { Authors, allAuthors } from 'contentlayer/generated'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'
import { getMessages } from '@/lib/i18n'
import { getLocale } from '@/lib/i18n-server'

export async function generateMetadata() {
  const copy = getMessages(await getLocale())
  return genPageMetadata({ title: copy.pages.aboutTitle })
}

export default async function Page() {
  const locale = await getLocale()
  const copy = getMessages(locale)
  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  const mainContent = coreContent(author)

  return (
    <>
      <AuthorLayout content={mainContent} locale={locale} bio={copy.about.paragraphs} />
    </>
  )
}
