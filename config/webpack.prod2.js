/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { merge } = require("webpack-merge");
const { ids, ContextReplacementPlugin } = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BrotliPlugin = require("brotli-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const common = require("./webpack.common-prod2.js");

module.exports = merge(common, {
  mode: "production",
  devtool: false,
  bail: true,
  plugins: [
    new CleanWebpackPlugin(),
    new ids.HashedModuleIdsPlugin({
      hashFunction: "md4",
      hashDigest: "base64",
      hashDigestLength: 4
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new ContextReplacementPlugin(/moment[/\\]locale$/, /ru|en-gb/),
    new BrotliPlugin({
      asset: "[path].br[query]",
      test: /\.(js|csshtml|svg|woff2)$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        exclude: "/public/",
        terserOptions: {
          parse: {
            // we want terser to parse ecma 8 code. However, we don't want it
            // to apply any minfication steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending futher investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2
          },
          mangle: {
            safari10: true
          },
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true
          }
        },
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        parallel: true
      })
    ],
    splitChunks: {
      chunks: "all",
      minChunks: 1,
      cacheGroups: {
        default: false,
        vendors: {
          test: /node_modules\/(?!antd|ag-grid-community|ag-grid-react|formik-antd|highcharts-react-official|react-bootstrap\/).*/,
          name: "vendors",
          chunks: "all"
        },
        antd: {
          test: /node_modules\/(antd\/).*/,
          name: "antd",
          chunks: "all"
        },
        "ag-grid-community": {
          test: /node_modules\/(ag-grid-community\/).*/,
          name: "ag-grid-community",
          chunks: "all"
        },
        "ag-grid-react": {
          test: /node_modules\/(ag-grid-react\/).*/,
          name: "ag-grid-react",
          chunks: "all"
        },
        "formik-antd": {
          test: /node_modules\/(formik-antd\/).*/,
          name: "formik-antd",
          chunks: "all"
        },
        "highcharts-react-official": {
          test: /node_modules\/(highcharts-react-official\/).*/,
          name: "highcharts-react-official",
          chunks: "all"
        },
        "react-bootstrap": {
          test: /node_modules\/(react-bootstrap\/).*/,
          name: "react-bootstrap",
          chunks: "all"
        },
        // vendor: {
        //   // name of the chunk
        //   name: 'vendor',

        //   // async + async chunks
        //   chunks: 'all',

        //   // import file path containing node_modules
        //   test: /node_modules/,

        //   // priority
        //   priority: 20,
        // },

        // common chunk
        common: {
          name: "common",
          minChunks: 2,
          chunks: "all",
          priority: 10,
          reuseExistingChunk: true,
          enforce: true
        }
      }
    }
  }
});
