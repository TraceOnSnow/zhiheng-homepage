import Image from 'next/image'
import { getMessages, type Locale } from '@/lib/i18n'
import { portalLinks, portalCards, type PortalIconName } from '@/data/portal'

const ArrowUpRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M8 7h9v9" />
  </svg>
)

const Icon = ({ name }: { name: PortalIconName }) => {
  const paths = {
    blog: (
      <>
        <path d="M5 4.5h10.5A2.5 2.5 0 0 1 18 7v12.5H7.5A2.5 2.5 0 0 1 5 17V4.5Z" />
        <path d="M5 17a2.5 2.5 0 0 1 2.5-2.5H18M8 8h6M8 11h5" />
      </>
    ),
    projects: (
      <>
        <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
        <path d="m4.5 7.5 7.5 4 7.5-4M12 12v9" />
      </>
    ),
    github: (
      <>
        <path d="M9 19c-4.5 1.5-4.5-2.5-6.3-3M15 22v-3.9c.1-1.1-.4-2.2-1.2-3 4 0 8.2-2 8.2-9a7 7 0 0 0-1.9-4.9A6.5 6.5 0 0 0 20 1.1S18.3.5 15 2.7a13.5 13.5 0 0 0-6 0C5.7.5 4 1.1 4 1.1a6.5 6.5 0 0 0-.1 2.1A7 7 0 0 0 2 8.1c0 7 4.2 9 8.2 9-.8.8-1.3 1.9-1.2 3V22" />
      </>
    ),
    shelf: (
      <>
        <path d="M4 5.5 12 3l8 2.5v13L12 21l-8-2.5v-13Z" />
        <path d="M8 9.5h8M8 13h8M8 16.5h4" />
      </>
    ),
    game: (
      <>
        <path d="M7.5 8h9a5 5 0 0 1 4.8 6.4l-1 3.4a2.5 2.5 0 0 1-4.3 1l-2.2-2.4h-3.6L8 18.8a2.5 2.5 0 0 1-4.3-1l-1-3.4A5 5 0 0 1 7.5 8Z" />
        <path d="M7 11v4M5 13h4M16.5 12.5h.01M19 15h.01" />
      </>
    ),
  }[name]

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths}
    </svg>
  )
}

export default function Home({ locale }: { locale: Locale }) {
  const copy = getMessages(locale)

  return (
    <div className="portal-page">
      <section className="profile-card">
        <div className="profile-copy">
          <p className="eyebrow">{copy.home.eyebrow}</p>
          <h1>
            treesonsnow<span>.</span>
          </h1>
          <p className="profile-intro">{copy.home.intro}</p>
          <p className="profile-focus">{copy.home.focus}</p>
          <div className="profile-links" aria-label={copy.home.basicLinksLabel}>
            <a href={portalLinks.github} target="_blank" rel="noreferrer">
              <Icon name="github" /> GitHub
            </a>
            <a href={`mailto:${portalLinks.email}`}>
              <span className="mail-mark">@</span> Email
            </a>
          </div>
        </div>
        <div className="avatar-frame">
          <Image
            src="/static/images/avatar.png"
            alt={copy.home.avatarAlt}
            width={401}
            height={401}
            priority
          />
          <span className="avatar-note">✦</span>
        </div>
      </section>

      <section className="portal-links" aria-labelledby="portal-links-title">
        <div className="section-heading">
          <p className="eyebrow">{copy.home.linksEyebrow}</p>
          <h2 id="portal-links-title">{copy.home.linksTitle}</h2>
        </div>
        <div className="link-grid">
          {portalCards.map((card) => (
            <a
              key={card.key}
              href={card.href}
              className={`portal-link-card accent-${card.accent}`}
              target="_blank"
              rel="noreferrer"
            >
              <span className="portal-link-icon">
                <Icon name={card.icon} />
              </span>
              <span className="portal-link-body">
                <strong>{copy.home.cards[card.key].title}</strong>
                <span>{copy.home.cards[card.key].description}</span>
              </span>
              <ArrowUpRight />
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
