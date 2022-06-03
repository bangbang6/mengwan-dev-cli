#! /usr/bin/env node

const yargs = require('yargs/yargs')
require('@mengwan-cli-dev/utils')()
const {hideBin} = require('yargs/helpers')
console.log('hideBin',hideBin(process.argv));
const arg = hideBin(process.argv)
console.log('hello wan12w')
const cli = yargs(arg)
const argv = process.argv.slice(2)
cli.strict().usage('mengwan-cli <command> [options]').demandCommand(1,'a command is required').recommendCommands().fail((msg,err)=>{
  console.log('error:',msg);
}) //推荐最近的commands 以及失败的回调
.alias('v',"version").wrap(200).epilogue("this is foot").options({
  debug:{
    type:"boolean",
    describe:"bootstrape debug mode",
    alias:'d'
  }//定义选项 即自己的命令 比如原生的version等
}).group(['debug'],"Global options") //!所有的options进行分组
.command('init [name]','init a pro',(yargs)=>{
  yargs.option('name',{
    type:'string',
    describe:"init a namrr"
  })//一般用来定义option
},(argv)=>{
  console.log('argv',argv);
}) //指令格式 指令描述 指令builder 即执行前函数 指令handler 即执行时候函数
.parse(argv,{
  immocVersion:"1.0"
}) //合并后作为参数输入到cli脚手架参数
.argv;