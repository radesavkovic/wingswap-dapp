import dayjs from 'dayjs';
import i18n from 'i18next';
import numbro from 'numbro';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  ns: ['landing', 'app'],
  defaultNS: 'app',
  nsSeparator: ':',
  resources: {
    en: {
      app: require('./assets/locales/en/app.json'),
      error: require('./assets/locales/en/error.json'),
      landing: require('./assets/locales/en/landing.json'),
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
    format: function (value, format, lng) {
      if (typeof value === 'number' && format === 'count') return numbro(value).format({ thousandSeparated: true });
      if (format === 'uppercase') return value.toUpperCase();
      if (value instanceof Date && !!format) return dayjs(value).format(format);
      return value;
    },
  },
});
