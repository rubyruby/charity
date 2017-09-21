var webpack = require('webpack');
var _ = require('lodash');
const path = require('path');

const defaultConfig = require('./config/default');
const productionConfig = require('./config/production');

function composeConfig(env) {
  if (!env || env === 'development') {
    return defaultConfig;
  } else {
    return _.merge({}, defaultConfig, productionConfig);
  }
}

module.exports = {
   entry: path.resolve(__dirname, 'src', 'index.jsx'),
   output: {
      path: path.join(__dirname, '/docs'),
      filename: 'bundle.js',
      publicPath: '/',
   },
   resolve: {
      extensions: ['.js', '.jsx']
   },
   module: {
      rules: [
         {
             test: /\.jsx/,
             use: {
                loader: 'babel-loader',
                options: { presets: ['react', 'es2015', 'stage-2'] }
             }
         },
         {
           test: /\.js$/,
           use: {
             loader: 'babel-loader',
             options: { presets: ['react', 'es2015', 'stage-2'] }
           },
           exclude: [/node_modules/]
         },
         {
            test: /\.css|\.scss/,
            use: ['style-loader', 'css-loader', 'sass-loader']
         },
         {
            test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
            loader: 'url-loader'
         }
      ]
   },
   devServer: {
     contentBase: './docs',
     publicPath: '/',
     disableHostCheck: true
  },
  plugins: process.env.NODE_ENV === 'production' ? [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        },
        'process.config': JSON.stringify(composeConfig(process.env.NODE_ENV))
    }),
    new webpack.optimize.UglifyJsPlugin({
        mangle: {
            except: ['BigNumber']
        }
    })
  ] : [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new webpack.DefinePlugin({
        'process.config': JSON.stringify(composeConfig(process.env.NODE_ENV))
    })
  ],
};
