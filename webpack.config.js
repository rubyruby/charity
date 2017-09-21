var webpack = require('webpack');

const path = require('path');

module.exports = {
   entry: path.resolve(__dirname, 'src', 'index.jsx'),
   output: {
      path: path.join(__dirname, '/public'),
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
     contentBase: './public',
     publicPath: '/',
     disableHostCheck: true
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
};
