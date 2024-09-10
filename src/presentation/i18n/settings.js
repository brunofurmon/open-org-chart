export const fallbackLng = 'en';
export const languages = [fallbackLng, 'pt'];
export const defaultNS = 'translation';
export const cookieName = 'i18next';

export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    debug: process.env.NODE_ENV === 'development',
    supportedLngs: languages,
    preload: languages,
    lng,
    fallbackLng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  }
}