const webpack = require('webpack');
const path = require('path');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  entry: {
    main: [
      'webpack-hot-middleware/client',
      path.resolve(__dirname, './client/src/index.js'),
    ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
    // publicPath: '/dist/',
    publicPath: '/'
    // libraryTarget: 'var',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      {
        test: /\.gif$/,
        loader: "url-loader?mimetype=image/png"
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&minetype=application/font-woff"
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader?name=[name].[ext]"
      }
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
    // new CleanWebpackPlugin(),
    // new CopyWebpackPlugin([
    //   {
    //     from: path.resolve(__dirname, './client/public'),
    //     to: path.resolve(__dirname, './dist', 'public'),
    //   },
    // ], {}),
  ],
};