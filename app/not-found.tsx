import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="portal-page">
      <section className="profile-card">
        <div>
          <p className="eyebrow">404</p>
          <h1 className="text-4xl font-bold tracking-tight">This page wandered off.</h1>
          <p className="profile-focus">There is still a way back home.</p>
          <Link href="/" className="not-found-link">
            Back to home
          </Link>
        </div>
      </section>
    </div>
  )
}
