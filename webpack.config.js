module.exports = {
  context: __dirname,
  entry: "./frontend/entry.js",
  output: {
    path: "./",
    filename: "bundle.js",
  },
  devtool: 'source-maps',
  resolve: {
    extensions: ["", ".js", ".jsx" ]
  }
};
