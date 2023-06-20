/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const config = {
  hot: true,
  compress: true,
  historyApiFallback: {
    disableDotRule: true,
  },
  static: {
    publicPath: '/',
  },
  port: 8080,
  headers: {
    'Access-Control-Allow-Origin': 'localhost:8081'
  },
  allowedHosts: [
    'localhost'
    // 'vdc01-deintkd01.com' // дев стенд КРОКа    
  ],
}

module.exports = config;
