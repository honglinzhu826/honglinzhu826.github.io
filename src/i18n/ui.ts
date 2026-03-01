export const languages = {
  zh: '中文',
  en: 'English'
};

export const ui = {
  zh: {
    'nav.home': '首页',
    'nav.blog': '博客',
    'nav.thoughts': '想法',
    'blog.title': '博客',
    'blog.description': '技术文章与思考',
    'thoughts.title': '想法',
    'thoughts.description': '随笔与随想',
    'language.switch': '切换语言',
    'back.home': '返回首页',
    'published.on': '发布于',
    'tags': '标签',
    'read.more': '阅读更多',
    'no.posts': '暂无文章',
    'no.thoughts': '暂无想法'
  },
  en: {
    'nav.home': 'Home',
    'nav.blog': 'Blog',
    'nav.thoughts': 'Thoughts',
    'blog.title': 'Blog',
    'blog.description': 'Technical articles and thoughts',
    'thoughts.title': 'Thoughts',
    'thoughts.description': 'Essays and musings',
    'language.switch': 'Switch Language',
    'back.home': 'Back to Home',
    'published.on': 'Published on',
    'tags': 'Tags',
    'read.more': 'Read more',
    'no.posts': 'No posts yet',
    'no.thoughts': 'No thoughts yet'
  }
};

export type Lang = keyof typeof languages;
