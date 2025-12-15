import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import commonEN from './locales/en/common.json';
import pagesEN from './locales/en/pages.json';
import formsEN from './locales/en/forms.json';
import legalEN from './locales/en/legal.json';

import commonES from './locales/es/common.json';
import pagesES from './locales/es/pages.json';
import formsES from './locales/es/forms.json';
import legalES from './locales/es/legal.json';

import commonFR from './locales/fr/common.json';
import pagesFR from './locales/fr/pages.json';
import formsFR from './locales/fr/forms.json';
import legalFR from './locales/fr/legal.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: commonEN,
        pages: pagesEN,
        forms: formsEN,
        legal: legalEN,
      },
      es: {
        common: commonES,
        pages: pagesES,
        forms: formsES,
        legal: legalES,
      },
      fr: {
        common: commonFR,
        pages: pagesFR,
        forms: formsFR,
        legal: legalFR,
      },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'es', 'fr'],
    defaultNS: 'common',
    ns: ['common', 'pages', 'forms', 'legal'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: {
      escapeValue: false, // React already escapes
    },
  });

export default i18n;
