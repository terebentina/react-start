const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const atImport = require('postcss-import');
const postcssUrl = require('postcss-url');
const discardComments = require('postcss-discard-comments');
const advancedVariables = require('postcss-advanced-variables');
const flexbugsFixes = require('postcss-flexbugs-fixes');
const nested = require('postcss-nested');
const reporter = require('postcss-reporter');

const babelQuery = {
  presets: ['es2015', 'stage-0', 'react', 'react-hmre'],
};

module.exports = {
  context: __dirname,
  entry: [path.resolve('./src/index.js'), 'webpack-hot-middleware/client'],
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
    publicPath: '/build',
    pathinfo: true,
    sourceMapFilename: '[name].map',
  },
  target: 'web',
  devtool: 'cheap-module-eval-source-map',
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel', exclude: [/node_modules/, path.resolve(__dirname, './build')], query: babelQuery },
      { test: /\.css$/, loader: 'style!css?sourceMap&modules&importLoaders=1&localIdentName=[local]-[hash:base64:5]!postcss' },
    ],
  },
  postcss: [
    atImport(), postcssUrl(),

    // Discard comments in your CSS files with PostCSS.
    // https://github.com/ben-eb/postcss-discard-comments
    // Remove all comments... we don't need them further down the line
    // which improves performance (reduces number of AST nodes)
    discardComments({
      removeAll: true,
    }),

    // PostCSS plugin for Sass-like variables, conditionals, and iteratives
    // Supports local variables + @for/@each inspired by Sass
    // https://github.com/jonathantneal/postcss-advanced-variables
    advancedVariables({
      variables: {},
    }),

    // Tries to fix all of flexbug's issues
    // https://github.com/luisrudge/postcss-flexbugs-fixes
    flexbugsFixes,

    // Unwrap nested rules like how Sass does it.
    // https://github.com/postcss/postcss-nested
    nested,

    // Log PostCSS messages to the console
    reporter({
      clearMessages: true,
    }),
  ],
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'My app',
      appMountId: 'root',
    }),
  ],
};
