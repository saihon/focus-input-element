const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
  devtool: false,
  mode: "development",
  entry: {
    contentScript: path.resolve(__dirname, "src/ts/contentScript.ts"),
    options: path.resolve(__dirname, "src/ts/options.ts"),
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: { url: false },
          },
        ],
      },
    ],
  },

  resolve: {
    extensions: [".ts", ".js"],
  },

  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist/js"),
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "manifest-firefox.json",
          to: "../manifest.json",
          force: true,
          context: path.resolve(__dirname, "src"),
        },
        {
          from: "*.html",
          to: "../",
          force: true,
          context: path.resolve(__dirname, "src"),
        },
        {
          from: "icons",
          to: "../icons",
          context: path.resolve(__dirname, "src"),
        },
      ],
    }),
  ],
};
