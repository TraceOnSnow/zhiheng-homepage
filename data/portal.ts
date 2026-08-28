export const portalLinks = {
  blog: 'https://blog.traceonsnow.com',
  // Update this one value when the final Projects route in Trace Blog is decided.
  projects: 'https://blog.traceonsnow.com/projects',
  github: 'https://github.com/TraceOnSnow',
  email: 'zhihengw02@outlook.com',
  // Replace this repository URL after Hayaku Shelf has a public deployment.
  hayaku: 'https://github.com/TraceOnSnow/hayaku-shelf',
  steamGuess: 'https://steam-guess.vercel.app',
} as const

export type PortalIconName = 'blog' | 'projects' | 'github' | 'shelf' | 'game'
export type PortalCardKey = 'blog' | 'projects' | 'github' | 'hayaku' | 'steamGuess'

export const portalCards = [
  { key: 'blog', href: portalLinks.blog, icon: 'blog', accent: 'lavender' },
  { key: 'projects', href: portalLinks.projects, icon: 'projects', accent: 'mint' },
  { key: 'github', href: portalLinks.github, icon: 'github', accent: 'sky' },
  { key: 'hayaku', href: portalLinks.hayaku, icon: 'shelf', accent: 'peach' },
  { key: 'steamGuess', href: portalLinks.steamGuess, icon: 'game', accent: 'butter' },
] as const satisfies ReadonlyArray<{
  key: PortalCardKey
  href: string
  icon: PortalIconName
  accent: string
}>
