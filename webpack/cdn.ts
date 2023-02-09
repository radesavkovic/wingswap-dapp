const { dependencies } = require('../package.json');

const environment = process.env.NODE_ENV || 'development';

const { cdnPaths, externals } = (function () {
  if (environment !== 'production')
    return {
      cdnPaths: [],
      externals: {},
    };

  return {
    cdnPaths: [
      `https://unpkg.com/react@${dependencies['react']}/umd/react.production.min.js`,
      `https://unpkg.com/react-dom@${dependencies['react-dom']}/umd/react-dom.production.min.js`,
      `https://unpkg.com/i18next@${dependencies['i18next']}/dist/umd/i18next.min.js`,
      `https://unpkg.com/react-i18next@${dependencies['react-i18next']}/react-i18next.min.js`,
    ],
    externals: {
      i18next: 'i18next',
      react: 'React',
      'react-dom': 'ReactDOM',
      'react-i18next': 'ReactI18next',
    },
  };
})();

export { cdnPaths, externals };
