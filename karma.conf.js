var path = require('path')

var lunchers = {
  sl_firefox_45: {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: 45,
  },
  sl_chrome_48: {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: 48,
  },
}

module.exports = function (config) {
  config.set({
    basePath: path.resolve(__dirname),
    frameworks: ['mocha', 'chai', 'sinon'],
    files: ['specs/loader.js'],
    exclude: [],
    preprocessors: {
      'specs/loader.js': ['webpack', 'sourcemap'],
    },
    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          {
            test: /\.js/,
            include: [
              path.resolve(__dirname),
            ],
            loader: 'babel',
          },
        ],
      },
    },
    sauceLabs: {
      testName: 'elixir.js',
    },
    captureTimeout: 120000,
    customLaunchers: lunchers,
    browsers: Object.keys(lunchers),
    reporters: ['dots', 'saucelabs'],
    singleRun: true,
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
  })
}
