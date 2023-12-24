'use strict'
const Package = require('@mengwan-dev-cli/package')

module.exports = exec

const SETTINGS = {
  init: '@mengwan-dev-cli/init',
}

/** 动态创建init命令 */
function exec() {
  const name = arguments[0]
  const pkg = new Package({
    targetPath: process.env.TARGET_PATH,
    name: SETTINGS[name],
    version: 'latest',
  })
  console.log('pkg', pkg)
}
