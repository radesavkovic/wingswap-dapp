import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import { resolve } from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import { merge } from 'webpack-merge';

import commonConfig from './common';

export default (merge as any)(commonConfig, {
  entry: './src/index.tsx',
  output: {
    filename: 'js/[name].[fullhash].min.js',
    path: resolve(__dirname, '../build'),
    publicPath: './',
  },
  devtool: false,
  plugins: [
    new CleanWebpackPlugin(),
    new CompressionPlugin(),
    new CopyPlugin({
      patterns: [
        // { from: 'public/fonts', to: './public/fonts' },
        { from: 'public/images', to: './public/images' },
        { from: 'public/_redirects', to: '.' },
        { from: 'public/favicon.ico', to: '.' },
        { from: 'public/robot.txt', to: '.' },
        { from: 'public/site.webmanifest', to: './public/site.webmanifest' },
      ],
    }),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: true,
          mangle: true,
          sourceMap: false,
        },
        extractComments: true,
      }),
    ],
    splitChunks: {
      chunks: 'async',
      minChunks: 2,
    },
  },
});
