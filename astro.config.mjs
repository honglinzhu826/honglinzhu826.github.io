import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://honglinzhu826.github.io',
  i18n: {
    locales: ['zh', 'en'],
    defaultLocale: 'zh',
    routing: {
      prefixDefaultLocale: true
    },
    fallback: {
      en: 'zh'
    }
  }
});
