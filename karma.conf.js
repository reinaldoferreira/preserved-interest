const path = require('path'),
webpack = require('webpack'),
glob = require('glob');

let webpackConfig = require('./webpack.config.js');
webpackConfig.devtool = 'inline-source-map';

module.exports = function (config) {
  config.set({
    browsers: [ 'PhantomJS' ], //run in Chrome
    singleRun: true, //just run once by default
    frameworks: [ 'mocha', 'chai' ], //use the mocha test framework
    files: [
      './src/js/**/*.test.js'
    ],
    plugins: [
      'karma-chrome-launcher',
      'karma-chai',
      'karma-mocha',
      'karma-sourcemap-loader',
      'karma-webpack',
      'karma-phantomjs-launcher'
    ],
    preprocessors: {
      './src/js/**/*.test.js': [ 'webpack', 'sourcemap' ] //preprocess with webpack and our sourcemap loader
    },
    reporters: [ 'dots' ], //report results in this format
    webpack: webpackConfig,
    webpackServer: {
      noInfo: true //please don't spam the console when running in karma!
    }
  });
};
