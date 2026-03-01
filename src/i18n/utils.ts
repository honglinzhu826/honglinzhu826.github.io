import { ui, languages, type Lang } from './ui';

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as Lang;
  return 'zh';
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof typeof ui['zh']): string {
    return ui[lang][key] || ui['zh'][key];
  };
}

export function getRouteFromUrl(url: URL, newLang: Lang): string {
  const currentLang = getLangFromUrl(url);
  const pathWithoutLang = url.pathname.replace(`/${currentLang}`, '') || '/';
  return `/${newLang}${pathWithoutLang}`;
}
