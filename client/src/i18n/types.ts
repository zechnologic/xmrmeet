import 'react-i18next';
import common from './locales/en/common.json';
import pages from './locales/en/pages.json';
import forms from './locales/en/forms.json';
import legal from './locales/en/legal.json';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
      pages: typeof pages;
      forms: typeof forms;
      legal: typeof legal;
    };
  }
}
