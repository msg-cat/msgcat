{
  entry: ['src/msgcat.js'],
  output: 'build/msgcat.js',
  module: {
    loaders: [
      {
        include: 'src/',
        test: /\.jsx?$/,
        loaders: ['babel']
      }
    ]
  }
}
