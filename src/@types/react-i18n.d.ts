import 'react-i18next';

declare module 'react-i18next' {
  export interface Resources {
    app: typeof import('../assets/locales/en/app.json');
    error: typeof import('../assets/locales/en/error.json');
    landing: typeof import('../assets/locales/en/landing.json');
  }
}
