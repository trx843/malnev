/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const fs = require('fs')
const url = require('url')

const envPublicUrl = process.env.PUBLIC_URL

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)

function ensureSlash(inputPath, needsSlash) {
  const hasSlash = inputPath.endsWith('/')
  if (hasSlash && !needsSlash) {
    return inputPath.slice(0, -1)
  }
  if (!hasSlash && needsSlash) {
    return `${inputPath}/`
  }
  return inputPath
}

const getPublicUrl = (appPackageJson) =>
  envPublicUrl || require(appPackageJson).homepage

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app i served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson)
  const servedUrl =
    envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/')
  return ensureSlash(servedUrl, true)
}
const paths = {
  dotenv: resolveApp('.env'),
  publicPath: '/static/',
  thunks: resolveApp('src/thunks'),
  components: resolveApp('src/components'),
  containers: resolveApp('src/containers'),
  pages: resolveApp('src/pages'),
  api: resolveApp('src/api'),
  types: resolveApp('src/types'),
  src: resolveApp('src'),
  slices: resolveApp('src/slices'),
  assets: resolveApp('public/assets'),
  templates: resolveApp('src/templates'),
  customHooks: resolveApp('src/customHooks'),
  casl: resolveApp('src/casl'),
  actions: resolveApp('src/actions'),
  utils: resolveApp('src/utils'),
  enums: resolveApp('src/enums'),
  constants: resolveApp('src/constants'),
  servedPath: getServedPath(resolveApp('package.json')),
}

paths.resolveModules = [paths.src, 'node_modules']

module.exports = paths
