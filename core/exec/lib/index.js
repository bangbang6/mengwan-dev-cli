'use strict'
const Package = require('@mengwan-dev-cli/package')

module.exports = exec

/** 动态创建init命令 */
function exec() {
  console.log('process.env.CLI_', process.env.CLI_HOME_PATH)
  console.log('process.env.TARGET_PATH', process.env.TARGET_PATH)
  const pkg = new Package()
}
