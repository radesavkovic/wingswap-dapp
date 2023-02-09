import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { merge } from 'webpack-merge';

import commonConfig from './common';
import { concat } from './utils';

process.env.ROOT_URL = '';

export default (merge as any)(commonConfig, {
  entry: './src/index.tsx',
  output: {
    publicPath: './',
  },
  plugins: concat(new BundleAnalyzerPlugin()),
});
