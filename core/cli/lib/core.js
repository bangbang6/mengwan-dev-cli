'use strict';

const log = require('@mengwan-cli-dev/log')
const pathExist =import('path-exists');
module.exports = core;
const {LOWNODE} = require('./const') 
const semver = require('semver')
const colors = require('colors')
// const rootCheck = require('root-check')
const userHome = import('user-home')
var minimist = require('minimist')
const path = require('path')
const getNmpInfo = require('@mengwan-cli-dev/get-npm-info')
let argv
checkInputArgs()

//!require 支持 .js/json/.node 三种类型
//.js必须有module.exports
//json 会调用json.parse解析并输出对象
//.node c++插件 通过dopen打开插件
//file.txt  里面有modedule.exports 也能支持
//!即任何一种文件 会用js的方式解析 即有module.exports 即可
const pkg = require('../package.json');
function core() {
    // TODO
        checkPkgVersion()
        checkNodeVersion()
        checkRoot()
        checkUserHome()
        checkEnv()
        checkGrobalUpdate()
    
   
}
function checkPkgVersion(){
    log.success('v',pkg.version)
}
function checkNodeVersion(){
    const ver = process.version
    if(!semver.gte(ver,LOWNODE)){
        throw new Error(colors.blue('Node低'))
    }

}
function checkRoot(){
//    rootCheck()
}
function checkUserHome(){
userHome.then(res=>{
    pathExist.then(res2=>{
        if(!res2.pathExistsSync(res.default)){
            throw new Error((colors.red('主目录不存在')))
        }
    }

    )
})
}
function checkInputArgs(){
     argv = minimist(process.argv.slice(2))
    console.log('argv',argv);
    checkDebug()
    log.verbose('verbose')
}
function checkDebug(){
    if(argv.debug){
        process.env.LOG_LEVEL = 'i'
    }else{
        process.env.LOG_LEVEL = 'info'

    }
    log.level = process.env.LOG_LEVEL
}
function checkEnv(){
    const dotenv =require('dotenv')
    const config = dotenv.config({})
    log.verbose('环境变量',config)
    console.log('config',config);
    let config2 = createDefaultHome(config)

    log.verbose('环境变量', process.env.HOME_PATH)


}
function createDefaultHome(config){
    const userHome = 'C:\\Users\\legion'
    const cliConfig = {
        home:userHome
    }
    if(config.parsed.Cli_HOME){
        cliConfig['cliHome'] = path.join(userHome,config.parsed.Cli_HOME)
    }else{
        cliConfig['cliHome'] = path.join(userHome,".mengwan-cli")

    }
    process.env.HOME_PATH = cliConfig['cliHome']
    return cliConfig
}
//检测开发的模块是否需要更新 即开发的版本  线上的版本比本地的高
async function checkGrobalUpdate(){
    const curVer = pkg.version
    const npmName = pkg.name
    const newV = await getNmpInfo(npmName,curVer)
    console.log('newV',newV);
    if(newV && semver.gt(newV,curVer)){
        log.warn(colors.yellow(`请手动更新 ${npmName}包`))
    }
}
module.exports = core