/* eslint-disable import/no-extraneous-dependencies */
// const autoprefixer = require('autoprefixer');
const path = require('path');

const webpack = require('webpack');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
// const HandlebarsPlugin = require('handlebars-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');

// This is the development configuration.
// It is focused on developer experience and fast rebuilds.
// The production configuration is different and lives in a separate file.
// noinspection WebpackConfigHighlighting
module.exports = {
  /* mode: debug ? 'development' : 'production', */
  mode: 'development',
  // You may want 'eval' instead if you prefer to see the compiled output in DevTools.
  // See the discussion in https://github.com/facebookincubator/create-react-app/issues/343.
  devtool: 'source-map',
  // These are the "entry points" to our application.
  // This means they will be the "root" imports that are included in JS bundle.
  // The first two entry points enable "hot" CSS and auto-refreshes for JS.
  entry: [
    './src/index',
    // We include the app code last so that if there is a runtime error during
    // initialization, it doesn't blow up the WebpackDevServer client, and
    // changing JS code would still trigger a refresh.
  ],
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    // This allows you to set a fallback for where Webpack should look for modules.
    // We read `NODE_PATH` environment variable in `paths.js` and pass paths here.
    // We use `fallback` instead of `root` because we want `node_modules` to "win"
    // if there any conflicts. This matches Node resolution mechanism.
    // https://github.com/facebookincubator/create-react-app/issues/253
    // modules: paths.nodePaths,
    // These are the reasonable defaults supported by the Node ecosystem.
    // We also include JSX as a common component filename extension to support
    // some tools, although we do not recommend using it, see:
    // https://github.com/facebookincubator/create-react-app/issues/290
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      // Support React Native Web
      // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
      'react-native': 'react-native-web',
    },
  },

  module: {
    rules: [
      // Process JS with Babel.
      {
        test: /\.(js|jsx)$/,
        include: path.join(__dirname, './src'),
        loader: 'babel-loader',
        options: {
          presets: ['env'],
        },
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
      },
      /* {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true },
          },
        ],
      }, */
      // "css" loader resolves paths in CSS and adds assets as dependencies.
      // "style" loader turns CSS into JS modules that inject <style> tags.
      // In production, we use a plugin to extract that CSS to a file, but
      // in development "style" loader enables hot editing of CSS.
      /* {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }, */
      {
        rules: [
          {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: 'css-loader',
            }),
          },
        ],
      },
      // loader for images, fonts, file
      {
        test: /\.(jpe?g|png|gif|svg|ttf|eot|woff(2)?)$/,
        use: [
          {
            loader: 'url-loader',
            options: { limit: 40000 },
          },
          'image-webpack-loader',
        ],
      },
    ],
  },

  plugins: [
    new ExtractTextPlugin('styles.css'),
    // Makes the public URL available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In development, this will be an empty string.
    // Generates an `index.html` file with the <script> injected.
    /* new HtmlWebpackPlugin({
      inject: true,
      template: path.join(__dirname, './views/layout.hbs'),
    }), */
    /* new HtmlWebpackPlugin({
      inject: true,
      template: path.join(__dirname, './views/index.html'),
    }), */
    /* new HandlebarsPlugin({
      // path to hbs entry file(s)
      entry: path.join(__dirname, './views/layout.hbs'),
    }), */
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(false),
    }),
    // This is necessary to emit hot updates (currently CSS only):
    new webpack.HotModuleReplacementPlugin(),
    // Watcher doesn't work well if you mistype casing in a path so we use
    // a plugin that prints an error when you attempt to do this.
    // See https://github.com/facebookincubator/create-react-app/issues/240
    new CaseSensitivePathsPlugin(),
    new ServiceWorkerWebpackPlugin({
      entry: path.join(__dirname, './src/sw/sw.js'),
    }),
  ],
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};
