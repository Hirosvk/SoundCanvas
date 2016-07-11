module.exports = {
  context: __dirname,
  entry: "./frontend/entry.js",
  output: {
    path: "./frontend",
    filename: "bundle.js",
  },
  devtool: 'source-maps',
  resolve: {
    extensions: ["", ".js", ".jsx" ]
  }
};
