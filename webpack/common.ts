import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin';
import ReactRefreshTypeScript from 'react-refresh-typescript';
import webpack from 'webpack';
import { InjectManifest } from 'workbox-webpack-plugin';

import { cdnPaths, externals } from './cdn';

require('dotenv').config({ path: path.resolve(__dirname, '../env/.env') });

const appEnvironments = ['NODE_ENV', 'REACT_APP_ACHEMY_KEY', 'REACT_APP_INFURA_KEY', 'ROOT_URL'];
const environment = process.env.NODE_ENV ?? 'development';
const gtagId = process.env.GTAG_ID;

export default {
  mode: environment,
  externals,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            allowTsInNodeModules: true,
            configFile: path.resolve(__dirname, '../tsconfig.json'),
            getCustomTransformers: () => ({
              before: environment === 'development' ? [ReactRefreshTypeScript()] : [],
            }),
          },
        },
      },
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
        exclude: /node_modules/,
      },
      {
        test: /\.(css)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack', 'url-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf)($|\?)/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(jp?g|png|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.ejs',
      cdnPaths,
      gtagId,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new InjectManifest({
      compileSrc: true,
      swSrc: './src/service-worker.ts',
    }),
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
      PUBLIC_URL: './public',
      NODE_ENV: environment,
    }),
    new webpack.EnvironmentPlugin(...appEnvironments),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
  ],
  resolve: {
    alias: {
      '@mattjennings/react-modal': path.resolve(__dirname, '../node_modules/@mattjennings/react-modal'),
      crypto: require.resolve('crypto-browserify'),
      http: false,
      https: false,
      os: false,
      stream: require.resolve('stream-browserify'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  performance: {
    hints: 'warning',
  },
};
