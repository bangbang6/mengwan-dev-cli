const pkg = require('../package.json')
const log = require('@mengwan-dev-cli/log')
const npmInfo = require('@mengwan-dev-cli/get-npm-info')
const semver = require('semver')
const colors = require('colors') // 打印在控制台的字符串样式
const userHome = require('user-home')
const pathExists = require('path-exists')
const path = require('path')
const commander = require('commander')

const program = new commander.Command()
const { LOWEAST_NODE_VERSION, CLI_HOME_PATH } = require('./const')
const init = require('@mengwan-dev-cli/init')
const exec = require('@mengwan-dev-cli/exec')
let config
const core = async () => {
  try {
    await prepare()
    registerCommand()
  } catch (e) {
    log.error(e.message)
  }
}
module.exports = core

//注册命令
function registerCommand() {
  program
    .version(pkg.version)
    .name(Object.keys(pkg.bin)[0])
    .usage('<command> [options]')
    .option('-d --debug', '是否开启调试模式', false)

  //! 注册init命令
  program
    .command('init <projectName>')
    .option('-f --force', '是否强制初始化项目')
    .option('-tp --targetPath <targetPath>', '是否指定调试路径')
    .action((...arguments) => {
      const targetPath = arguments[arguments.length - 2].targetPath
      console.log('targetPath', targetPath)
      process.env.TARGET_PATH = targetPath
      exec(program.args[0], ...arguments)
    })

  //! 监听输入了-d
  program.on('option:debug', () => {
    if (program.opts().debug) {
      process.env.LOG_LEVEL = 'verbose'
    } else {
      process.env.LOG_LEVEL = 'info'
    }
    log.level = process.env.LOG_LEVEL
  })
  //! 未知命令监听
  program.on('command:*', (obj) => {
    const avaliableCommands = program.commands.map((cmd) => cmd.name())
    console.log('colors', colors.red('未知的命令:' + obj[0]))
    console.log(
      'colors',
      colors.red('可用的命令:' + avaliableCommands.join(','))
    )
  })
  // //! 不输入命令的时候输出帮助文档
  // if (program.args && program.args.length < 1) {
  //   program.outputHelp()
  // }
  program.parse(program.argv) //! 一定要加解析参数
}

function checkVersion() {
  log.notice('当前版本号', pkg.version)
}

const checkNodeVersion = () => {
  const currentVersion = process.version
  // 本包node api最小的版本
  if (!semver.gte(currentVersion, LOWEAST_NODE_VERSION)) {
    throw new Error(`mw-cli 需要安装${LOWEAST_NODE_VERSION}以上版本`.rainbow)
  }
}

function checkRoot() {
  const rootCheck = require('root-check')
  rootCheck() //自动降低root账户 避免拥护使用cli时候权限高保存文件 权限出问题
  //如果一个文件是root账户创建的，那么普通用户是无法操作的，所以会报错各种权限问题
}
/** 检查用户主目录 为什么 因为要下载包地址 */
function checkUserHome() {
  if (!userHome || !pathExists(userHome)) {
    throw new Error('当前登录用户主目录不存在'.red)
  }
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

const prepare = async () => {
  // 检查mw-cli的包版本号
  checkVersion()
  // 检查node版本
  checkNodeVersion()
  // 检查root权限
  checkRoot()
  // 检查主目录
  checkUserHome()

  // 检查环境变量
  checkEnv()
  // 检查版本更新
  await checkGlobalUpdate()
}
