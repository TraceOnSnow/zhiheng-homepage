export type Locale = 'en' | 'zh'

export const defaultLocale: Locale = 'en'

export const messages = {
  en: {
    nav: { blog: 'Blog', github: 'GitHub' },
    language: { switchToChinese: '切换到中文', switchToEnglish: 'Switch to English' },
    ui: { themeSwitcher: 'Toggle theme', light: 'Light mode', dark: 'Dark mode' },
    home: {
      eyebrow: 'A small corner of the internet',
      intro: 'I’m Zhiheng — an AI engineer who likes making useful, slightly playful things.',
      focus: 'Currently exploring agent systems, multimodal AI, and the web around them.',
      basicLinksLabel: 'Basic links',
      avatarAlt: 'Zhiheng Wang',
      linksEyebrow: 'Elsewhere',
      linksTitle: 'A few places to find me',
      cards: {
        blog: { title: 'Trace Blog', description: 'Notes, experiments, and things worth keeping.' },
        projects: { title: 'Projects', description: 'My projects live with the blog, not here.' },
        github: { title: 'GitHub', description: 'Code, unfinished ideas, and small tools.' },
        hayaku: {
          title: 'Hayaku Shelf',
          description: 'A personal shelf for things I have seen and liked.',
        },
        steamGuess: { title: 'SteamGuess', description: 'Guess the game from the clues.' },
      },
    },
    footer: 'Made for wandering around the internet.',
  },
  zh: {
    nav: { blog: '博客', github: 'GitHub' },
    language: { switchToChinese: '切换到中文', switchToEnglish: '切换到英文' },
    ui: { themeSwitcher: '切换主题', light: '浅色模式', dark: '深色模式' },
    home: {
      eyebrow: '互联网里的一小块角落',
      intro: '我是 Zhiheng，一个喜欢把有用、又带点趣味的东西做出来的 AI 工程师。',
      focus: '最近在折腾智能体系统、多模态 AI，以及和它们有关的 Web。',
      basicLinksLabel: '基础链接',
      avatarAlt: 'Zhiheng Wang 的头像',
      linksEyebrow: '其他入口',
      linksTitle: '可以在这些地方找到我',
      cards: {
        blog: { title: 'Trace Blog', description: '笔记、实验，以及那些值得留下来的东西。' },
        projects: {
          title: 'Projects',
          description: '项目展示会和博客放在一起，不在这里重复维护。',
        },
        github: { title: 'GitHub', description: '代码、未完成的想法，以及一些小工具。' },
        hayaku: { title: 'Hayaku Shelf', description: '记录看过、读过、玩过和喜欢过的东西。' },
        steamGuess: { title: 'SteamGuess', description: '根据线索猜猜这是哪款游戏。' },
      },
    },
    footer: '给喜欢在互联网里闲逛的人。',
  },
} as const

export type Messages = (typeof messages)[Locale]

export function getMessages(locale: Locale): Messages {
  return messages[locale]
}
