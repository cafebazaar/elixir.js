var resolve = require('path').resolve

function path (file) {
  return resolve(__dirname, file)
}

module.exports = {
  devtool: 'source-map',

  entry: [path('es6/index.js')],

  output: {
    path: path('dist'),
    filename: 'ex.js',
    library: 'Ex',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [path('es6')],
        loader: 'babel',
      },
    ],
  },
}

