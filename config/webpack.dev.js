/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const common = require("./webpack.common.js");
const devServerConfig = require("./webpack.server");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  plugins: [new MiniCssExtractPlugin()],
  stats: {
    colors: true,
    chunks: true,
    children: false,
    performance: true
  },
  devServer: devServerConfig
});
