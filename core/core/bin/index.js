const pkg = require('../package.json')
const log = require('@mengwan-dev-cli/log')
const npmInfo = require('@mengwan-dev-cli/get-npm-info')
const semver = require('semver')
const colors = require('colors') // 打印在控制台的字符串样式
const userHome = require('user-home')
const pathExists = require('path-exists')
const minimist = require('minimist')
const path = require('path')
const commander = require('commander')

const program = new commander.Command()
const { LOWEAST_NODE_VERSION, CLI_HOME_PATH } = require('./const')

let args, config
const core = async () => {
  try {
    checkVersion()
    checkNodeVersion()
    checkRoot()
    checkUserHome()
    checkInputArgs()
    checkEnv()
    program
      .name(Object.keys(pkg.bin)[0])
      .usage('<command> [options]')
      .version(pkg.version)
      .option('-d, --debug', '是否开启调试模式', false)
      .option('-e, --envName <envName>', '获取环境变量名称')
      .parse(process.argv)
    const options = program.opts()
    await checkGlobalUpdate()
  } catch (e) {
    log.error(e.message)
  }
}
module.exports = core

function checkVersion() {
  log.notice('当前版本号', pkg.version)
}

function checkNodeVersion() {
  const currentVersion = process.version
  if (!semver.gte(currentVersion, LOWEAST_NODE_VERSION)) {
    throw new Error(`mw-cli 需要安装${LOWEAST_NODE_VERSION}以上版本`.rainbow)
  }
}

function checkRoot() {
  const rootCheck = require('root-check')
  rootCheck() //自动降低root账户 避免拥护使用cli时候权限高保存文件 权限出问题
  //如果一个文件是root账户创建的，那么普通用户是无法操作的，所以会报错各种权限问题
}

function checkUserHome() {
  if (!userHome || !pathExists(userHome)) {
    throw new Error('当前登录用户主目录不存在'.red)
  }
}

function checkInputArgs() {
  args = minimist(process.argv.slice(2))
  checkIsDebug()
}

function checkIsDebug() {
  if (args.debug) {
    process.env.LOG_LEVEL = 'verbose'
  } else {
    process.env.LOG_LEVEL = 'info'
  }
  log.level = process.env.LOG_LEVEL
}

/** 检查环境变量 */
async function checkEnv() {
  const dotenv = require('dotenv')
  const dotenvPath = path.resolve(userHome, '.env')
  const hasEnv = await pathExists(dotenvPath)
  if (hasEnv) {
    config = dotenv.config({ path: dotenvPath })
  }
  createDefaultConfig()
  log.verbose('环境变量', process.env.CLI_HOME_PATH)
}

function createDefaultConfig() {
  const cliConfig = {
    home: userHome,
  }
  if (process.env.CLI_HOME) {
    cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME)
  } else {
    cliConfig['cliHome'] = path.join(userHome, CLI_HOME_PATH)
  }
  process.env.CLI_HOME_PATH = cliConfig['cliHome']
}

/** 检查当前版本是否是最新版本 */
async function checkGlobalUpdate() {
  // 拿到当前的模块版本号和模块名
  const currentVersion = pkg.version
  const npmName = pkg.name
  const latestVersion = await npmInfo.getNpmSemverVersion(
    npmName,
    currentVersion
  )
  // 调用npm的接口 拿到所有的版本号
  // 提醒用户更新
  if (latestVersion && semver.gt(latestVersion, currentVersion)) {
    log.warn(
      `请手动更新${npmName},当前版本:${currentVersion},最新版本:${latestVersion}`
    )
  }
}
