import Image from './Image'
import Link from './Link'

interface CardProps {
  title: string
  description: string
  imgSrc?: string
  href?: string
}

const ArrowUpRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M8 7h9v9" />
  </svg>
)

const Card = ({ title, description, imgSrc, href }: CardProps) => (
  <article className="soft-card group flex h-full flex-col overflow-hidden">
    {imgSrc && (
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-cyan-100 to-pink-100 dark:from-cyan-950 dark:to-pink-950">
        <Image
          alt={title}
          src={imgSrc}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
        />
      </div>
    )}
    <div className="flex flex-1 flex-col p-6 sm:p-7">
      <h2 className="text-2xl font-black tracking-tight text-gray-950 dark:text-white">
        {href ? <Link href={href}>{title}</Link> : title}
      </h2>
      <p className="mt-3 flex-1 leading-7 text-gray-600 dark:text-gray-300">{description}</p>
      {href && (
        <Link
          href={href}
          className="text-link mt-6 inline-flex self-start"
          aria-label={`Link to ${title}`}
        >
          View project <ArrowUpRight />
        </Link>
      )}
    </div>
  </article>
)

export default Card
