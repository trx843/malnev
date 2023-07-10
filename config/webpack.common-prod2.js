/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve, join } = require("path");
const { DefinePlugin } = require("webpack");
const CleanCSSPlugin = require("less-plugin-clean-css");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");

const getClientEnvironment = require("./env");

const paths = require("./paths");

//const DIST = resolve(__dirname, "..", "dist");
//const DIST = 'C:/TKO_Web/TkoWebApp';
const DIST = '\\\\VDC01-PEBKEKPN2\\c$\\TKO_Web\\TkoWebApp';

const ENTRY_PATH = resolve(__dirname, "..", "src/index.tsx");
const ENTRY_HTML_FILE = resolve(__dirname, "..", "public/index.html");

const isDevelopment = process.env.NODE_ENV === "development";
const PUBLIC_PATH = isDevelopment
  ? process.env.REACT_APP_PUBLIC_URL_DEV
  : process.env.REACT_APP_PUBLIC_URL_PROD;
const env = getClientEnvironment(PUBLIC_PATH);

module.exports = {
  target: "web",
  entry: {
    index: ["react-hot-loader/patch", ENTRY_PATH]
  },
  output: {
    path: DIST,
    filename: isDevelopment ? "[name].bundle.js" : "[contenthash:8].bundle.js",
    chunkFilename: isDevelopment
      ? 'chunk-[name].js'
      : 'chunk-[name].[contenthash].js',
    publicPath: PUBLIC_PATH,
    pathinfo: true
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx", ".css"],
    alias: {
      components: paths.components,
      pages: paths.pages,
      containers: paths.containers,
      api: paths.api,
      thunks: paths.thunks,
      slices: paths.slices,
      src: paths.src,
      types: paths.types,
      ...paths,
      ...(isDevelopment ? { "react-dom": "@hot-loader/react-dom" } : undefined)
    },
    modules: [join(__dirname, "src"), "node_modules"]
  },
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(ts|js)x?$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader"
          },
          {
            loader: "ts-loader"
          }
        ]
      },
      {
        test: /\.less$/,
        include: /node_modules/,
        use: [
          {
            loader: !isDevelopment
              ? MiniCssExtractPlugin.loader
              : "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              hmr: isDevelopment,
              modules: {
                localIdentName: "[name]-[local]_[hash:base64:5]"
              },														
              sourceMap: isDevelopment
            }
          },
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                sourceMap: isDevelopment,
                javascriptEnabled: true,
                plugins: [new CleanCSSPlugin({ advanced: true })]
              }
            }
          }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        type: "asset/resource"
      },
      {
        test: /\.module\.css$/,
        use: [
          !isDevelopment ? MiniCssExtractPlugin.loader : "style-loader",

          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: "[name]-[local]_[hash:base64:5]"
              },														
              sourceMap: isDevelopment
            }
          }
        ]
      },
      // лоадер для обычного css, нейминг файла со стилями должен соответствовать [name].css
      {
        test: /(?<!\.module)\.css$/,
        use: [
          !isDevelopment ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader"
        ]
      },
      // лоадер для less модулей, нейминг файла со стилями должен соответствовать [name].module.less
      {
        test: /\.module\.less$/,
        use: [
          !isDevelopment ? MiniCssExtractPlugin.loader : "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: "[name]-[local]_[hash:base64:5]"
              }
            }
          },
          {
            loader: "postcss-loader",
            options: {
              postcssoptions: {
                ident: "postcss",
                plugins: [require("postcss-nested")]
              }
            }
          },
          "less-loader"
        ]
      },
      // лоадер для обычного less, нейминг файла со стилями должен соответствовать [name].less
      {
        test: /(?<!\.module)\.less$/,
        use: [
          !isDevelopment ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "less-loader"
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: ["file-loader"]
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "babel-loader"
          },
          {
            loader: "@svgr/webpack",
            options: {
              babel: false,
              icon: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new DefinePlugin(env.stringified),
    new HtmlWebpackPlugin({
      filename: "index.html",
      title: "Портал МКО ТКО",
      templateParameters: {
        PUBLIC_URL: !isDevelopment
          ? process.env.REACT_APP_PUBLIC_URL_PROD
          : process.env.REACT_APP_PUBLIC_URL_DEV
      },
      chunks: ["vendor", "index"],
      chunksSortMode: "manual",
      template: ENTRY_HTML_FILE,
      favicon: resolve(__dirname, "..", "public/fav.ico")
    }),
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw)
  ]
};
