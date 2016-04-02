module.exports = {
  entry: './src/msgcat.js',
  output: {
    filename: './build/msgcat.js',
  },
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        test: /\.jsx?$/,
        loader: 'babel-loader'
      }
    ]
  }
}
