export type Locale = 'en' | 'zh'

export const defaultLocale: Locale = 'en'

export const messages = {
  en: {
    nav: {
      home: 'Home',
      blog: 'Blog',
      tags: 'Tags',
      projects: 'Projects',
      about: 'About',
      resume: 'Resume',
    },
    language: {
      label: 'Language',
      english: 'English',
      chinese: '中文',
    },
    home: {
      greeting: "Hello, world! I'm",
      status: 'Building curious things with AI',
      ctaProjects: 'Explore my work',
      ctaAbout: 'More about me',
      selectedWork: 'Selected work',
      workTitle: "Things I've been making",
      allProjects: 'All projects',
      notes: 'Latest notes',
      blogTitle: 'From the blog',
      readAll: 'Read all',
      alwaysExploring: 'always exploring',
      projectBadges: ['Web', 'Creative', 'Side project'],
    },
    pages: {
      projectsKicker: 'Playground',
      projectsTitle: 'Projects',
      projectsDescription: 'Experiments, side projects, and useful things built along the way.',
      tagsKicker: 'Collection',
      tagsTitle: 'Tags',
      tagsDescription: 'Little shelves for everything I write about.',
      aboutKicker: 'Character profile',
      aboutTitle: 'About me',
      blogKicker: 'Notes & stories',
      blogTitle: 'All Posts',
      blogDescription: 'Ideas, build logs, and things I want to remember.',
      topics: 'Topics',
      allPosts: 'All posts',
      previous: 'Previous',
      next: 'Next',
      noPosts: 'No posts found.',
    },
    footer: {
      title: "Let's make something fun.",
      description:
        'Somewhere between useful systems, playful ideas, and things worth writing down.',
      designed: 'Designed with curiosity ✦',
    },
  },
  zh: {
    nav: {
      home: '首页',
      blog: '博客',
      tags: '标签',
      projects: '项目',
      about: '关于我',
      resume: '简历',
    },
    language: {
      label: '语言',
      english: 'English',
      chinese: '中文',
    },
    home: {
      greeting: '你好，世界！我是',
      status: '正在用 AI 做一些有趣的东西',
      ctaProjects: '看看我的项目',
      ctaAbout: '更多关于我',
      selectedWork: '精选项目',
      workTitle: '最近在做的东西',
      allProjects: '全部项目',
      notes: '最新文章',
      blogTitle: '来自博客',
      readAll: '查看全部',
      alwaysExploring: '一直在探索',
      projectBadges: ['Web', '创意', '个人项目'],
    },
    pages: {
      projectsKicker: '我的游乐场',
      projectsTitle: '项目',
      projectsDescription: '一些实验、个人项目，以及一路上做出来的有用东西。',
      tagsKicker: '内容集合',
      tagsTitle: '标签',
      tagsDescription: '把我写过的东西放进不同的小抽屉里。',
      aboutKicker: '角色档案',
      aboutTitle: '关于我',
      blogKicker: '笔记与故事',
      blogTitle: '全部文章',
      blogDescription: '想法、构建记录，以及那些值得记下来的东西。',
      topics: '主题',
      allPosts: '全部文章',
      previous: '上一页',
      next: '下一页',
      noPosts: '暂时没有文章。',
    },
    footer: {
      title: '一起做点有趣的东西吧。',
      description: '在实用系统、有趣想法和值得记录的故事之间，保持好奇。',
      designed: '带着好奇心制作 ✦',
    },
  },
} as const

export type Messages = (typeof messages)[Locale]

export function getMessages(locale: Locale): Messages {
  return messages[locale]
}
