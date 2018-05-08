var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

var walkSync = function(dir, filelist) {
  var fs = fs || require('fs'),
    files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      filelist = walkSync(dir + '/' + file + '/', filelist);
    }
    else {
      filelist.push(file);
    }
  });
  return filelist;
};
var dev = process.env.NODE_ENV == 'development' ? true : false;
var pagesNames = walkSync('./app/pages');
pages = pagesNames.map(function(pageName) {
  return new HtmlWebpackPlugin({
    filename: pageName.replace("jade", "html"),
    template: 'app/pages/' + pageName
  });
});

var config = {
  entry: './app/index.js',
  watch: true,//dev,
  watchOptions: { aggregateTimeout: 100 },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'eslint-loader!babel?presets[]=es2015' },
      { test: /\.jade$/, loader: 'jade' },
      { test: /\.(png|jpg|svg|ttf|eot|woff|woff2|gif)$/, loader: 'file?name=resources/[name].[ext]' },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("style", dev ? "css!autoprefixer?browsers=last 2 versions!sass" : "css?minimize!autoprefixer?browsers=last 2 versions!sass")
      },
      {
        test: /\.less/,
        loader: ExtractTextPlugin.extract("style", dev ? "css!autoprefixer?browsers=last 2 versions!less" : "css?minimize!autoprefixer?browsers=last 2 versions!less")
      },
      {
        test: /\.css/,
        loader: ExtractTextPlugin.extract("style", dev ? "css!autoprefixer?browsers=last 2 versions" : "css?minimize!autoprefixer?browsers=last 2 versions")
      }
    ]
  },
  sassLoader: {
    includePaths: [path.resolve(__dirname, "./app/styles/scss")]
  },
  jade: {
    pretty: false
  },
  output: {
    path: 'dist',
    filename: 'index.js'
  },
  plugins: pages.concat(
    [new webpack.EnvironmentPlugin("NODE_ENV"),
      new ExtractTextPlugin("styles.css"),
      new CleanWebpackPlugin(['dist'], { root: '', verbose: false, dry: false })])
};

if (!dev) {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }))
}

module.exports = config;
