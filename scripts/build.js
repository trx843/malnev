const shell = require('shelljs');


if (shell.exec('cross-env NODE_ENV=production webpack --mode production --config ./config/webpack.prod.js').code !== 0) {
  shell.exit(1);
}

shell.cp('-R', 'public/config.js', 'dist/');
