var path = require('path')

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
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS', 'Chromium', 'Firefox'],
    concurrency: Infinity,
  })
}
