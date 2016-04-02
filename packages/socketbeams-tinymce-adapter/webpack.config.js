var path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'lib/plugin.js'),
  devtool: 'eval',

  output: {
    filename: 'tinymce-socketbeams-plugin.js',
    path: path.resolve(__dirname, 'dist')
  },

  resolve: {
    alias: {
      sinon: path.resolve(__dirname, 'vendor/sinonShim.js')
    },
  },

  module: {
    noParse: /sinon\.js/,
    loader: [
      {
        test: /\.js$/,
        loader: 'babel?presets[]=es2015',
        include: [ path.resolve(__dirname, 'lib') ]
      },
    ],
  }
};