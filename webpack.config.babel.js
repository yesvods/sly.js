import webpack from 'webpack'
import path from 'path'

module.exports = {
  entry: {
    bundle: [
      './client/index.js',
    ]
  },
  output: {
    path: path.join(__dirname, 'lib/client'),
    filename: 'bundle.js',
    publicPath: `/static/`,
  },
  resolve: {
    extensions: ["", ".js", ".jsx", ".json"],
    modulesDirectories: [
      'node_modules',
    ]
  },
  devtool: "eval",
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel'
      },
      { test: /\.css$/, loader: 'style!css' },
    ]
  },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //       warnings: false
    //     }
    // }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ]
}
