const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");
const nodeExternals = require('webpack-node-externals');
 
module.exports = {
  entry: {
    main: './app.js'
  },
  output: {
    path: path.join(__dirname,'prod-build'),
    publicPath: '/',
    filename: '[name].js',
    clean: true
  },
  mode: 'production',
  target: 'node',
  externals: [nodeExternals()],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        compress: {
          drop_console: true
        }
      }
    })]
  },
  module:{
    rules:[
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      }
    ]
  }
}