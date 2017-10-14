// NOTE: To use this example standalone (e.g. outside of deck.gl repo)
// delete the local development overrides at the bottom of this file

// avoid destructuring for older Node version support
const resolve = require('path').resolve;
const webpack = require('webpack');

const CONFIG = {
  entry: {
    app: resolve('./app.js')
  },

  devtool: 'source-map',

  module: {
    rules: [ //{ test: /\.json$/, loader: 'json' },
    {
      // Compile ES2015 using buble
      test: /\.js$/,
      loader: 'buble-loader',
      include: [resolve('.')],
      exclude: [/node_modules/],
      options: {
        objectAssign: 'Object.assign'
      }
    }]
  },

  resolve: {
    alias: {
      // From mapbox-gl-js README. Required for non-browserify bundlers (e.g. webpack):
      'mapbox-gl$': resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js')
    }
  },

  // Optional: Enables reading mapbox token from environment variable
  plugins: [
    new webpack.EnvironmentPlugin({MapboxAccessToken:
    'pk.eyJ1IjoiY2VjZTE5IiwiYSI6ImNpaHBvNTBnZjA0NHZ0Nm00bGJoMDAxdDkifQ.Nj2-Tx6bRcpoliPuSqAGHw'})
  ]
};

// This line enables bundling against src in this repo rather than installed deck.gl module
module.exports = env => env ? require('../webpack.config.local')(CONFIG)(env) : CONFIG;
