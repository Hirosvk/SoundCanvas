module.exports = {
  context: __dirname,
  entry: "./frontend/entry.js",
  output: {
    path: "./app/assets/javascripts",
    filename: "bundle.js",
  },
  devtool: 'source-maps',
  resolve: {
    extensions: ["", ".js", ".jsx" ]
  },
  module: {
    loaders: [
      {
        test: [/\.jsx?$/, /\.js?$/],
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
};
