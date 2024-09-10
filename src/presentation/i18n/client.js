'use client';

import i18next from 'i18next';
import { useEffect, useState } from 'react';
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next';
import { useCookies } from 'react-cookie';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { getOptions, languages, cookieName } from './settings';

const runsOnServerSide = typeof window === 'undefined';

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend((language, namespace) => import(`./locales/${language}/${namespace}.json`)))
  .init({
    ...getOptions(),
    detection: {
      order: ['path', 'htmlTag', 'cookie', 'navigator'],
    },
    preload: runsOnServerSide ? languages : []
  });

export const useTranslation = (ns, options) => {
  const [cookies, setCookie] = useCookies([cookieName]);
  const lng = cookies.i18next;
  const ret = useTranslationOrg(ns, options);
  const { i18n } = ret;
  const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage);

  useEffect(() => {
    const handleLanguageChange = (lng) => {
      setCookie(cookieName, lng, { path: '/' });
    };
    i18n.on('languageChanged', handleLanguageChange);

  }, [i18n, setCookie]);

  if (runsOnServerSide && lng && i18n.resolvedLanguage !== lng) {
    i18n.changeLanguage(lng);
    return ret;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (activeLng === i18n.resolvedLanguage) {
      return;
    }
    setActiveLng(i18n.resolvedLanguage);
  }, [activeLng, i18n.resolvedLanguage])

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!lng || i18n.resolvedLanguage === lng) {
      return;
    }
    i18n.changeLanguage(lng);
  }, [lng, i18n])

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (cookies.i18next === lng) {
      return;
    }
    setCookie(cookieName, lng, { path: '/' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lng, cookies.i18next])

  return ret;
}