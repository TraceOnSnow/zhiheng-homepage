interface Project {
  title: string
  description: string
  descriptionZh?: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'SteamGuess',
    description: `SteamGuess is a fun and interactive game where players guess Steam games based on
    clues like popularity, reviews, release dates, and more. With a sleek interface and
    dynamic feedback, it’s perfect for gamers who love a challenge.`,
    descriptionZh: `SteamGuess 是一个有趣的互动游戏，玩家需要根据人气、评价、发行日期等线索猜出 Steam 游戏。它拥有清爽的界面和即时反馈，适合喜欢挑战的玩家。`,
    imgSrc: '/static/images/steamguess.png',
    href: 'https://github.com/your-repo/SteamGuess',
  },
]

export default projectsData
