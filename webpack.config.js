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
  }
};
