const path = require('path');
const { ProvidePlugin } = require('webpack');

const config = {
  mode: 'production',
  entry: './lib/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins:[
    new ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
  resolve: {
    fallback: {
      'assert': require.resolve('assert'),
      'https': require.resolve('https-browserify'),
      'http': require.resolve('stream-http'),
      'stream': require.resolve('stream-browserify'),
      'crypto': require.resolve('crypto-browserify'),
      'path': require.resolve('path-browserify'),
      'os': require.resolve('os-browserify/browser'),
      'buffer': require.resolve('buffer'),
      'url': require.resolve('url'),
    },
    extensions: ['.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'ImageSize',
    libraryTarget: 'window',
    libraryExport: 'default',
  },
};

module.exports = (env, {mode}) => {
  if (mode === 'development') {
    Object.assign(config, {
      mode,
      devtool: 'source-map',
      devServer: {
        port: 9000,
        static: './dist',
      },
    });
  }

  return config;
};
