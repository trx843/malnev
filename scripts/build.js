const shell = require('shelljs');

if (shell.exec('cross-env NODE_ENV=production webpack --mode production --config ./config/webpack.prod.js').code !== 0) {
  shell.exit(1);
}

// shell.cp('-R', 'public/config.js', 'C:/TKO_Web/TkoWebApp/');
shell.cp('-R', 'public/config.js', '\\\\VDC01-PEBKEKTN1\\c$\\TKO_Web\\TkoWebApp');