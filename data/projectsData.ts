interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'SteamGuess',
    description: `SteamGuess is a fun and interactive game where players guess Steam games based on
    clues like popularity, reviews, release dates, and more. With a sleek interface and
    dynamic feedback, it’s perfect for gamers who love a challenge.`,
    imgSrc: '/static/images/steamguess.png',
    href: 'https://github.com/your-repo/SteamGuess',
  },
]

export default projectsData
