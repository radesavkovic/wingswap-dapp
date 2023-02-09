import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { merge } from 'webpack-merge';

import commonConfig from './common';

export default (merge as any)(commonConfig, {
  entry: './src/index.tsx',
  devServer: {
    hot: true,
    host: '0.0.0.0',
    allowedHosts: 'all',
    port: 8092,
    historyApiFallback: true,
    client: {
      overlay: false,
    },
  },
  output: {
    publicPath: '/',
  },
  devtool: 'eval-cheap-source-map',
  plugins: [new ReactRefreshWebpackPlugin(), new ForkTsCheckerWebpackPlugin()],
});
