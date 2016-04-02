var path = require('path');

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],

    // proxies: {
    //   '/base/themes/modern/theme.js': 'http://localhost:9876/base/node_modules/tinymce/themes/modern/theme.js',
    // },

    // list of files / patterns to load in the browser
    files: [
      {
        pattern: path.resolve(__dirname, 'node_modules/tinymce/tinymce.js'),
        served: true,
        included: true,
        watched: false,
      },
      {
        pattern: path.resolve(__dirname, 'node_modules/tinymce/themes/modern/theme.js'),
        served: true,
        included: true,
        watched: false,
      },

      'karma.index.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'karma.index.js': [ 'webpack', 'sourcemap' ],
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    client: {
      captureConsole: true,

      mocha: {
        reporter: 'html', // change Karma's debug.html to the mocha web reporter
        ui: 'bdd',
        timeout: 2000
      }
    },

    webpack: omit(require('./webpack.config.js'), [ 'entry', 'output' ]),
    webpackMiddleware: {
      noInfo: !process.env.VERBOSE
    }
  })
}

function omit(x, keys) {
  return Object.keys(x).reduce(function(out, key) {
    if (keys.indexOf(key) === -1) {
      out[key] = x[key];
    }

    return out;
  }, {});
}