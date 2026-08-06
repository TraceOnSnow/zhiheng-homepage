import Link from 'next/link'
import { slug } from 'github-slugger'

interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className="border-primary-100 bg-primary-50/80 text-primary-700 hover:border-primary-200 hover:bg-primary-100 dark:border-primary-400/15 dark:bg-primary-400/10 dark:text-primary-200 dark:hover:bg-primary-400/15 inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase transition"
    >
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
