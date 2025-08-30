import { enMessages } from './en';

type MessageDict = Record<string, string>;

const locales: Record<string, MessageDict> = {
  en: enMessages,
};

let currentLocale = 'en';

export function setLocale(locale: string) {
  if (locales[locale]) {
    currentLocale = locale;
  } else {
    // eslint-disable-next-line no-console
    console.warn(`[i18n] Unknown locale '${locale}', falling back to 'en'`);
    currentLocale = 'en';
  }
}

export function t(key: string, vars?: Record<string, string | number>): string {
  const dict = locales[currentLocale] || enMessages;
  const template = dict[key] || key;
  if (!vars) return template;
  return Object.keys(vars).reduce((acc, varKey) => {
    const value = String(vars[varKey]);
    return acc.replace(new RegExp(`\\{${varKey}\\}`, 'g'), value);
  }, template);
}

